const cloud = require('wx-server-sdk');
const { now, buildSuccess, buildError, COLLECTIONS } = require('../shared');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

async function listPublishedCourses() {
  const { data } = await db
    .collection(COLLECTIONS.COURSES)
    .where({
      published: true
    })
    .orderBy('sort', 'asc')
    .orderBy('updatedAt', 'desc')
    .get();

  return data;
}

async function getCourseDetail(id) {
  const { data } = await db
    .collection(COLLECTIONS.COURSES)
    .where({
      _id: id,
      published: true
    })
    .limit(1)
    .get();

  return data[0] || null;
}

async function listPublishedActivities(status) {
  const query = {
    published: true
  };

  if (status && status !== '全部') {
    query.status = status;
  }

  const { data } = await db
    .collection(COLLECTIONS.ACTIVITIES)
    .where(query)
    .orderBy('date', 'asc')
    .orderBy('startTime', 'asc')
    .get();

  return data.map((item) => ({
    ...item,
    remaining: Math.max((item.capacity || 0) - (item.enrolled || 0), 0)
  }));
}

async function getActivityDetail(id) {
  const { data } = await db
    .collection(COLLECTIONS.ACTIVITIES)
    .where({
      _id: id,
      published: true
    })
    .limit(1)
    .get();

  if (!data[0]) {
    return null;
  }

  return {
    ...data[0],
    remaining: Math.max((data[0].capacity || 0) - (data[0].enrolled || 0), 0)
  };
}

async function getSiteSettings() {
  const { data } = await db
    .collection(COLLECTIONS.SITE_SETTINGS)
    .where({
      key: 'portal'
    })
    .limit(1)
    .get();

  return data[0] || null;
}

async function getPortalHomeData() {
  const [courses, activities, siteSettings, signupsAgg] = await Promise.all([
    listPublishedCourses(),
    listPublishedActivities('全部'),
    getSiteSettings(),
    db.collection(COLLECTIONS.SIGNUPS).count()
  ]);

  const featuredCourseIds = siteSettings?.featuredCourseIds || [];
  const featuredActivityIds = siteSettings?.featuredActivityIds || [];

  const featuredCourses = featuredCourseIds.length
    ? featuredCourseIds
        .map((id) => courses.find((item) => item._id === id))
        .filter(Boolean)
    : courses.slice(0, 3);

  const upcomingActivities = featuredActivityIds.length
    ? featuredActivityIds
        .map((id) => activities.find((item) => item._id === id))
        .filter(Boolean)
    : activities.slice(0, 3);

  return {
    site: siteSettings || {
      name: '星河艺术中心',
      slogan: '专业艺术教育与招生运营一体化',
      highlights: [
        '分龄分班教学',
        '课程与活动一体化招生',
        '支持云端内容运营'
      ]
    },
    stats: {
      courseCount: courses.length,
      activityCount: activities.length,
      signupCount: signupsAgg.total
    },
    featuredCourses,
    upcomingActivities
  };
}

exports.main = async (event = {}) => {
  try {
    const { action, payload = {} } = event;

    switch (action) {
      case 'getHomeData':
        return buildSuccess(await getPortalHomeData());
      case 'listCourses':
        return buildSuccess(await listPublishedCourses());
      case 'getCourseDetail':
        return buildSuccess(await getCourseDetail(payload.id));
      case 'listActivities':
        return buildSuccess(await listPublishedActivities(payload.status || '全部'));
      case 'getActivityDetail':
        return buildSuccess(await getActivityDetail(payload.id));
      case 'getSiteSettings':
        return buildSuccess(await getSiteSettings());
      case 'getMeta':
        return buildSuccess({
          fetchedAt: now(),
          activityStatuses: ['全部', '报名中', '余位不多', '已结束']
        });
      default:
        return buildError('UNKNOWN_ACTION', '不支持的公开接口动作');
    }
  } catch (error) {
    return buildError('PORTAL_FAILED', error.message || '公开数据加载失败');
  }
};
