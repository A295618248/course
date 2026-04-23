const cloud = require('wx-server-sdk');
const { COLLECTIONS, success, fail, requireAdmin } = require('../shared');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event) => {
  const action = event.action || 'status';
  const wxContext = cloud.getWXContext();

  try {
    if (action === 'status') {
      const admin = await requireAdmin(wxContext.OPENID);
      return success({
        openid: wxContext.OPENID,
        isAdmin: Boolean(admin),
        admin: admin
          ? {
              role: admin.role,
              name: admin.name
            }
          : null
      });
    }

    if (action === 'bindFirstAdmin') {
      const current = await db.collection(COLLECTIONS.ADMINS).limit(1).get();
      if (current.data.length) {
        return fail('管理员已初始化，请前往数据库中维护管理员列表');
      }

      await db.collection(COLLECTIONS.ADMINS).add({
        data: {
          openid: wxContext.OPENID,
          role: 'super_admin',
          name: event.name || '超级管理员',
          createdAt: new Date()
        }
      });

      return success({
        openid: wxContext.OPENID,
        isAdmin: true
      });
    }

    return fail('不支持的操作');
  } catch (error) {
    return fail(error.message || '鉴权失败');
  }
};
