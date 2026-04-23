const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const COLLECTIONS = {
  courses: 'courses',
  activities: 'activities',
  signups: 'signups',
  admins: 'admins'
};

function buildSuccess(data) {
  return {
    success: true,
    data
  };
}

function buildError(message) {
  return {
    success: false,
    message
  };
}

async function requireAdmin(openid) {
  const { data } = await db
    .collection(COLLECTIONS.admins)
    .where({
      openid
    })
    .limit(1)
    .get();

  if (!data.length) {
    throw new Error('当前账号不是管理员');
  }
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildEmptySeries(days) {
  const series = {};
  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - index);
    series[formatDateKey(date)] = 0;
  }
  return series;
}

function toCountArray(series) {
  return Object.keys(series).map((date) => ({
    date,
    count: series[date]
  }));
}

exports.main = async () => {
  try {
    const { OPENID } = cloud.getWXContext();
    await requireAdmin(OPENID);

    const [courseResp, activityResp, coursePublishedResp, activityPublishedResp, signupResp] = await Promise.all([
      db.collection(COLLECTIONS.courses).count(),
      db.collection(COLLECTIONS.activities).count(),
      db.collection(COLLECTIONS.courses).where({ published: true }).count(),
      db.collection(COLLECTIONS.activities).where({ published: true }).count(),
      db.collection(COLLECTIONS.signups).orderBy('createdAt', 'desc').limit(200).get()
    ]);

    const signups = signupResp.data || [];
    const totals = {
      courses: courseResp.total || 0,
      activities: activityResp.total || 0,
      signups: signups.length
    };
    const published = {
      courses: coursePublishedResp.total || 0,
      activities: activityPublishedResp.total || 0
    };

    const byType = {
      course: 0,
      activity: 0,
      general: 0
    };
    const recentSeries = buildEmptySeries(7);
    const hottestCourses = {};
    const hottestActivities = {};

    signups.forEach((item) => {
      const type = item.businessType || 'general';
      if (Object.prototype.hasOwnProperty.call(byType, type)) {
        byType[type] += 1;
      }

      const dateKey = item.createdAt ? formatDateKey(new Date(item.createdAt)) : '';
      if (recentSeries[dateKey] !== undefined) {
        recentSeries[dateKey] += 1;
      }

      if (type === 'course') {
        const key = item.targetId || item.targetTitle;
        if (key) {
          hottestCourses[key] = hottestCourses[key] || {
            id: item.targetId || key,
            title: item.targetTitle || '未命名课程',
            count: 0
          };
          hottestCourses[key].count += 1;
        }
      }

      if (type === 'activity') {
        const key = item.targetId || item.targetTitle;
        if (key) {
          hottestActivities[key] = hottestActivities[key] || {
            id: item.targetId || key,
            title: item.targetTitle || '未命名活动',
            count: 0
          };
          hottestActivities[key].count += 1;
        }
      }
    });

    return buildSuccess({
      totals,
      published,
      byType,
      recentTrend: toCountArray(recentSeries),
      hottestCourses: Object.values(hottestCourses).sort((a, b) => b.count - a.count).slice(0, 5),
      hottestActivities: Object.values(hottestActivities).sort((a, b) => b.count - a.count).slice(0, 5),
      latestSignups: signups.slice(0, 10)
    });
  } catch (error) {
    return buildError(error.message || '统计加载失败');
  }
};
