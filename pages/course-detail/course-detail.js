const { fetchCourseDetail } = require('../../utils/services/public-service');

Page({
  data: {
    course: null,
    loading: true
  },

  async onLoad(options) {
    if (!options.id) {
      wx.showToast({
        title: '课程不存在',
        icon: 'none'
      });
      this.setData({ loading: false });
      return;
    }

    try {
      const course = await fetchCourseDetail(options.id);
      wx.setNavigationBarTitle({
        title: course.title
      });

      this.setData({
        course,
        loading: false
      });
    } catch (error) {
      wx.showToast({
        title: error.message || '课程加载失败',
        icon: 'none'
      });
      this.setData({ loading: false });
    }
  },

  goSignup() {
    const { course } = this.data;
    if (!course) {
      return;
    }

    wx.navigateTo({
      url: `/pages/signup/signup?type=course&id=${course.id}`
    });
  }
});
