const { getCourses, getCourseCategories } = require('../../utils/data');

Page({
  data: {
    categories: [],
    activeCategory: '全部',
    courses: [],
    filteredCourses: []
  },

  onLoad() {
    const categories = getCourseCategories();
    const courses = getCourses();

    this.setData({
      categories,
      courses
    });
    this.filterCourses('全部');
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
