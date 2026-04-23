const cloud = require('wx-server-sdk');
const {
  COLLECTIONS,
  requireAdmin,
  toPlainList,
  formatDateKey
} = require('../shared');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

function buildEmptySeries(days) {
  const series = {};
  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - index);
    const key = formatDateKey(date);
    series[key] = 0;
  }
  return series;
}

function toCountArray(series) {
  return Object.keys(series).map((date) => ({
    date,
    count: series[date]
  }));
}

exports.main = async (event = {}) => {
  const { OPENID } = cloud.getWXContext();
  await requireAdmin(OPENID);

  const [courseResp, activityResp, signupResp] = await Promise.all([
    db.collection(COLLECTIONS.COURSES).count(),
    db.collection(COLLECTIONS.ACTIVITIES).count(),
    db.collection(COLLECTIONS.SIGNUPS).orderBy('createdAt', 'desc').limit(100).get()
  ]);

  const signups = toPlainList(signupResp);
  const totals = {
    courses: courseResp.total,
    activities: activityResp.total,
    signups: signupResp.data.length
  };

  const byType = {
    course: 0,
    activity: 0,
    general: 0
  };

  const recentSeries = buildEmptySeries(7);

  signups.forEach((item) => {
    const type = item.businessType || 'general';
    if (Object.prototype.hasOwnProperty.call(byType, type)) {
      byType[type] += 1;
    }
    const dateKey = item.createdAt ? formatDateKey(new Date(item.createdAt)) : '';
    if (recentSeries[dateKey] !== undefined) {
      recentSeries[dateKey] += 1;
    }
  });

  const hottestCourses = signups
    .filter((item) => item.businessType === 'course')
    .reduce((acc, item) => {
      const key = item.targetId || item.targetTitle;
      if (!key) {
        return acc;
      }
      if (!acc[key]) {
        acc[key] = {
          id: item.targetId || key,
          title: item.targetTitle,
          count: 0
        };
      }
      acc[key].count += 1;
      return acc;
    }, {});

  const hottestActivities = signups
    .filter((item) => item.businessType === 'activity')
    .reduce((acc, item) => {
      const key = item.targetId || item.targetTitle;
      if (!key) {
        return acc;
      }
      if (!acc[key]) {
        acc[key] = {
          id: item.targetId || key,
          title: item.targetTitle,
          count: 0
        };
      }
      acc[key].count += 1;
      return acc;
    }, {});

  return {
    ok: true,
    data: {
      totals,
      byType,
      recentTrend: toCountArray(recentSeries),
      hottestCourses: Object.values(hottestCourses).sort((a, b) => b.count - a.count).slice(0, 5),
      hottestActivities: Object.values(hottestActivities).sort((a, b) => b.count - a.count).slice(0, 5),
      latestSignups: signups.slice(0, 10)
    }
  };
};
