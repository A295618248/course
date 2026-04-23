# 星河艺术中心云开发项目架构

## 1. 项目组成

本项目分为两大部分：

### 前台小程序

- 首页内容展示
- 课程列表与课程详情
- 活动列表与活动详情
- 报名提交
- 我的报名记录

### 管理台子包

- 管理看板
- 课程管理
- 活动管理
- 报名线索管理
- 站点设置
- 图片上传到云存储

## 2. 云数据库集合

### `courses`

建议字段：

- `title`
- `category`
- `ageRange`
- `duration`
- `priceText`
- `priceValue`
- `classSize`
- `schedule`
- `summary`
- `description`
- `tags`
- `highlights`
- `outline`
- `coverImage`
- `published`
- `sort`
- `createdAt`
- `updatedAt`

建议索引：

- `published`
- `category`
- `sort`
- `updatedAt`

### `activities`

建议字段：

- `title`
- `type`
- `date`
- `time`
- `location`
- `capacity`
- `enrolled`
- `fee`
- `status`
- `summary`
- `description`
- `agenda`
- `coverImage`
- `published`
- `sort`
- `createdAt`
- `updatedAt`

建议索引：

- `published`
- `status`
- `date`
- `sort`

### `signups`

建议字段：

- `businessType`
- `targetId`
- `targetTitle`
- `targetSubtitle`
- `parentName`
- `phone`
- `studentName`
- `age`
- `interest`
- `preferredTime`
- `remark`
- `status`
- `openid`
- `createdAt`
- `updatedAt`

建议索引：

- `businessType`
- `targetId`
- `phone`
- `openid`
- `createdAt`

### `admins`

用于管理端鉴权。

建议字段：

- `openid`
- `name`
- `role`
- `active`
- `createdAt`

### `site_settings`

用于维护首页文案、机构介绍和联系方式。

建议字段：

- `brandName`
- `heroTitle`
- `heroSubtitle`
- `contactPhone`
- `address`
- `intro`
- `serviceNotice`
- `bannerImages`
- `featuredCourseIds`
- `featuredActivityIds`
- `updatedAt`

## 3. 云函数设计

### `auth`

功能：

- 获取当前用户 openid
- 判断是否为管理员
- 首次绑定管理员

### `portal`

前台接口：

- 获取首页数据
- 获取课程列表
- 获取课程详情
- 获取活动列表
- 获取活动详情

### `submitSignup`

功能：

- 报名表单校验
- 写入 `signups`
- 活动报名时更新 `activities.enrolled`

### `adminContent`

功能：

- 课程列表查询
- 活动列表查询
- 报名线索查询
- 我的报名记录查询
- 保存课程
- 保存活动
- 获取站点设置
- 更新站点设置

### `adminDashboard`

功能：

- 总体统计
- 最近 7 天趋势
- 课程 / 活动 / 咨询占比
- 热门课程 / 热门活动
- 最新报名线索

### `bootstrapData`

功能：

- 初始化默认课程
- 初始化默认活动
- 初始化站点配置
- 初始化首个管理员数据

## 4. 云存储建议

推荐目录规范：

- `art-center/course/`
- `art-center/activity/`
- `art-center/site/`
- `art-center/admin/`

数据库中存储 `cloud://` fileID。

## 5. 权限建议

### 普通用户

- 只能读取已发布课程 / 活动
- 只能查看自己的报名记录
- 报名统一通过云函数提交

### 管理员

- 必须在 `admins` 集合中存在并且 `active = true`
- 所有管理操作通过云函数进行

## 6. 部署步骤

1. 开通微信云开发环境
2. 修改 `utils/config.js` 中的 `CLOUD_ENV_ID`
3. 在微信开发者工具中配置 `cloudfunctionRoot`
4. 创建集合：
   - `courses`
   - `activities`
   - `signups`
   - `admins`
   - `site_settings`
5. 上传并部署所有云函数
6. 通过 `auth` 云函数绑定首个管理员，或手工写入 `admins`
7. 调用 `bootstrapData` 初始化数据
8. 进入管理台补充真实课程、活动、图片和站点信息

