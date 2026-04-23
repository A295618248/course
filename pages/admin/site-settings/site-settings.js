const {
  ensureAdmin,
  getSiteSettings,
  updateSiteSettings,
  uploadImage
} = require('../../../utils/services/admin-service');

function normalizeBannerList(value) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

Page({
  data: {
    loading: true,
    saving: false,
    form: {
      brandName: '',
      heroTitle: '',
      heroSubtitle: '',
      contactPhone: '',
      address: '',
      intro: '',
      serviceNotice: '',
      bannerImagesText: ''
    }
  },

  async onShow() {
    await this.loadSettings();
  },

  async loadSettings() {
    this.setData({ loading: true });
    try {
      await ensureAdmin();
      const settings = await getSiteSettings();
      this.setData({
        loading: false,
        form: {
          brandName: settings.brandName || '',
          heroTitle: settings.heroTitle || '',
          heroSubtitle: settings.heroSubtitle || '',
          contactPhone: settings.contactPhone || '',
          address: settings.address || '',
          intro: settings.intro || '',
          serviceNotice: settings.serviceNotice || '',
          bannerImagesText: (settings.bannerImages || []).join('\n')
        }
      });
    } catch (error) {
      this.setData({ loading: false });
      wx.showToast({
        title: error.message || '站点配置加载失败',
        icon: 'none'
      });
    }
  },

  handleInput(event) {
    const { field } = event.currentTarget.dataset;
    this.setData({
      [`form.${field}`]: event.detail.value
    });
  },

  async uploadBanner() {
    try {
      const media = await wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera']
      });
      const filePath = media.tempFiles[0].tempFilePath;
      const uploadResult = await uploadImage(filePath, 'site');
      const current = this.data.form.bannerImagesText;
      const next = current ? `${current}\n${uploadResult.fileID}` : uploadResult.fileID;
      this.setData({
        'form.bannerImagesText': next
      });
      wx.showToast({
        title: '横幅已上传',
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
    if (!payload.brandName.trim()) return '请填写品牌名称';
    if (!payload.heroTitle.trim()) return '请填写首页主标题';
    if (!payload.contactPhone.trim()) return '请填写联系电话';
    return '';
  },

  async submit() {
    const { form, saving } = this.data;
    if (saving) {
      return;
    }

    const payload = {
      brandName: form.brandName,
      heroTitle: form.heroTitle,
      heroSubtitle: form.heroSubtitle,
      contactPhone: form.contactPhone,
      address: form.address,
      intro: form.intro,
      serviceNotice: form.serviceNotice,
      bannerImages: normalizeBannerList(form.bannerImagesText)
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
      await updateSiteSettings(payload);
      wx.showToast({
        title: '已保存',
        icon: 'success'
      });
    } catch (saveError) {
      wx.showToast({
        title: saveError.message || '保存失败',
        icon: 'none'
      });
    } finally {
      this.setData({ saving: false });
    }
  }
});
