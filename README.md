# 星河艺术中心微信云开发项目

一套面向艺术培训机构的正式项目结构，包含：

- 家长端小程序
- 管理端小程序子包
- 微信云开发数据库
- 云函数
- 云存储图片上传
- 数据初始化与部署文档

适用于少儿美术、书法、陶艺、创意手工、亲子活动等机构的招生展示与运营管理。

## 功能概览

### 1. 家长端

- 首页
  - 机构品牌展示
  - 推荐课程
  - 近期活动
  - 报名统计
- 课程中心
  - 分类筛选
  - 课程详情
  - 直接报名
- 活动中心
  - 按状态筛选
  - 活动详情
  - 活动报名
- 报名登记
  - 课程报名
  - 活动报名
  - 通用咨询
- 报名中心
  - 查看当前微信用户提交的报名记录

### 2. 管理端

管理端位于 `pages/admin` 子包，包含：

- 仪表盘
  - 课程数、活动数、报名数统计
  - 最近报名线索
  - 初始化管理员与初始化数据入口
- 课程管理
  - 新建课程
  - 编辑课程
  - 发布 / 下架
  - 上传课程封面
- 活动管理
  - 新建活动
  - 编辑活动
  - 维护活动时间、地点、名额、状态
  - 上传活动封面
- 报名线索
  - 查看所有报名数据
  - 按业务类型筛选
- 站点设置
  - 品牌名称
  - 首页主文案
  - 联系方式
  - 机构简介

## 技术结构

### 小程序前端

- `pages/home` 首页
- `pages/courses` / `pages/course-detail` 课程模块
- `pages/activities` / `pages/activity-detail` 活动模块
- `pages/signup` 报名页
- `pages/profile` 我的报名

### 管理端子包

- `pages/admin/dashboard`
- `pages/admin/course-list`
- `pages/admin/course-form`
- `pages/admin/activity-list`
- `pages/admin/activity-form`
- `pages/admin/signups`
- `pages/admin/site-settings`

### 云函数

- `cloudfunctions/auth` 管理员鉴权
- `cloudfunctions/portal` 前台公开数据接口
- `cloudfunctions/submitSignup` 报名提交
- `cloudfunctions/adminContent` 管理端内容管理
- `cloudfunctions/adminDashboard` 仪表盘统计
- `cloudfunctions/bootstrapData` 初始化基础数据

### 通用工具

- `utils/cloud.js` 云函数调用与图片上传封装
- `utils/services/public-service.js` 前台服务层
- `utils/services/admin-service.js` 管理端服务层
- `utils/config.js` 环境配置

## 快速开始

### 1. 配置云环境

修改 `utils/config.js`：

- `CLOUD_ENV_ID` 改为你自己的云开发环境 ID
- 如需修改品牌名和上传目录，也可一并调整

### 2. 导入微信开发者工具

1. 打开微信开发者工具
2. 导入当前项目目录
3. 选择真实 AppID 或测试号
4. 确认项目已开通云开发

### 3. 创建数据库集合

在云开发控制台中创建：

- `courses`
- `activities`
- `signups`
- `admins`
- `site_settings`

### 4. 上传云函数

在微信开发者工具中，分别上传并部署：

- `auth`
- `portal`
- `submitSignup`
- `adminContent`
- `adminDashboard`
- `bootstrapData`

### 5. 初始化管理员

方式一：
- 先进入管理台页面
- 通过“绑定首个管理员”功能绑定当前微信号

方式二：
- 手工在 `admins` 集合中插入管理员 openid

### 6. 初始化示例数据

在管理台仪表盘执行初始化，或手工调用 `bootstrapData` 云函数。

## 项目结构

```text
.
├── app.js
├── app.json
├── app.wxss
├── project.config.json
├── sitemap.json
├── cloudfunctions
│   ├── auth
│   ├── portal
│   ├── submitSignup
│   ├── adminContent
│   ├── adminDashboard
│   └── bootstrapData
├── docs
│   └── cloud-architecture.md
├── pages
│   ├── home
│   ├── courses
│   ├── course-detail
│   ├── activities
│   ├── activity-detail
│   ├── signup
│   ├── profile
│   └── admin
└── utils
    ├── config.js
    ├── cloud.js
    ├── constants.js
    └── services
```

## 上线前建议补充

- 云数据库权限规则配置
- 隐私协议与用户信息收集声明
- 报名状态流转与跟进备注
- 图片压缩与 CDN 优化
- 课程分享海报、优惠券、试听核销
- CRM / 企业微信 / 短信通知集成

## 说明

当前仓库已经不是本地 demo 结构，而是正式的微信云开发项目骨架。  
后续只需补真实云环境 ID、上传云函数、初始化管理员和数据库，即可进入内容运营阶段。
