const cloud = require('wx-server-sdk');

let initialized = false;

function initCloud() {
  if (!initialized) {
    cloud.init({
      env: cloud.DYNAMIC_CURRENT_ENV
    });
    initialized = true;
  }

  return {
    cloud,
    db: cloud.database(),
    _: cloud.database().command
  };
}

function createSuccess(data = {}, message = 'ok') {
  return {
    success: true,
    message,
    data
  };
}

function createError(message = '请求失败', code = 'REQUEST_FAILED', details) {
  return {
    success: false,
    message,
    code,
    details
  };
}

function assertRequired(value, message) {
  if (value === undefined || value === null || value === '') {
    throw new Error(message);
  }
}

function normalizeTimestamp() {
  return new Date();
}

function buildPageResult(list, total, pageNo, pageSize) {
  return {
    list,
    total,
    pageNo,
    pageSize,
    hasMore: pageNo * pageSize < total
  };
}

module.exports = {
  initCloud,
  createSuccess,
  createError,
  assertRequired,
  normalizeTimestamp,
  buildPageResult
};
