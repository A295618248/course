const { getCourseById } = require('../../utils/data');

Page({
  data: {
    course: null
  },

  onLoad(options) {
    const course = getCourseById(options.id);

    if (!course) {
      wx.showToast({
        title: '课程不存在',
        icon: 'none'
      });
      return;
    }

    wx.setNavigationBarTitle({
      title: course.title
    });

    this.setData({ course });
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
