# 星河艺术中心微信云开发项目

这是一个面向艺术培训机构的小程序正式项目结构，包含：

- 家长端小程序
- 管理端小程序子包
- 微信云开发数据库
- 云函数
- 云存储图片上传
- 课程 / 活动 / 报名 / 数据统计

适用于少儿美术、书法、陶艺、创意手工、亲子活动等机构的招生展示与运营管理。

---

## 一、项目已经具备的能力

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

---

## 二、你需要修改的配置文件

这一节是最重要的。真正部署前，你主要需要修改以下几个文件。

### 1. `utils/config.js`

这是**必须修改**的文件。

当前内容中最关键的是：

```js
const CLOUD_ENV_ID = 'replace-with-your-cloud-env-id';
const BRAND_NAME = '星河艺术中心';
const UPLOAD_ROOT = 'art-center';
```

你需要改的字段：

#### `CLOUD_ENV_ID`

- 含义：微信云开发环境 ID
- 是否必须修改：**必须**
- 示例：

```js
const CLOUD_ENV_ID = 'art-center-3g2a1bxxxxxx';
```

如何获取：

1. 打开微信开发者工具
2. 点击顶部“云开发”
3. 进入已开通的云环境
4. 在环境概览页复制环境 ID

#### `BRAND_NAME`

- 含义：小程序默认品牌名称
- 是否必须修改：建议修改成你弟机构的真实名字
- 示例：

```js
const BRAND_NAME = '天际线少儿艺术中心';
```

#### `UPLOAD_ROOT`

- 含义：云存储上传根目录
- 是否必须修改：非必须
- 默认值：`art-center`
- 作用：课程、活动、站点图片会上传到类似下面的路径：

```text
art-center/course/
art-center/activity/
art-center/site/
art-center/admin/
```

如果你想换成自己机构名字，可以改为：

```js
const UPLOAD_ROOT = 'tianjixian-art';
```

#### `DEFAULT_SITE_SETTINGS`

这是默认站点信息，建议改成真实机构信息：

```js
const DEFAULT_SITE_SETTINGS = {
  brandName: BRAND_NAME,
  heroTitle: '让每个孩子找到自己的艺术表达',
  heroSubtitle: '围绕课程、活动、试听与成长规划，打造适合艺术培训机构招生和运营的一体化小程序。',
  contactPhone: '400-800-5200',
  address: '广州市天河区艺术路 88 号',
  intro: '面向 4-16 岁少儿与青少年，提供美术、书法、陶艺、创意手工等课程，支持试听、活动报名和成长档案管理。'
};
```

建议你重点改：

- `heroTitle`
- `heroSubtitle`
- `contactPhone`
- `address`
- `intro`

虽然这些内容后续也可以通过管理台修改，但在首次部署时先填成真实值更稳妥。

---

### 2. `project.config.json`

这个文件里最关键的是：

```json
"appid": "touristappid"
```

你需要改的字段：

#### `appid`

- 含义：微信小程序真实 AppID
- 是否必须修改：**正式部署时必须**
- 本地临时预览：可以先保持测试状态，或者在导入项目时重新选择 AppID

正式示例：

```json
"appid": "wx1234567890abcdef"
```

如何获取：

1. 登录微信公众平台
2. 进入你的小程序
3. 在“开发 -> 开发管理”中找到 AppID

#### `projectname`

- 含义：开发者工具中的项目名称
- 是否必须修改：非必须
- 建议改成你的机构项目名，便于区分

例如：

```json
"projectname": "tianjixian-art-miniapp"
```

#### `cloudfunctionRoot`

当前已经配置好：

```json
"cloudfunctionRoot": "cloudfunctions/"
```

通常**不需要改**，除非你自己调整了云函数目录。

---

### 3. `app.js`

当前这里会初始化云环境：

```js
wx.cloud.init({
  env: CLOUD_ENV_ID,
  traceUser: true
});
```

通常你**不需要直接修改 `app.js`**，因为它读取的是 `utils/config.js` 中的 `CLOUD_ENV_ID`。

只有当你需要：

- 切换多环境（开发 / 测试 / 正式）
- 接入更复杂的运行时配置

才需要再调整它。

---

### 4. `app.json`

这个文件定义了：

- 小程序页面
- 管理端子包
- tabBar

通常部署时**不需要修改**。

只有当你想：

- 新增页面
- 调整 tabBar 文案
- 调整管理台子包结构

才需要改。

---

## 三、完整部署流程

下面是一套建议你按顺序执行的标准部署流程。

---

### 第 1 步：准备微信小程序和云开发环境

你需要先具备：

1. 一个可用的小程序账号
2. 小程序对应的真实 AppID
3. 已开通微信云开发环境

操作步骤：

1. 登录微信公众平台
2. 创建或进入你的小程序
3. 记录 AppID
4. 打开微信开发者工具
5. 登录同一个微信账号
6. 开通云开发环境

建议至少创建一个环境，例如：

- 开发环境：`art-center-dev`

后续如果要更规范，可以再拆：

- `dev`
- `test`
- `prod`

---

### 第 2 步：修改项目配置

#### 修改 `utils/config.js`

至少把下面这些值改掉：

```js
const CLOUD_ENV_ID = '你的真实云环境ID';
const BRAND_NAME = '你的机构名称';
const UPLOAD_ROOT = '你的上传根目录';
```

#### 修改 `project.config.json`

至少确认：

```json
"appid": "你的真实小程序AppID"
```

---

### 第 3 步：导入项目到微信开发者工具

操作步骤：

1. 打开微信开发者工具
2. 选择“导入项目”
3. 项目目录选择当前仓库根目录
4. AppID 选择你真实的小程序 AppID
5. 勾选云开发能力
6. 打开项目后，确认顶部已显示云开发入口

导入后建议检查两件事：

1. 是否识别了 `cloudfunctionRoot`
2. 是否能看到 `cloudfunctions` 目录下的函数

---

### 第 4 步：创建云数据库集合

进入“云开发 -> 数据库”，手动创建以下集合：

- `courses`
- `activities`
- `signups`
- `admins`
- `site_settings`

建议集合用途如下：

#### `courses`

存课程信息：

- 标题
- 分类
- 年龄范围
- 价格
- 课程介绍
- 亮点
- 大纲
- 封面图
- 发布状态

#### `activities`

存活动信息：

- 标题
- 类型
- 日期
- 时间
- 地点
- 名额
- 已报名人数
- 活动详情
- 封面图
- 发布状态

#### `signups`

存报名和咨询线索：

- 家长姓名
- 手机号
- 学员姓名
- 年龄
- 咨询目标
- 来源
- 提交时间

#### `admins`

存管理员身份：

- openid
- 姓名
- 角色
- 是否启用

#### `site_settings`

存机构站点配置：

- 品牌名称
- 首页标题
- 首页副标题
- 联系电话
- 地址
- 机构简介
- banner 图

---

### 第 5 步：配置数据库权限

这是正式项目里非常重要的一步。

建议原则：

- 前台用户不要直接对课程、活动、报名做任意写入
- 管理操作统一走云函数
- 普通用户只读公开内容
- 我的报名记录只允许通过云函数按 openid 查询

简单建议：

1. `courses` / `activities`：
   - 禁止客户端直接写
   - 读公开数据可放宽，或统一通过云函数读取

2. `signups`：
   - 禁止客户端直接读全量
   - 禁止客户端直接写
   - 全部通过云函数 `submitSignup` / `adminContent` 处理

3. `admins`：
   - 禁止客户端直接写
   - 建议仅管理员相关云函数读取

4. `site_settings`：
   - 禁止客户端直接写
   - 前台可通过云函数读取

如果你希望，我下一步还能继续帮你把**数据库权限规则文本直接写出来**。

---

### 第 6 步：上传并部署云函数

当前项目中需要部署的云函数有：

- `auth`
- `portal`
- `submitSignup`
- `adminContent`
- `adminDashboard`
- `bootstrapData`

在微信开发者工具中的操作方式：

1. 打开左侧 `cloudfunctions`
2. 右键某个云函数目录
3. 选择“上传并部署：云端安装依赖”
4. 依次部署全部函数

建议部署顺序：

1. `auth`
2. `portal`
3. `submitSignup`
4. `adminContent`
5. `adminDashboard`
6. `bootstrapData`

为什么建议这个顺序：

- `auth` 和 `portal` 是基础读接口
- `submitSignup` 是前台核心写接口
- `adminContent` 和 `adminDashboard` 是管理台核心
- `bootstrapData` 最后部署，用于初始化内容

部署完成后，可以在云函数测试面板简单测试：

#### 测试 `auth`

传参：

```json
{
  "action": "status"
}
```

#### 测试 `portal`

传参：

```json
{
  "action": "getHomeData"
}
```

如果返回正常 JSON，说明基础链路通了。

---

### 第 7 步：初始化管理员

管理员有两种开通方式。

#### 方式 A：通过小程序管理台绑定首位管理员

适合第一次部署时使用。

操作方式：

1. 打开管理台首页
2. 点击“绑定首位管理员”
3. 当前登录微信会被写入 `admins` 集合

前提：

- `admins` 集合中还没有管理员数据

#### 方式 B：手工写入管理员记录

在 `admins` 集合中新增一条记录，例如：

```json
{
  "openid": "你的微信openid",
  "name": "机构管理员",
  "role": "super_admin",
  "active": true,
  "createdAt": "建议使用服务端时间"
}
```

如果你不知道自己的 openid，有两种方式：

1. 在 `auth` 云函数中调用 `status`
2. 查看函数返回的 `openid`

---

### 第 8 步：初始化基础数据

项目提供了 `bootstrapData` 云函数，用于首次写入默认课程、活动和站点配置。

你可以通过两种方式执行：

#### 方式 A：管理台仪表盘触发

适合已经绑定管理员的情况。

#### 方式 B：云函数测试面板调用

测试参数：

```json
{
  "action": "seed",
  "reset": false
}
```

如果你想重置基础数据，可以改成：

```json
{
  "action": "seed",
  "reset": true
}
```

注意：

- `reset: true` 可能会覆盖已有初始化内容
- 正式运营环境下不要随意执行重置

---

### 第 9 步：配置云存储图片

本项目使用 `wx.cloud.uploadFile` 上传图片到云存储。

你不需要手动创建存储目录，上传时会自动生成路径。

默认上传路径前缀来自：

```js
const UPLOAD_ROOT = 'art-center';
```

因此最终路径类似：

- `art-center/course/...`
- `art-center/activity/...`
- `art-center/site/...`
- `art-center/admin/...`

部署后你需要做的事情：

1. 在管理台新建课程或活动
2. 点击上传图片
3. 图片成功上传后，会得到 `cloud://` fileID
4. 该 fileID 会写入数据库

如果后续你要做：

- CDN 加速
- 自定义域名
- 图片压缩

可以再继续扩展。

---

### 第 10 步：进入管理台录入正式数据

完成管理员和基础数据初始化后，你就可以：

1. 进入管理台
2. 创建真实课程
3. 创建真实活动
4. 上传课程 / 活动封面图
5. 修改首页品牌信息
6. 查看报名线索

建议上线前把以下内容全部替换为真实数据：

- 机构名称
- 首页主标题 / 副标题
- 联系电话
- 地址
- 课程价格
- 活动时间
- 图片素材

---

## 四、建议你重点检查的文件

### 必改

- `utils/config.js`
- `project.config.json`

### 部署时重点关注

- `app.js`
- `cloudfunctions/*`

### 通常不需要手改，但要理解作用

- `app.json`
- `utils/cloud.js`
- `utils/services/public-service.js`
- `utils/services/admin-service.js`

---

## 五、推荐的首次部署顺序

如果你想尽量少踩坑，建议严格按下面顺序来：

1. 修改 `utils/config.js`
2. 修改 `project.config.json` 中的 `appid`
3. 微信开发者工具导入项目
4. 开通并选择云环境
5. 创建数据库集合
6. 上传全部云函数
7. 调用 `auth` 测试获取 openid
8. 绑定首位管理员
9. 调用 `bootstrapData`
10. 打开管理台，配置机构信息
11. 上传课程 / 活动图片
12. 发布正式课程与活动
13. 真机预览整个报名流程

---

## 六、首次联调时的排查建议

### 问题 1：页面提示云函数调用失败

优先检查：

1. `utils/config.js` 的 `CLOUD_ENV_ID` 是否正确
2. 云函数是否已全部部署
3. 当前项目是否连接到了正确云环境

### 问题 2：管理台无法进入

优先检查：

1. 当前微信号是否在 `admins` 集合中
2. `active` 是否为 `true`
3. 是否先执行了首位管理员绑定

### 问题 3：图片上传失败

优先检查：

1. 云环境是否正常
2. 小程序是否启用了云开发
3. 当前微信基础库是否支持 `wx.cloud.uploadFile`

### 问题 4：前台没数据显示

优先检查：

1. 是否执行了 `bootstrapData`
2. 课程 / 活动是否已发布
3. 数据库中是否有内容

### 问题 5：报名提交成功但管理台没有看到

优先检查：

1. `submitSignup` 是否部署成功
2. `signups` 集合是否存在
3. 管理台读取的云环境是否和前台提交的环境一致

---

## 七、项目结构

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

---

## 八、上线前建议继续补充

- 云数据库权限规则文本
- 隐私协议与用户信息收集声明
- 报名状态流转与跟进备注
- 图片压缩与 CDN 优化
- 课程分享海报、优惠券、试听核销
- CRM / 企业微信 / 短信通知集成
- 开发 / 测试 / 正式 多环境切换

---

## 九、补充说明

当前仓库已经不是本地 demo 结构，而是正式的微信云开发项目骨架。  
你现在最需要做的不是再写页面，而是：

1. 改配置
2. 开云环境
3. 建集合
4. 部署云函数
5. 绑定管理员
6. 初始化数据
7. 用管理台维护正式内容

如果你需要，我下一步还可以继续直接帮你补：

- **数据库权限规则示例**
- **每个集合的索引配置建议**
- **云函数逐个部署截图式说明**
- **如何获取 openid 并绑定管理员**
- **正式上线前检查清单**
