const courses = [
  {
    id: 'course-sketch',
    title: '创意素描启蒙班',
    category: '美术基础',
    ageRange: '6-9岁',
    duration: '12课时 / 6周',
    priceText: '1680元 / 期',
    priceValue: 1680,
    classSize: '1对8小班',
    summary: '通过线条、明暗和造型训练，帮助孩子建立绘画观察能力与表达兴趣。',
    description:
      '课程从几何体观察、生活器物写生到创意主题表现，循序渐进培养孩子的造型基础和画面组织能力。老师会在每节课输出课堂反馈，便于家长了解学习进度。',
    schedule: '周三 18:30-20:00 / 周六 10:00-11:30',
    tags: ['零基础友好', '观察力训练', '小班授课'],
    highlights: [
      '从线条练习到完整画面逐步建立造型基础',
      '课后反馈图片 + 老师点评，便于家长跟进',
      '阶段作品可参与机构主题展览'
    ],
    outline: [
      '第 1 阶段：线条控制与几何造型',
      '第 2 阶段：静物观察与明暗关系',
      '第 3 阶段：主题创作与画面表达'
    ]
  },
  {
    id: 'course-color',
    title: '少儿综合色彩班',
    category: '创意绘画',
    ageRange: '8-12岁',
    duration: '16课时 / 8周',
    priceText: '2280元 / 期',
    priceValue: 2280,
    classSize: '1对10分组教学',
    summary: '在丙烯、水粉和综合材料中探索色彩表现，提升孩子的审美和创意表达。',
    description:
      '课程以主题项目制为主，结合节庆、自然和艺术史元素，引导学员用多种媒材完成主题作品，适合希望提升创意表现和作品完整度的孩子。',
    schedule: '周二 19:00-20:30 / 周日 14:00-15:30',
    tags: ['色彩认知', '创意表达', '作品集积累'],
    highlights: [
      '丰富材料体验，激发孩子创作热情',
      '每月一次作品展示日',
      '适合进阶学习或校内比赛准备'
    ],
    outline: [
      '综合色彩工具认知与基础笔触训练',
      '主题项目创作与构图规划',
      '作品复盘与个人风格建立'
    ]
  },
  {
    id: 'course-calligraphy',
    title: '硬笔书法提升班',
    category: '书法',
    ageRange: '7-13岁',
    duration: '10课时 / 5周',
    priceText: '1380元 / 期',
    priceValue: 1380,
    classSize: '1对12标准班',
    summary: '规范笔画结构和书写节奏，帮助孩子提升卷面美观度与书写自信。',
    description:
      '课程聚焦常用字结构规律与篇章练习，配合书写姿势、控笔训练和课后打卡，帮助学员在短期内看到明显提升。',
    schedule: '周四 18:30-20:00 / 周六 14:00-15:30',
    tags: ['坐姿纠正', '规范书写', '专注力提升'],
    highlights: [
      '针对学校作业书写场景设计',
      '每周打卡点评，形成练习闭环',
      '附赠阶段测评与改善建议'
    ],
    outline: [
      '基础笔画与控笔节奏训练',
      '常用字结构规律练习',
      '段落排版与卷面提升'
    ]
  }
];

const activities = [
  {
    id: 'activity-spring-show',
    title: '春季少儿艺术作品展',
    type: '展览活动',
    date: '2026-05-18',
    time: '14:00-17:00',
    location: '星河艺术中心一楼展厅',
    capacity: 60,
    enrolled: 34,
    fee: '免费',
    status: '报名中',
    summary: '展示本学期优秀学员作品，设置亲子讲解和打卡互动区。',
    description:
      '活动面向机构学员与周边家庭开放，现场将设置作品讲解、创作故事分享和亲子互动打卡区，帮助家长更直观了解课程成果与教学理念。',
    agenda: [
      '14:00 展览开放与签到',
      '14:30 主理老师导览讲解',
      '15:30 亲子互动创作体验',
      '16:30 学员颁发结营纪念证书'
    ]
  },
  {
    id: 'activity-clay-workshop',
    title: '周末亲子陶艺体验营',
    type: '体验活动',
    date: '2026-05-25',
    time: '10:00-12:00',
    location: '星河艺术中心陶艺教室',
    capacity: 24,
    enrolled: 19,
    fee: '198元 / 组',
    status: '余位不多',
    summary: '亲子共同完成陶艺作品，体验拉坯与手捏成型的创作乐趣。',
    description:
      '体验营由陶艺老师带领，家长和孩子一起完成主题作品。活动包含材料、基础烧制和成果展示，适合首次接触陶艺的亲子家庭。',
    agenda: [
      '10:00 课程介绍与安全说明',
      '10:20 手捏成型教学',
      '11:00 亲子创作时间',
      '11:40 作品展示与拍照留念'
    ]
  },
  {
    id: 'activity-open-day',
    title: '暑期课程开放日',
    type: '招生活动',
    date: '2026-06-08',
    time: '09:30-16:30',
    location: '星河艺术中心全馆',
    capacity: 100,
    enrolled: 48,
    fee: '免费',
    status: '报名中',
    summary: '开放试听、课程咨询、能力测评与暑期班优惠说明。',
    description:
      '开放日集合暑期课程介绍、试学体验、顾问咨询和报名福利。家长可带孩子现场体验不同课程内容，快速判断适合方向。',
    agenda: [
      '09:30-11:30 美术与书法试听',
      '13:00-15:00 创意手工工作坊',
      '15:00-16:00 课程规划咨询',
      '16:00-16:30 限时优惠说明'
    ]
  }
];

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function enrichActivity(activity) {
  return {
    ...activity,
    remaining: Math.max(activity.capacity - activity.enrolled, 0)
  };
}

function getCourses() {
  return clone(courses);
}

function getCourseCategories() {
  return ['全部', ...Array.from(new Set(courses.map((item) => item.category)))];
}

function getCourseById(id) {
  const target = courses.find((item) => item.id === id);
  return target ? clone(target) : null;
}

function getActivities() {
  return clone(activities.map(enrichActivity));
}

function getActivityById(id) {
  const target = activities.find((item) => item.id === id);
  return target ? clone(enrichActivity(target)) : null;
}

function getSiteStats() {
  return {
    courseCount: courses.length,
    activityCount: activities.length,
    signupCount: 128
  };
}

module.exports = {
  getCourses,
  getCourseCategories,
  getCourseById,
  getActivities,
  getActivityById,
  getSiteStats
};
