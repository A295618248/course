const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

function trimValue(value) {
  return String(value || '').trim();
}

function assertRequired(value, message) {
  if (!trimValue(value)) {
    throw new Error(message);
  }
}

function validatePayload(data) {
  assertRequired(data.parentName, '请填写家长姓名');
  assertRequired(data.phone, '请填写联系电话');
  assertRequired(data.studentName, '请填写学员姓名');
  assertRequired(data.preferredTime, '请选择意向时间');
  assertRequired(data.businessType, '请选择报名类型');

  const phone = trimValue(data.phone).replace(/\s+/g, '');
  if (!/^1\d{10}$/.test(phone)) {
    throw new Error('请填写正确的手机号');
  }

  const age = Number(data.age);
  if (!Number.isInteger(age) || age < 3 || age > 18) {
    throw new Error('学员年龄需在 3-18 岁');
  }

  return {
    parentName: trimValue(data.parentName),
    phone,
    studentName: trimValue(data.studentName),
    age,
    interest: trimValue(data.interest),
    preferredTime: trimValue(data.preferredTime),
    remark: trimValue(data.remark),
    businessType: trimValue(data.businessType),
    targetId: trimValue(data.targetId),
    targetTitle: trimValue(data.targetTitle),
    targetSubtitle: trimValue(data.targetSubtitle),
    sourceChannel: trimValue(data.sourceChannel || 'miniprogram')
  };
}

async function updateTargetEnrollment(record) {
  if (record.businessType !== 'activity' || !record.targetId) {
    return;
  }

  await db.collection('activities').doc(record.targetId).update({
    data: {
      enrolled: _.inc(1),
      updatedAt: new Date()
    }
  });
}

exports.main = async (event = {}) => {
  try {
    const payload = validatePayload(event);
    const { OPENID } = cloud.getWXContext();
    const timestamp = new Date();
    const duplicateKey = `${payload.phone}_${payload.targetId || payload.businessType}`;
    const existing = await db.collection('signups').where({
      duplicateKey,
      openid: OPENID
    }).count();

    if (existing.total > 0) {
      throw new Error('您已经提交过相同报名，请勿重复提交');
    }

    const record = {
      ...payload,
      duplicateKey,
      openid: OPENID,
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
        createdAtText: `${timestamp.getFullYear()}-${String(timestamp.getMonth() + 1).padStart(2, '0')}-${String(
          timestamp.getDate()
        ).padStart(2, '0')} ${String(timestamp.getHours()).padStart(2, '0')}:${String(timestamp.getMinutes()).padStart(2, '0')}`,
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
