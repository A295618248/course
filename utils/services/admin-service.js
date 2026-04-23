const { callCloudFunction, uploadImageToCloud } = require('../cloud');

function ensureAdmin() {
  return callCloudFunction('auth', {
    action: 'status'
  });
}

function bindFirstAdmin(name) {
  return callCloudFunction('auth', {
    action: 'bindFirstAdmin',
    name
  });
}

function getDashboardStats() {
  return callCloudFunction('adminDashboard', {
    action: 'overview'
  });
}

function listAdminCourses() {
  return callCloudFunction('adminContent', {
    action: 'listCourses'
  });
}

function listAdminActivities() {
  return callCloudFunction('adminContent', {
    action: 'listActivities'
  });
}

function listAdminSignups(payload = {}) {
  return callCloudFunction('adminContent', {
    action: 'listSignups',
    payload
  });
}

function saveCourse(payload) {
  return callCloudFunction('adminContent', {
    action: 'saveCourse',
    payload
  });
}

function saveActivity(payload) {
  return callCloudFunction('adminContent', {
    action: 'saveActivity',
    payload
  });
}

function getSiteSettings() {
  return callCloudFunction('adminContent', {
    action: 'getSiteSettings'
  });
}

function updateSiteSettings(payload) {
  return callCloudFunction('adminContent', {
    action: 'updateSiteSettings',
    payload
  });
}

function uploadImage(filePath, folder) {
  return uploadImageToCloud(filePath, folder || 'admin');
}

function bootstrapData(reset) {
  return callCloudFunction('bootstrapData', {
    action: 'seed',
    reset: Boolean(reset)
  });
}

module.exports = {
  ensureAdmin,
  bindFirstAdmin,
  getDashboardStats,
  listAdminCourses,
  listAdminActivities,
  listAdminSignups,
  saveCourse,
  saveActivity,
  getSiteSettings,
  updateSiteSettings,
  uploadImage,
  bootstrapData
};
