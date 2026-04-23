const { getCourseById, getActivityById } = require('../../utils/data');
const { saveSignup } = require('../../utils/signup-store');

function buildTarget(options) {
  const { type, id } = options || {};

  if (type === 'course' && id) {
    const course = getCourseById(id);
    if (!course) {
      return null;
    }

    return {
      businessType: 'course',
      title: course.title,
      subtitle: `${course.category} · ${course.ageRange}`,
      extra: `${course.schedule} · ${course.priceText}`
    };
  }

  if (type === 'activity' && id) {
    const activity = getActivityById(id);
    if (!activity) {
      return null;
    }

    return {
      businessType: 'activity',
      title: activity.title,
      subtitle: `${activity.type} · ${activity.status}`,
      extra: `${activity.date} ${activity.time} · ${activity.location}`
    };
  }

  return {
    businessType: 'general',
    title: '试听预约与课程咨询',
    subtitle: '适用于课程试听、活动咨询与成长规划沟通',
    extra: '提交后由顾问进行一对一回访'
  };
}

Page({
  data: {
    target: null,
    visitOptions: ['请选择意向时间', '工作日放学后', '周六上午', '周六下午', '周日上午', '周日下午'],
    visitIndex: 0,
    form: {
      parentName: '',
      phone: '',
      studentName: '',
      studentAge: '',
      interest: '',
      remark: ''
    }
  },

  onLoad(options) {
    const target = buildTarget(options);

    if (!target) {
      wx.showToast({
        title: '目标内容不存在',
        icon: 'none'
      });
      return;
    }

    this.setData({ target });
  },

  handleInput(event) {
    const { field } = event.currentTarget.dataset;
    this.setData({
      [`form.${field}`]: event.detail.value
    });
  },

  handleVisitChange(event) {
    this.setData({
      visitIndex: Number(event.detail.value)
    });
  },

  validate() {
    const { form, visitIndex } = this.data;

    if (!form.parentName.trim()) {
      return '请填写家长称呼';
    }

    if (!/^1\d{10}$/.test(form.phone.trim())) {
      return '请填写正确手机号';
    }

    if (!form.studentName.trim()) {
      return '请填写学员姓名';
    }

    const age = Number(form.studentAge);
    if (!Number.isInteger(age) || age < 3 || age > 18) {
      return '学员年龄需在 3-18 岁';
    }

    if (!form.interest.trim()) {
      return '请填写兴趣方向';
    }

    if (visitIndex === 0) {
      return '请选择意向时间';
    }

    return '';
  },

  submitSignup() {
    const error = this.validate();
    if (error) {
      wx.showToast({
        title: error,
        icon: 'none'
      });
      return;
    }

    const { form, target, visitOptions, visitIndex } = this.data;
    const record = saveSignup({
      businessType: target.businessType,
      targetTitle: target.title,
      targetSubtitle: target.subtitle,
      parentName: form.parentName.trim(),
      phone: form.phone.trim(),
      studentName: form.studentName.trim(),
      age: Number(form.studentAge),
      interest: form.interest.trim(),
      preferredTime: visitOptions[visitIndex],
      remark: form.remark.trim()
    });

    wx.showModal({
      title: '提交成功',
      content: `已收到 ${record.studentName} 的报名信息，我们会尽快联系您。`,
      showCancel: false,
      success: () => {
        this.setData({
          visitIndex: 0,
          form: {
            parentName: '',
            phone: '',
            studentName: '',
            studentAge: '',
            interest: '',
            remark: ''
          }
        });
        wx.switchTab({
          url: '/pages/profile/profile'
        });
      }
    });
  }
});
