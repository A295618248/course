const { callFunction } = require('../cloud');

function getPortalHome() {
  return callFunction('portal', {
    action: 'getHomeData'
  });
}

function listCourses() {
  return callFunction('portal', {
    action: 'listCourses'
  });
}

function fetchCourseDetail(id) {
  return callFunction('portal', {
    action: 'getCourseDetail',
    payload: {
      id
    }
  });
}

function listActivities(status) {
  return callFunction('portal', {
    action: 'listActivities',
    payload: {
      status
    }
  });
}

function fetchActivityDetail(id) {
  return callFunction('portal', {
    action: 'getActivityDetail',
    payload: {
      id
    }
  });
}

function submitSignupForm(payload) {
  return callFunction('submitSignup', payload);
}

function fetchMySignups() {
  return callFunction('adminContent', {
    action: 'listMySignups'
  });
}

module.exports = {
  getPortalHome,
  listCourses,
  fetchCourseDetail,
  listActivities,
  fetchActivityDetail,
  submitSignupForm,
  fetchMySignups
};
