App({
  globalData: {
    brandName: '星河艺术中心'
  },

  onLaunch() {
    const logs = wx.getStorageSync('launchLogs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('launchLogs', logs.slice(0, 20));
  }
});
