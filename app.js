const { CLOUD_ENV_ID, BRAND_NAME } = require('./utils/config');

App({
  globalData: {
    brandName: BRAND_NAME,
    cloudReady: false
  },

  onLaunch() {
    if (!wx.cloud) {
      wx.showModal({
        title: '基础库过低',
        content: '请升级微信版本后再使用本小程序。',
        showCancel: false
      });
      return;
    }

    wx.cloud.init({
      env: CLOUD_ENV_ID,
      traceUser: true
    });

    this.globalData.cloudReady = true;
  }
});
