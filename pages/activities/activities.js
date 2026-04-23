const { listActivities } = require('../../utils/services/public-service');

Page({
  data: {
    tabs: ['全部', '报名中', '余位不多'],
    activeTab: '全部',
    activities: [],
    filteredActivities: []
  },

  async onLoad() {
    await this.loadActivities('全部');
  },

  async loadActivities(status) {
    wx.showLoading({
      title: '加载中'
    });

    try {
      const activities = await listActivities(status);
      this.setData({
        activities,
        filteredActivities: activities,
        activeTab: status
      });
    } catch (error) {
      wx.showToast({
        title: error.message || '活动加载失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  switchTab(event) {
    const { tab } = event.currentTarget.dataset;
    this.loadActivities(tab);
  },

  applyFilter(tab) {
    const { activities } = this.data;
    const filteredActivities = tab === '全部'
      ? activities
      : activities.filter((item) => item.status === tab);

    this.setData({
      activeTab: tab,
      filteredActivities
    });
  },

  openDetail(event) {
    const { id } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/activity-detail/activity-detail?id=${id}`
    });
  },

  goSignup(event) {
    const { id } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/signup/signup?type=activity&id=${id}`
    });
  }
});
