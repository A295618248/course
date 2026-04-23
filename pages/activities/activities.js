const { getActivities } = require('../../utils/data');

Page({
  data: {
    tabs: ['全部', '报名中', '余位不多'],
    activeTab: '全部',
    activities: [],
    filteredActivities: []
  },

  onLoad() {
    const activities = getActivities();
    this.setData({
      activities
    });
    this.applyFilter('全部');
  },

  switchTab(event) {
    const { tab } = event.currentTarget.dataset;
    this.applyFilter(tab);
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
