const { listAdminSignups, ensureAdmin } = require('../../../utils/services/admin-service');

Page({
  data: {
    loading: true,
    allSignups: [],
    signups: [],
    tabs: ['全部', '课程', '活动', '咨询'],
    activeTab: '全部',
    stats: {
      total: 0,
      course: 0,
      activity: 0,
      general: 0
    }
  },

  async onShow() {
    await this.loadData();
  },

  async loadData() {
    this.setData({ loading: true });

    try {
      await ensureAdmin();
      const signups = await listAdminSignups();
      const stats = signups.reduce(
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

      this.setData({
        allSignups: signups,
        signups,
        stats,
        loading: false
      });
    } catch (error) {
      this.setData({ loading: false });
      wx.showToast({
        title: error.message || '报名线索加载失败',
        icon: 'none'
      });
    }
  },

  switchTab(event) {
    const { tab } = event.currentTarget.dataset;
    const { allSignups } = this.data;
    let filtered = allSignups;

    if (tab === '课程') {
      filtered = allSignups.filter((item) => item.businessType === 'course');
    } else if (tab === '活动') {
      filtered = allSignups.filter((item) => item.businessType === 'activity');
    } else if (tab === '咨询') {
      filtered = allSignups.filter((item) => item.businessType === 'general');
    }

    this.setData({
      activeTab: tab,
      signups: filtered
    });
  }
});
