const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const COLLECTIONS = {
  COURSES: 'courses',
  ACTIVITIES: 'activities',
  SIGNUPS: 'signups',
  ADMINS: 'admins',
  SITE_SETTINGS: 'site_settings'
};

function ok(data, message = 'ok') {
  return {
    success: true,
    message,
    data
  };
}

function fail(message) {
  return {
    success: false,
    message
  };
}

function now() {
  return new Date();
}

async function requireAdmin(openid) {
  const result = await db.collection(COLLECTIONS.ADMINS).where({ openid }).limit(1).get();
  if (!result.data.length) {
    throw new Error('当前账号不是管理员');
  }
  return result.data[0];
}

function normalizeCourse(doc) {
  return {
    id: doc._id,
    ...doc
  };
}

function normalizeActivity(doc) {
  return {
    id: doc._id,
    remaining: Math.max((doc.capacity || 0) - (doc.enrolled || 0), 0),
    ...doc
  };
}

function buildCoursePayload(payload, openid) {
  return {
    title: payload.title || '',
    category: payload.category || '',
    ageRange: payload.ageRange || '',
    duration: payload.duration || '',
    priceText: payload.priceText || '',
    priceValue: Number(payload.priceValue || 0),
    classSize: payload.classSize || '',
    schedule: payload.schedule || '',
    summary: payload.summary || '',
    description: payload.description || '',
    tags: payload.tags || [],
    highlights: payload.highlights || [],
    outline: payload.outline || [],
    coverImage: payload.coverImage || '',
    published: payload.published !== false,
    sort: Number(payload.sort || 100),
    updatedAt: now(),
    updatedBy: openid
  };
}

function buildActivityPayload(payload, openid) {
  return {
    title: payload.title || '',
    type: payload.type || '',
    date: payload.date || '',
    time: payload.time || '',
    location: payload.location || '',
    capacity: Number(payload.capacity || 0),
    enrolled: Number(payload.enrolled || 0),
    fee: payload.fee || '',
    status: payload.status || '报名中',
    summary: payload.summary || '',
    description: payload.description || '',
    agenda: payload.agenda || [],
    coverImage: payload.coverImage || '',
    published: payload.published !== false,
    sortOrder: Number(payload.sortOrder || 100),
    updatedAt: now(),
    updatedBy: openid
  };
}

async function listCourses() {
  const result = await db.collection(COLLECTIONS.COURSES).orderBy('sort', 'asc').orderBy('updatedAt', 'desc').get();
  return result.data.map(normalizeCourse);
}

async function listActivities() {
  const result = await db.collection(COLLECTIONS.ACTIVITIES).orderBy('sortOrder', 'asc').orderBy('updatedAt', 'desc').get();
  return result.data.map(normalizeActivity);
}

async function listSignups() {
  const result = await db.collection(COLLECTIONS.SIGNUPS).orderBy('createdAt', 'desc').limit(200).get();
  return result.data.map((item) => ({
    id: item._id,
    ...item
  }));
}

async function listMySignups(openid) {
  const result = await db.collection(COLLECTIONS.SIGNUPS).where({ createdBy: openid }).orderBy('createdAt', 'desc').limit(100).get();
  return result.data.map((item) => ({
    id: item._id,
    ...item,
    createdAtText: item.createdAt ? new Date(item.createdAt).toLocaleString('zh-CN', { hour12: false }) : ''
  }));
}

async function saveCourse(payload, openid) {
  const data = buildCoursePayload(payload, openid);

  if (payload.id) {
    await db.collection(COLLECTIONS.COURSES).doc(payload.id).update({
      data
    });
    return {
      id: payload.id
    };
  }

  const result = await db.collection(COLLECTIONS.COURSES).add({
    data: {
      ...data,
      createdAt: now(),
      createdBy: openid
    }
  });

  return {
    id: result._id
  };
}

async function saveActivity(payload, openid) {
  const data = buildActivityPayload(payload, openid);

  if (payload.id) {
    await db.collection(COLLECTIONS.ACTIVITIES).doc(payload.id).update({
      data
    });
    return {
      id: payload.id
    };
  }

  const result = await db.collection(COLLECTIONS.ACTIVITIES).add({
    data: {
      ...data,
      createdAt: now(),
      createdBy: openid
    }
  });

  return {
    id: result._id
  };
}

async function getSiteSettings() {
  const result = await db.collection(COLLECTIONS.SITE_SETTINGS).where({ key: 'portal' }).limit(1).get();
  return result.data[0] || null;
}

async function updateSiteSettings(payload, openid) {
  const current = await getSiteSettings();
  const data = {
    key: 'portal',
    brandName: payload.brandName || '星河艺术中心',
    heroTitle: payload.heroTitle || '',
    heroSubtitle: payload.heroSubtitle || '',
    contactPhone: payload.contactPhone || '',
    address: payload.address || '',
    intro: payload.intro || '',
    serviceNotice: payload.serviceNotice || '',
    bannerImages: payload.bannerImages || [],
    updatedAt: now(),
    updatedBy: openid
  };

  if (current && current._id) {
    await db.collection(COLLECTIONS.SITE_SETTINGS).doc(current._id).update({
      data
    });
    return data;
  }

  await db.collection(COLLECTIONS.SITE_SETTINGS).add({
    data: {
      ...data,
      createdAt: now()
    }
  });

  return data;
}

exports.main = async (event = {}) => {
  const { OPENID } = cloud.getWXContext();

  try {
    if (event.action === 'listMySignups') {
      return ok(await listMySignups(OPENID));
    }

    await requireAdmin(OPENID);

    switch (event.action) {
      case 'listCourses':
        return ok(await listCourses());
      case 'listActivities':
        return ok(await listActivities());
      case 'listSignups':
        return ok(await listSignups());
      case 'saveCourse':
        return ok(await saveCourse(event.payload || {}, OPENID));
      case 'saveActivity':
        return ok(await saveActivity(event.payload || {}, OPENID));
      case 'getSiteSettings':
        return ok(await getSiteSettings());
      case 'updateSiteSettings':
        return ok(await updateSiteSettings(event.payload || {}, OPENID));
      default:
        return fail('不支持的管理操作');
    }
  } catch (error) {
    return fail(error.message || '管理接口执行失败');
  }
};
