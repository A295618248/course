const cloud = require('wx-server-sdk');
const {
  now,
  getDb,
  getOpenId,
  assertRequired,
  normalizeText,
  normalizePhone,
  buildError
} = require('../shared');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = getDb();
const _ = db.command;

function validatePayload(data) {
  assertRequired(data.parentName, '请填写家长姓名');
  assertRequired(data.phone, '请填写联系电话');
  assertRequired(data.studentName, '请填写学员姓名');
  assertRequired(data.preferredTime, '请选择意向时间');
  assertRequired(data.businessType, '请选择报名类型');

  const phone = normalizePhone(data.phone);
  if (!/^1\d{10}$/.test(phone)) {
    throw buildError('请填写正确的手机号');
  }

  const age = Number(data.age);
  if (!Number.isInteger(age) || age < 3 || age > 18) {
    throw buildError('学员年龄需在 3-18 岁');
  }

  return {
    parentName: normalizeText(data.parentName),
    phone,
    studentName: normalizeText(data.studentName),
    age,
    interest: normalizeText(data.interest),
    preferredTime: normalizeText(data.preferredTime),
    remark: normalizeText(data.remark),
    businessType: data.businessType,
    targetId: normalizeText(data.targetId),
    targetTitle: normalizeText(data.targetTitle),
    targetSubtitle: normalizeText(data.targetSubtitle),
    sourceChannel: normalizeText(data.sourceChannel || 'miniprogram')
  };
}

async function updateTargetEnrollment(record) {
  if (record.businessType !== 'activity' || !record.targetId) {
    return;
  }

  await db.collection('activities').where({
    slug: record.targetId
  }).update({
    data: {
      enrolledCount: _.inc(1),
      updatedAt: now()
    }
  });
}

exports.main = async (event) => {
  try {
    const payload = validatePayload(event || {});
    const openId = getOpenId();
    const timestamp = now();
    const duplicateKey = `${payload.phone}_${payload.targetId || payload.businessType}`;
    const existing = await db.collection('signups').where({
      duplicateKey,
      createdBy: openId
    }).count();

    if (existing.total > 0) {
      throw buildError('您已经提交过相同报名，请勿重复提交');
    }

    const record = {
      ...payload,
      duplicateKey,
      createdBy: openId,
      status: 'new',
      followUpStatus: 'pending',
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const result = await db.collection('signups').add({
      data: record
    });

    await updateTargetEnrollment(record);

    return {
      success: true,
      data: {
        id: result._id,
        ...record
      }
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || '报名提交失败'
    };
  }
};
