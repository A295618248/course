const { fetchActivityDetail } = require('../../utils/services/public-service');

Page({
  data: {
    activity: null,
    loading: true
  },

  async onLoad(options) {
    if (!options.id) {
      wx.showToast({
        title: '活动不存在',
        icon: 'none'
      });
      this.setData({ loading: false });
      return;
    }

    try {
      const activity = await fetchActivityDetail(options.id);
      wx.setNavigationBarTitle({
        title: activity.title
      });

      this.setData({
        activity,
        loading: false
      });
    } catch (error) {
      wx.showToast({
        title: error.message || '活动加载失败',
        icon: 'none'
      });
      this.setData({ loading: false });
    }
  },

  handleSignup() {
    const { activity } = this.data;

    wx.navigateTo({
      url: `/pages/signup/signup?type=activity&id=${activity.id}`
    });
  }
});
