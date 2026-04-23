const { ensureAdmin, listAdminActivities } = require('../../../utils/services/admin-service');

Page({
  data: {
    loading: true,
    activities: []
  },

  async onShow() {
    await this.loadActivities();
  },

  async loadActivities() {
    this.setData({ loading: true });

    try {
      await ensureAdmin();
      const activities = await listAdminActivities();
      this.setData({
        activities,
        loading: false
      });
    } catch (error) {
      this.setData({ loading: false });
      wx.showToast({
        title: error.message || '活动加载失败',
        icon: 'none'
      });
    }
  },

  goCreate() {
    wx.navigateTo({
      url: '/pages/admin/activity-form/activity-form'
    });
  },

  goEdit(event) {
    const payload = encodeURIComponent(JSON.stringify(event.currentTarget.dataset.item));
    wx.navigateTo({
      url: `/pages/admin/activity-form/activity-form?payload=${payload}`
    });
  }
});
