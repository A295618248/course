const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const COLLECTIONS = {
  COURSES: 'courses',
  ACTIVITIES: 'activities',
  ADMINS: 'admins',
  SITE_SETTINGS: 'site_settings'
};

function now() {
  return new Date();
}

function success(data) {
  return {
    success: true,
    data
  };
}

async function clearCollection(collectionName) {
  const collection = db.collection(collectionName);
  while (true) {
    const snapshot = await collection.limit(100).get();
    if (!snapshot.data.length) {
      break;
    }
    await Promise.all(snapshot.data.map((item) => collection.doc(item._id).remove()));
  }
}

async function insertMany(collectionName, list) {
  for (const item of list) {
    await db.collection(collectionName).add({
      data: item
    });
  }
}

function seedCourses(timestamp) {
  return [
    {
      title: '创意素描启蒙班',
      category: '美术基础',
      ageRange: '6-9岁',
      duration: '12课时 / 6周',
      priceText: '1680元 / 期',
      priceValue: 1680,
      classSize: '1对8小班',
      schedule: '周三 18:30-20:00 / 周六 10:00-11:30',
      summary: '通过线条、明暗和造型训练，帮助孩子建立绘画观察能力与表达兴趣。',
      description:
        '课程从几何体观察、生活器物写生到创意主题表现，循序渐进培养孩子的造型基础和画面组织能力。',
      tags: ['零基础友好', '观察力训练', '小班授课'],
      highlights: ['支持试听体验', '阶段成长反馈', '主题作品展览'],
      outline: ['基础线条训练', '静物观察表现', '主题创作表达'],
      published: true,
      sortOrder: 100,
      createdAt: timestamp,
      updatedAt: timestamp
    },
    {
      title: '少儿综合色彩班',
      category: '创意绘画',
      ageRange: '8-12岁',
      duration: '16课时 / 8周',
      priceText: '2280元 / 期',
      priceValue: 2280,
      classSize: '1对10分组教学',
      schedule: '周二 19:00-20:30 / 周日 14:00-15:30',
      summary: '在丙烯、水粉和综合材料中探索色彩表现，提升孩子的审美和创意表达。',
      description:
        '围绕色彩认知、主题项目和作品展示构建完整进阶路径，适合希望提升创意表达的学员。',
      tags: ['色彩认知', '创意表达', '作品展示'],
      highlights: ['项目制教学', '材料丰富', '适合进阶提升'],
      outline: ['工具认知', '主题项目训练', '作品复盘'],
      published: true,
      sortOrder: 200,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  ];
}

function seedActivities(timestamp) {
  return [
    {
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
      description: '面向机构学员与周边家庭开放，现场将设置作品讲解和亲子互动打卡区。',
      agenda: ['14:00 展览开放与签到', '14:30 主理老师导览讲解', '15:30 亲子互动体验'],
      published: true,
      sortOrder: 100,
      createdAt: timestamp,
      updatedAt: timestamp
    },
    {
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
      description: '活动包含材料、基础烧制和成果展示，适合首次接触陶艺的亲子家庭。',
      agenda: ['10:00 活动介绍', '10:20 手捏成型教学', '11:00 亲子创作时间'],
      published: true,
      sortOrder: 200,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  ];
}

function seedSiteSettings(timestamp) {
  return {
    key: 'portal',
    brandName: '星河艺术中心',
    heroTitle: '让每个孩子找到自己的艺术表达',
    heroSubtitle: '围绕课程、活动、试听与成长规划，打造适合艺术培训机构招生和运营的一体化小程序。',
    contactPhone: '400-800-5200',
    address: '广州市天河区艺术路 88 号',
    intro:
      '面向 4-16 岁少儿与青少年，提供美术、书法、陶艺、创意手工等课程，支持试听、活动报名和成长档案管理。',
    serviceNotice: '报名提交后工作时间会尽快联系',
    bannerImages: [],
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

exports.main = async (event = {}) => {
  const timestamp = now();
  if (event.reset) {
    await clearCollection(COLLECTIONS.COURSES);
    await clearCollection(COLLECTIONS.ACTIVITIES);
    await clearCollection(COLLECTIONS.ADMINS);
    await clearCollection(COLLECTIONS.SITE_SETTINGS);
  }

  const courses = seedCourses(timestamp);
  const activities = seedActivities(timestamp);
  const siteSettings = seedSiteSettings(timestamp);

  await insertMany(COLLECTIONS.COURSES, courses);
  await insertMany(COLLECTIONS.ACTIVITIES, activities);
  await db.collection(COLLECTIONS.SITE_SETTINGS).add({
    data: siteSettings
  });

  return success({
    message: '基础数据初始化完成',
    counts: {
      courses: courses.length,
      activities: activities.length,
      settings: 1
    }
  });
};
