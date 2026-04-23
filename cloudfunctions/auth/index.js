const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const ADMINS = 'admins';

function ok(data = {}, message = 'ok') {
  return {
    success: true,
    message,
    data
  };
}

function fail(message = '请求失败') {
  return {
    success: false,
    message
  };
}

async function getAdmin(openid) {
  const { data } = await db
    .collection(ADMINS)
    .where({
      openid
    })
    .limit(1)
    .get();

  const admin = data[0];
  if (!admin || admin.active === false) {
    return null;
  }

  return admin;
}

exports.main = async (event = {}) => {
  const action = event.action || 'status';
  const { OPENID } = cloud.getWXContext();

  try {
    if (action === 'status') {
      const [admin, countResult] = await Promise.all([
        getAdmin(OPENID),
        db.collection(ADMINS).count()
      ]);

      return ok({
        openid: OPENID,
        isAdmin: Boolean(admin),
        hasAnyAdmin: countResult.total > 0,
        admin: admin
          ? {
              name: admin.name || '管理员',
              role: admin.role || 'admin',
              mobile: admin.mobile || ''
            }
          : null
      });
    }

    if (action === 'bindFirstAdmin') {
      const current = await db.collection(ADMINS).count();
      if (current.total > 0) {
        const existingAdmin = await getAdmin(OPENID);
        if (existingAdmin) {
          return ok({
            openid: OPENID,
            isAdmin: true,
            admin: {
              name: existingAdmin.name || '管理员',
              role: existingAdmin.role || 'admin'
            }
          });
        }

        return fail('管理员已初始化，请在数据库 admins 集合中继续维护管理员账号');
      }

      await db.collection(ADMINS).add({
        data: {
          openid: OPENID,
          name: event.name || '超级管理员',
          role: 'super_admin',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      return ok({
        openid: OPENID,
        isAdmin: true,
        admin: {
          name: event.name || '超级管理员',
          role: 'super_admin'
        }
      }, '首个管理员绑定成功');
    }

    return fail('不支持的操作');
  } catch (error) {
    return fail(error.message || '鉴权失败');
  }
};
