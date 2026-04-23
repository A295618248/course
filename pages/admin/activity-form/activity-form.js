const { saveActivity, uploadImage } = require('../../../utils/services/admin-service');

function splitLines(value) {
  return String(value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

Page({
  data: {
    isEdit: false,
    saving: false,
    coverPreview: '',
    uploadedCover: '',
    form: {
      id: '',
      title: '',
      type: '',
      date: '',
      time: '',
      location: '',
      capacity: '',
      enrolled: '0',
      fee: '',
      status: '报名中',
      published: true,
      sortOrder: '100',
      summary: '',
      description: '',
      agendaText: ''
    }
  },

  onLoad(options) {
    if (!options.payload) {
      return;
    }

    const payload = JSON.parse(decodeURIComponent(options.payload));
    this.setData({
      isEdit: true,
      uploadedCover: payload.coverImage || '',
      coverPreview: payload.coverImage || '',
      form: {
        id: payload.id || '',
        title: payload.title || '',
        type: payload.type || '',
        date: payload.date || '',
        time: payload.time || '',
        location: payload.location || '',
        capacity: String(payload.capacity || ''),
        enrolled: String(payload.enrolled || 0),
        fee: payload.fee || '',
        status: payload.status || '报名中',
        published: payload.published !== false,
        sortOrder: String(payload.sortOrder || 100),
        summary: payload.summary || '',
        description: payload.description || '',
        agendaText: (payload.agenda || []).join('\n')
      }
    });
  },

  handleInput(event) {
    const { field } = event.currentTarget.dataset;
    this.setData({
      [`form.${field}`]: event.detail.value
    });
  },

  handlePublishedChange(event) {
    this.setData({
      'form.published': event.detail.value
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
      const result = await wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera']
      });
      const filePath = result.tempFiles[0].tempFilePath;
      const uploaded = await uploadImage(filePath, 'activity');
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
    if (!payload.title.trim()) return '请填写活动标题';
    if (!payload.type.trim()) return '请填写活动类型';
    if (!payload.date.trim()) return '请填写活动日期';
    if (!payload.time.trim()) return '请填写活动时间';
    if (!payload.location.trim()) return '请填写活动地点';
    if (!payload.summary.trim()) return '请填写活动摘要';
    if (!payload.description.trim()) return '请填写活动介绍';
    return '';
  },

  async submit() {
    if (this.data.saving) {
      return;
    }

    const { form, uploadedCover } = this.data;
    const payload = {
      id: form.id || undefined,
      title: form.title,
      type: form.type,
      date: form.date,
      time: form.time,
      location: form.location,
      capacity: Number(form.capacity) || 0,
      enrolled: Number(form.enrolled) || 0,
      fee: form.fee,
      status: form.status,
      published: form.published,
      sortOrder: Number(form.sortOrder) || 100,
      summary: form.summary,
      description: form.description,
      agenda: splitLines(form.agendaText),
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
      await saveActivity(payload);
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 400);
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
