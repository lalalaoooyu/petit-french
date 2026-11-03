# Petit Français TODO

最后更新：2026-11-03

## 当前状态

- `main` 分支：旧版单文件像素风网站（现在在 `legacy/index.html`），线上地址 https://lalalaoooyu.github.io/petit-french/
- `next` 分支：Next.js 重写版，**已部署到 Vercel：https://petit-french.vercel.app/**（推送到 `next` 就会自动部署；2026-11-03 手机上能打开）
  - 本地运行：`npm install` 后 `npx next dev -p 3005`
  - 注意：`npm run build` 会覆盖 `.next`，跑完要先删掉 `.next` 再启动 dev server

## 路线图（2026-11-02 决定）

1. **先把网页版部署好**（Vercel，做到一半，见下方「部署」）
2. **给朋友用一段时间，收集反馈**
3. **同时扩充内容**（A1 + A2、听力、语法讲解）
4. **再开始做 iOS 版**：内容更扎实后再上架，审核和卖订阅都更顺利

iOS 上架要点（备忘）：
- 需要 Apple Developer 账号（约 ¥13,000/年）；首次审核通常 1–3 天，被拒一两次很正常
- 容易被拒的地方：订阅页面没写清价格和自动续费、没有「恢复购买」、没有 EULA 和隐私政策链接、引导去网页付款、App 内不能删除账号、没给审核员准备测试账号（邮件链接登录审核员收不到信）、内容太单薄、隐私问卷和实际不符
- 有第三方登录时必须提供 Apple 登录
- 从开始做 iOS 版到上架，大约 1–2 个月

## 已完成

- [x] 第 1 步：Next.js 骨架、首页「今天」、课程路径（单元解锁和星级）、底部导航
- [x] 词库扩充到约 400 个词：日常 13 个单元、考试（DELF A1）19 个单元，带例句、小贴士、阴阳性标签
- [x] 第 2 步：一节课流程（复习 → 学新词 → 四种题型 → 配对 → 结算页）、练习页

## 待办（按顺序）

- [x] **第 3 步：Supabase 登录 + 云端进度**（2026-11-02 Alice 用自己的邮箱登录成功）
  - [x] Supabase 项目：`petit-french`，东京区域（ap-northeast-1），Project URL `https://dndkhnudbztndwmmaxwb.supabase.co`
  - [x] publishable key 已保存在 `.env.local`（已被 git 忽略；部署时要在 Vercel 里配置同样的环境变量）
  - [x] 代码：邮箱魔法链接登录（`app/login`、`app/auth/callback`）、云端同步（`lib/sync.ts`）、合并逻辑（`lib/merge.ts`，测试已通过）、完整「我的」页面
  - [ ] **Alice 要在 Supabase 后台做：**
    - [x] SQL Editor → New query → 粘贴 `supabase/schema.sql` 全部内容 → Run（建 `progress` 表 + RLS + grant）
    - [x] Authentication → URL Configuration：Site URL 填 `http://localhost:3005`，Redirect URLs 加 `http://localhost:3005/auth/callback`
    - [ ] 删除德国区域的旧项目
  - [x] 表已建好（未登录访问会被拒绝），本地登录测试成功
  - [ ] 还没测：两台设备之间的同步；用第二个账号确认看不到别人的数据
  - 登录改用 implicit flow：邮件链接在任何浏览器打开都能登录（PKCE 要求同一浏览器，之前因此失败）
  - 注意：免费方案自带邮件每小时只能发很少几封，测试时别连续发送
- [ ] 第 4 步：词库迁到数据库
- [ ] 第 5 步：用 edge-tts 生成真人感 mp3 发音，替换浏览器语音
- [ ] 第 6 步：用 AI 绘图（Recraft / Midjourney）做像素风吉祥物和图标，替换手画的占位图标（Alice 指导流程）
- [ ] 第 7 步：iOS 版（SwiftUI，共用同一个 Supabase）

## 小问题 / 以后再做

- [ ] 「我的」页面已有统计和设置，还缺词汇本（已掌握 / 学习中 / 易错词列表）
- [ ] 空课程状态（全部学完且没有要复习的词）只按代码逻辑核对过，没有实测
- [ ] **部署到 Vercel（基本完成，2026-11-03）**
  - [x] 已在 Vercel 导入 GitHub 仓库，项目名 `petit-french`（Hobby 方案）
  - [x] Framework Preset 从 Node 改成 Next.js；两个环境变量已填（类型选 Config，Production + Preview）
  - [x] Production Branch 改成 `next`（新版在 Environments → Production → Branch Tracking）
  - [x] Next.js 15.5.4 有安全漏洞，Vercel 拒绝构建 → 升到 15.5.28
  - [x] Supabase URL Configuration：Site URL 改成线上网址，Redirect URLs 加了 `https://petit-french.vercel.app/auth/callback`（localhost 那条保留）
  - [x] 手机能打开网站
  - [ ] 线上测登录、两台设备之间的同步
  - [ ] 新版没问题后，把 `next` 合并到 `main`，关掉 GitHub Pages 或让旧网址跳转；旧网址上的浏览器进度不会自动带过去（登录过的进度在云端）
- [ ] DELF A1 词汇是按经验整理的，没有逐条对照官方考纲
- [ ] 以后可以考虑加 DELF A2 内容

## 商业化（iOS 上架收费）

**已决定（2026-11-02）：免费 + 订阅**
- 价格方向：月费 ¥480–680 / 年费 ¥3,800–5,800，7 天免费试用（最初设想的 ¥15,000/年 比 Duolingo、Busuu 都贵，内容量撑不起）
- 免费：基础单元；付费：全部单元、考试课程、真人发音、复习功能等（具体划分待定）
- 定位：在日本的中文母语者学法语 + DELF 备考（没找到直接竞品）
- 以后内容多了可以加：DELF 考试包一次性购买，订阅用户有折扣

**竞品价格参考**（多为第三方来源，未经官方确认）
- Duolingo Super：约 ¥9,900/年，月费约 ¥1,990；Max 约 ¥22,800/年
- Busuu Premium：约 ¥12,000+税/年
- Babbel：约 $107–119/年，经常打折；终身版打折时约 $130–160
- superFLE（DELF/TCF 模拟考）：周/月/季度订阅；PrepMyDELF B2：一次性 €49

**成本参考**：Apple Developer 约 ¥13,000/年；Apple 抽成 15%（小型企业计划）；Supabase Pro 约 $25/月；Vercel Hobby 不允许商用（网页版收费要升 Pro 约 $20/月）

**上架收费前要做**
- [ ] 内容扩充到 A1 + A2，加听力和语法讲解（400 个词撑不起订阅）
- [ ] 确定免费/付费内容划分
- [ ] 发音换成可商用的 TTS（Azure / Google），edge-tts 商用条款不明确
- [ ] Sign in with Apple（有第三方登录时必须提供）
- [ ] 隐私政策、用户协议页面
- [ ] 开业届 / 报税（可咨询税理士）
- [ ] 宣传时写「对应 DELF A1」，不要让人以为是官方产品
- [ ] 补充调研：在 iPhone 上确认竞品实际订阅价；看用户对价格的评论；向东京日法学院了解 DELF 考生人数
