const STORAGE_KEY = 'artCenterSignups';

function readSignups() {
  return wx.getStorageSync(STORAGE_KEY) || [];
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function saveSignup(payload) {
  const records = readSignups();
  const now = new Date();
  const record = {
    id: `signup_${now.getTime()}`,
    createdAt: now.toISOString(),
    createdAtText: formatDate(now),
    ...payload
  };
  records.unshift(record);
  wx.setStorageSync(STORAGE_KEY, records);
  return record;
}

function clearSignups() {
  wx.removeStorageSync(STORAGE_KEY);
}

function getSignupStats() {
  return readSignups().reduce(
    (acc, item) => {
      acc.total += 1;
      if (item.businessType === 'course') {
        acc.course += 1;
      } else if (item.businessType === 'activity') {
        acc.activity += 1;
      } else {
        acc.general += 1;
      }
      return acc;
    },
    { total: 0, course: 0, activity: 0, general: 0 }
  );
}

module.exports = {
  readSignups,
  saveSignup,
  clearSignups,
  getSignupStats
};
