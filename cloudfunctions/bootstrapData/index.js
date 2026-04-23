const cloud = require('wx-server-sdk');
const {
  COLLECTIONS,
  now,
  buildSlug,
  seedCourses,
  seedActivities,
  seedSiteSettings,
  seedAdmins
} = require('../shared');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

async function clearCollection(collectionName) {
  const collection = db.collection(collectionName);
  while (true) {
    const snapshot = await collection.limit(100).get();
    if (!snapshot.data.length) {
      break;
    }
    const tasks = snapshot.data.map((item) => collection.doc(item._id).remove());
    await Promise.all(tasks);
  }
}

async function insertMany(collectionName, list) {
  const collection = db.collection(collectionName);
  for (const item of list) {
    await collection.add({
      data: item
    });
  }
}

exports.main = async (event = {}) => {
  const shouldReset = Boolean(event.reset);
  const timestamp = now();

  if (shouldReset) {
    await clearCollection(COLLECTIONS.COURSES);
    await clearCollection(COLLECTIONS.ACTIVITIES);
    await clearCollection(COLLECTIONS.ADMINS);
    await clearCollection(COLLECTIONS.SITE_SETTINGS);
  }

  const courses = seedCourses.map((item) => ({
    ...item,
    slug: buildSlug(item.title),
    createdAt: timestamp,
    updatedAt: timestamp
  }));

  const activities = seedActivities.map((item) => ({
    ...item,
    slug: buildSlug(item.title),
    remaining: Math.max(item.capacity - item.enrolled, 0),
    createdAt: timestamp,
    updatedAt: timestamp
  }));

  const admins = seedAdmins.map((item) => ({
    ...item,
    createdAt: timestamp,
    updatedAt: timestamp
  }));

  const settings = {
    ...seedSiteSettings,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  await insertMany(COLLECTIONS.COURSES, courses);
  await insertMany(COLLECTIONS.ACTIVITIES, activities);
  await insertMany(COLLECTIONS.ADMINS, admins);
  await db.collection(COLLECTIONS.SITE_SETTINGS).add({
    data: settings
  });

  return {
    success: true,
    message: '基础数据初始化完成',
    counts: {
      courses: courses.length,
      activities: activities.length,
      admins: admins.length,
      settings: 1
    }
  };
};
