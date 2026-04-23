const { saveCourse, uploadImage } = require('../../../utils/services/admin-service');

function splitLines(value) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

Page({
  data: {
    isEdit: false,
    saving: false,
    pageTitle: '新建课程',
    coverPreview: '',
    uploadedCover: '',
    form: {
      id: '',
      title: '',
      category: '',
      ageRange: '',
      duration: '',
      priceText: '',
      priceValue: '',
      classSize: '',
      schedule: '',
      summary: '',
      description: '',
      status: 'published',
      sort: '100',
      tagsText: '',
      highlightsText: '',
      outlineText: ''
    }
  },

  onLoad(options) {
    if (!options.payload) {
      return;
    }

    const payload = JSON.parse(decodeURIComponent(options.payload));
    this.setData({
      isEdit: true,
      pageTitle: '编辑课程',
      uploadedCover: payload.coverImage || '',
      coverPreview: payload.coverImage || '',
      form: {
        id: payload.id || '',
        title: payload.title || '',
        category: payload.category || '',
        ageRange: payload.ageRange || '',
        duration: payload.duration || '',
        priceText: payload.priceText || '',
        priceValue: payload.priceValue || '',
        classSize: payload.classSize || '',
        schedule: payload.schedule || '',
        summary: payload.summary || '',
        description: payload.description || '',
        status: payload.status || 'published',
        sort: String(payload.sort || 100),
        tagsText: (payload.tags || []).join('\n'),
        highlightsText: (payload.highlights || []).join('\n'),
        outlineText: (payload.outline || []).join('\n')
      }
    });
  },

  handleInput(event) {
    const { field } = event.currentTarget.dataset;
    this.setData({
      [`form.${field}`]: event.detail.value
    });
  },

  chooseStatus(event) {
    const { status } = event.currentTarget.dataset;
    this.setData({
      'form.status': status
    });
  },

  async chooseImage() {
    try {
      const mediaRes = await wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera']
      });
      const filePath = mediaRes.tempFiles[0].tempFilePath;
      const uploaded = await uploadImage(filePath, 'course');
      this.setData({
        coverPreview: filePath,
        uploadedCover: uploaded.fileID
      });
      wx.showToast({
        title: '图片已上传',
        icon: 'success'
      });
    } catch (error) {
      if (String(error.errMsg || '').includes('cancel')) {
        return;
      }
      wx.showToast({
        title: error.message || '上传失败',
        icon: 'none'
      });
    }
  },

  validate(payload) {
    if (!payload.title.trim()) return '请填写课程标题';
    if (!payload.category.trim()) return '请填写课程分类';
    if (!payload.ageRange.trim()) return '请填写适龄范围';
    if (!payload.priceText.trim()) return '请填写展示价格';
    if (!payload.summary.trim()) return '请填写课程摘要';
    if (!payload.description.trim()) return '请填写课程介绍';
    return '';
  },

  async submit() {
    const { form, uploadedCover, saving } = this.data;
    if (saving) {
      return;
    }

    const payload = {
      ...form,
      priceValue: Number(form.priceValue) || 0,
      sort: Number(form.sort) || 100,
      priceText: form.priceText || `${Number(form.priceValue) || 0}元 / 期`,
      tags: splitLines(form.tagsText),
      highlights: splitLines(form.highlightsText),
      outline: splitLines(form.outlineText),
      coverImage: uploadedCover
    };

    const error = this.validate(payload);
    if (error) {
      wx.showToast({
        title: error,
        icon: 'none'
      });
      return;
    }

    this.setData({ saving: true });
    try {
      await saveCourse(payload);
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 500);
    } catch (err) {
      wx.showToast({
        title: err.message || '保存失败',
        icon: 'none'
      });
    } finally {
      this.setData({ saving: false });
    }
  }
});
