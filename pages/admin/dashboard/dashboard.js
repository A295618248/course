const { getDashboardStats, ensureAdmin, bootstrapData, bindFirstAdmin } = require('../../../utils/services/admin-service');

Page({
  data: {
    adminProfile: null,
    loading: true,
    isAdmin: false,
    summary: {
      courseCount: 0,
      publishedCourseCount: 0,
      activityCount: 0,
      publishedActivityCount: 0,
      signupCount: 0
    },
    byType: {
      course: 0,
      activity: 0,
      general: 0
    },
    latestSignups: [],
    recentTrend: []
  },

  async onShow() {
    await this.loadDashboard();
  },

  async loadDashboard() {
    this.setData({ loading: true });

    try {
      const authResult = await ensureAdmin();
      const stats = await getDashboardStats();

      this.setData({
        adminProfile: authResult.admin || null,
        isAdmin: Boolean(authResult.isAdmin),
        summary: {
          courseCount: stats.totals.courses || 0,
          publishedCourseCount: stats.published?.courses || 0,
          activityCount: stats.totals.activities || 0,
          publishedActivityCount: stats.published?.activities || 0,
          signupCount: stats.totals.signups || 0
        },
        byType: stats.byType || {
          course: 0,
          activity: 0,
          general: 0
        },
        latestSignups: stats.latestSignups || [],
        recentTrend: stats.recentTrend || [],
        loading: false
      });
    } catch (error) {
      this.setData({ loading: false });
      wx.showToast({
        title: error.message || '管理员验证失败',
        icon: 'none'
      });
    }
  },

  navigate(event) {
    const { path } = event.currentTarget.dataset;
    wx.navigateTo({
      url: path
    });
  },

  async handleBindFirstAdmin() {
    try {
      await bindFirstAdmin('默认管理员');
      wx.showToast({
        title: '管理员已绑定',
        icon: 'success'
      });
      await this.loadDashboard();
    } catch (error) {
      wx.showToast({
        title: error.message || '绑定失败',
        icon: 'none'
      });
    }
  },

  async goBootstrap() {
    try {
      await bootstrapData(false);
      wx.showToast({
        title: '初始化成功',
        icon: 'success'
      });
      await this.loadDashboard();
    } catch (error) {
      wx.showToast({
        title: error.message || '初始化失败',
        icon: 'none'
      });
    }
  },

  refreshAll() {
    this.loadDashboard();
  }
});
