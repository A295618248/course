const { getActivityById } = require('../../utils/data');

Page({
  data: {
    activity: null
  },

  onLoad(options) {
    const activity = getActivityById(options.id);

    if (!activity) {
      wx.showToast({
        title: '活动不存在',
        icon: 'none'
      });
      return;
    }

    wx.setNavigationBarTitle({
      title: activity.title
    });

    this.setData({
      activity
    });
  },

  handleSignup() {
    const { activity } = this.data;

    wx.navigateTo({
      url: `/pages/signup/signup?type=activity&id=${activity.id}`
    });
  }
});
