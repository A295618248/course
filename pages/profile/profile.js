const { fetchMySignups } = require('../../utils/services/public-service');

Page({
  data: {
    records: [],
    stats: {
      total: 0,
      course: 0,
      activity: 0,
      general: 0
    }
  },

  async onShow() {
    await this.loadRecords();
  },

  async loadRecords() {
    try {
      const records = await fetchMySignups();
      const stats = records.reduce(
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
        {
          total: 0,
          course: 0,
          activity: 0,
          general: 0
        }
      );

      this.setData({
        records,
        stats
      });
    } catch (error) {
      wx.showToast({
        title: error.message || '报名记录加载失败',
        icon: 'none'
      });
    }
  },

  clearRecords() {
    wx.showModal({
      title: '云端报名记录',
      content: '报名记录已存储到云端，请在管理端进行跟进和状态管理。',
      showCancel: false
    });
  }
});
