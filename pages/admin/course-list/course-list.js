const { ensureAdmin, listAdminCourses, saveCourse } = require('../../../utils/services/admin-service');

Page({
  data: {
    loading: true,
    courses: []
  },

  async onShow() {
    this.setData({ loading: true });

    try {
      await ensureAdmin();
      const courses = await listAdminCourses();
      this.setData({
        courses,
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

  goDashboard() {
    wx.navigateBack();
  },

  createCourse() {
    wx.navigateTo({
      url: '/pages/admin/course-form/course-form'
    });
  },

  editCourse(event) {
    const payload = encodeURIComponent(JSON.stringify(event.currentTarget.dataset.item));
    wx.navigateTo({
      url: `/pages/admin/course-form/course-form?payload=${payload}`
    });
  },

  async togglePublish(event) {
    const item = event.currentTarget.dataset.item;
    const nextPublished = !item.published;

    try {
      await saveCourse({
        ...item,
        published: nextPublished
      });
      wx.showToast({
        title: nextPublished ? '已发布' : '已下架',
        icon: 'success'
      });
      await this.onShow();
    } catch (error) {
      wx.showToast({
        title: error.message || '状态更新失败',
        icon: 'none'
      });
    }
  }
});
