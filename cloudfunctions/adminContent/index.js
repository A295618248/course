const cloud = require('wx-server-sdk');
const {
  COLLECTIONS,
  assertAdmin,
  timestamp,
  mapCourseDocument,
  mapActivityDocument
} = require('../shared');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const _ = db.command;

function buildCoursePayload(payload, context) {
  return {
    title: payload.title,
    category: payload.category,
    ageRange: payload.ageRange,
    duration: payload.duration,
    priceText: payload.priceText,
    priceValue: Number(payload.priceValue || 0),
    classSize: payload.classSize,
    summary: payload.summary,
    description: payload.description,
    schedule: payload.schedule,
    tags: payload.tags || [],
    highlights: payload.highlights || [],
    outline: payload.outline || [],
    coverImage: payload.coverImage || '',
    gallery: payload.gallery || [],
    published: payload.published !== false,
    sortOrder: Number(payload.sortOrder || 0),
    updatedAt: timestamp(),
    updatedBy: context.OPENID
  };
}

function buildActivityPayload(payload, context) {
  return {
    title: payload.title,
    type: payload.type,
    date: payload.date,
    time: payload.time,
    location: payload.location,
    capacity: Number(payload.capacity || 0),
    enrolled: Number(payload.enrolled || 0),
    fee: payload.fee,
    status: payload.status,
    summary: payload.summary,
    description: payload.description,
    agenda: payload.agenda || [],
    coverImage: payload.coverImage || '',
    gallery: payload.gallery || [],
    published: payload.published !== false,
    sortOrder: Number(payload.sortOrder || 0),
    updatedAt: timestamp(),
    updatedBy: context.OPENID
  };
}

async function listContent(type) {
  const collectionName = type === 'activity' ? COLLECTIONS.activities : COLLECTIONS.courses;
  const result = await db.collection(collectionName).orderBy('sortOrder', 'asc').orderBy('updatedAt', 'desc').get();
  return (result.data || []).map(type === 'activity' ? mapActivityDocument : mapCourseDocument);
}

async function saveContent(event, context) {
  const { type, payload = {}, id } = event;
  const collectionName = type === 'activity' ? COLLECTIONS.activities : COLLECTIONS.courses;
  const mapper = type === 'activity' ? buildActivityPayload : buildCoursePayload;
  const normalizedPayload = mapper(payload, context);

  if (id) {
    await db.collection(collectionName).doc(id).update({
      data: normalizedPayload
    });
    return { id };
  }

  const createdPayload = {
    ...normalizedPayload,
    createdAt: timestamp(),
    createdBy: context.OPENID
  };
  const result = await db.collection(collectionName).add({
    data: createdPayload
  });
  return { id: result._id };
}

async function removeContent(event) {
  const { type, id } = event;
  const collectionName = type === 'activity' ? COLLECTIONS.activities : COLLECTIONS.courses;
  await db.collection(collectionName).doc(id).remove();
  return { id };
}

async function updateSiteSettings(event, context) {
  const { payload = {} } = event;
  const current = await db.collection(COLLECTIONS.siteSettings).where({
    key: 'site-config'
  }).get();
  const data = {
    key: 'site-config',
    brandName: payload.brandName || '星河艺术中心',
    intro: payload.intro || '',
    phone: payload.phone || '',
    address: payload.address || '',
    bannerImages: payload.bannerImages || [],
    updatedAt: timestamp(),
    updatedBy: context.OPENID
  };

  if (current.data && current.data.length) {
    await db.collection(COLLECTIONS.siteSettings).doc(current.data[0]._id).update({ data });
    return data;
  }

  await db.collection(COLLECTIONS.siteSettings).add({ data });
  return data;
}

exports.main = async (event, context) => {
  try {
    await assertAdmin(context.OPENID);

    if (event.action === 'listContent') {
      const items = await listContent(event.type);
      return { success: true, data: items };
    }

    if (event.action === 'saveContent') {
      const result = await saveContent(event, context);
      return { success: true, data: result };
    }

    if (event.action === 'removeContent') {
      const result = await removeContent(event);
      return { success: true, data: result };
    }

    if (event.action === 'updateSiteSettings') {
      const data = await updateSiteSettings(event, context);
      return { success: true, data };
    }

    if (event.action === 'generateUploadUrl') {
      return {
        success: true,
        data: {
          folder: event.folder || 'uploads',
          timestamp: Date.now()
        }
      };
    }

    return {
      success: false,
      message: 'Unsupported action'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'adminContent failed'
    };
  }
};
