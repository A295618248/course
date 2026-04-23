const { getPortalHome } = require('../../utils/services/public-service');

Page({
  data: {
    brandName: '星河艺术中心',
    loading: true,
    stats: {
      courseCount: 0,
      activityCount: 0,
      signupCount: 0
    },
    services: [
      {
        icon: '课',
        title: '体系课程',
        desc: '分龄课程覆盖美术、书法与创意表达，支持试听与阶段进阶。'
      },
      {
        icon: '活',
        title: '特色活动',
        desc: '开放日、作品展、亲子体验营帮助家长更直观了解教学成果。'
      },
      {
        icon: '报',
        title: '便捷报名',
        desc: '课程咨询、试听预约、活动报名统一入口，方便快速留资。'
      }
    ],
    featuredCourses: [],
    upcomingActivities: []
  },

  onLoad() {
    this.loadPortalHome();
  },

  async loadPortalHome() {
    this.setData({ loading: true });
    try {
      const data = await getPortalHome();
      this.setData({
        brandName: data.site.brandName || '星河艺术中心',
        stats: data.stats,
        featuredCourses: data.featuredCourses || [],
        upcomingActivities: data.upcomingActivities || []
      });
    } catch (error) {
      wx.showToast({
        title: error.message || '首页加载失败',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  goToCourses() {
    wx.switchTab({
      url: '/pages/courses/courses'
    });
  },

  goToActivities() {
    wx.switchTab({
      url: '/pages/activities/activities'
    });
  },

  quickSignup() {
    wx.navigateTo({
      url: '/pages/signup/signup?source=general'
    });
  },

  openCourse(event) {
    const { id } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/course-detail/course-detail?id=${id}`
    });
  },

  openActivity(event) {
    const { id } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/activity-detail/activity-detail?id=${id}`
    });
  }
});
