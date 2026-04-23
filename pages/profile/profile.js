const { readSignups, clearSignups, getSignupStats } = require('../../utils/signup-store');

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

  onShow() {
    this.loadRecords();
  },

  loadRecords() {
    this.setData({
      records: readSignups(),
      stats: getSignupStats()
    });
  },

  clearRecords() {
    if (!this.data.records.length) {
      return;
    }

    wx.showModal({
      title: '清空报名记录',
      content: '确认清空当前本地演示数据吗？',
      success: ({ confirm }) => {
        if (!confirm) {
          return;
        }
        clearSignups();
        this.loadRecords();
        wx.showToast({
          title: '已清空',
          icon: 'success'
        });
      }
    });
  }
});
