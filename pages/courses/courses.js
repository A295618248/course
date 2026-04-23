const { listCourses } = require('../../utils/services/public-service');

Page({
  data: {
    categories: [],
    activeCategory: '全部',
    courses: [],
    filteredCourses: []
  },

  async onLoad() {
    await this.loadCourses();
  },

  async loadCourses() {
    wx.showLoading({
      title: '加载中'
    });

    try {
      const courses = await listCourses();
      const categories = ['全部', ...Array.from(new Set(courses.map((item) => item.category).filter(Boolean)))];
      this.setData({
        categories,
        courses
      });
      this.filterCourses('全部');
    } catch (error) {
      wx.showToast({
        title: error.message || '课程加载失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  handleCategoryTap(event) {
    const category = event.currentTarget.dataset.category;
    this.filterCourses(category);
  },

  filterCourses(category) {
    const { courses } = this.data;
    const filteredCourses =
      category === '全部'
        ? courses
        : courses.filter((item) => item.category === category);

    this.setData({
      activeCategory: category,
      filteredCourses
    });
  },

  openCourseDetail(event) {
    const { id } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/course-detail/course-detail?id=${id}`
    });
  },

  goSignup(event) {
    const { id } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/signup/signup?type=course&id=${id}`
    });
  }
});
