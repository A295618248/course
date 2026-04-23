const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const COLLECTIONS = {
  COURSES: 'courses',
  ACTIVITIES: 'activities',
  SIGNUPS: 'signups',
  SITE_SETTINGS: 'site_settings'
};

function success(data = {}, message = 'ok') {
  return {
    success: true,
    message,
    data
  };
}

function fail(message = '请求失败', code = 'REQUEST_FAILED') {
  return {
    success: false,
    message,
    code
  };
}

function mapDoc(doc) {
  if (!doc) {
    return null;
  }

  return {
    ...doc,
    id: doc._id
  };
}

async function listPublishedCourses() {
  const { data } = await db
    .collection(COLLECTIONS.COURSES)
    .where({
      published: true
    })
    .orderBy('sortOrder', 'asc')
    .orderBy('updatedAt', 'desc')
    .get();

  return data.map(mapDoc);
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

  return mapDoc(data[0]);
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
    .get();

  return data.map((item) => ({
    ...mapDoc(item),
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
    ...mapDoc(data[0]),
    remaining: Math.max((data[0].capacity || 0) - (data[0].enrolled || 0), 0)
  };
}

async function getSiteSettings() {
  const { data } = await db
    .collection(COLLECTIONS.SITE_SETTINGS)
    .limit(1)
    .get();

  return mapDoc(data[0]) || null;
}

async function getPortalHomeData() {
  const [courses, activities, siteSettings, signupsAgg] = await Promise.all([
    listPublishedCourses(),
    listPublishedActivities('全部'),
    getSiteSettings(),
    db.collection(COLLECTIONS.SIGNUPS).count()
  ]);

  return {
    site: siteSettings || {
      brandName: '星河艺术中心',
      heroTitle: '让每个孩子找到自己的艺术表达',
      heroSubtitle: '围绕课程、活动、试听与成长规划，打造适合艺术培训机构招生和运营的一体化小程序。'
    },
    stats: {
      courseCount: courses.length,
      activityCount: activities.length,
      signupCount: signupsAgg.total
    },
    featuredCourses: courses.slice(0, 3),
    upcomingActivities: activities.slice(0, 3)
  };
}

exports.main = async (event = {}) => {
  try {
    const { action, payload = {} } = event;

    switch (action) {
      case 'getHomeData':
        return success(await getPortalHomeData());
      case 'listCourses':
        return success(await listPublishedCourses());
      case 'getCourseDetail':
        return success(await getCourseDetail(payload.id));
      case 'listActivities':
        return success(await listPublishedActivities(payload.status || '全部'));
      case 'getActivityDetail':
        return success(await getActivityDetail(payload.id));
      case 'getSiteSettings':
        return success(await getSiteSettings());
      default:
        return fail('不支持的公开接口动作', 'UNKNOWN_ACTION');
    }
  } catch (error) {
    return fail(error.message || '公开数据加载失败', 'PORTAL_FAILED');
  }
};
