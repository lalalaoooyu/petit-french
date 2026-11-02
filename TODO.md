# Petit Français TODO

最后更新：2026-11-02

## 当前状态

- `main` 分支：旧版单文件像素风网站（现在在 `legacy/index.html`），线上地址 https://lalalaoooyu.github.io/petit-french/
- `next` 分支：Next.js 重写版，已推送到 GitHub，**还没部署成功**
  - 本地运行：`npm install` 后 `npx next dev -p 3005`
  - 注意：`npm run build` 会覆盖 `.next`，跑完要先删掉 `.next` 再启动 dev server

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
- [ ] **部署到 Vercel（做了一半）**
  - [x] 已在 Vercel 导入 GitHub 仓库，项目名 `petit-french`（Hobby 方案）
  - [x] 第一次部署用了 `main` 分支，失败了（预期之内：main 上只有旧版 HTML，没有 Next.js 项目）
  - [ ] 确认 Application Preset / Framework 是 Next.js，两个环境变量 `NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 已填（值见 `.env.local`）
  - [ ] Settings → Git → Production Branch 改成 `next`，然后推送一个改动触发重新部署
  - [ ] 拿到网址后，把它加进 Supabase → Authentication → URL Configuration（Site URL 和 Redirect URLs 的 `/auth/callback`）
  - [ ] 线上检查各页面；用手机测登录和多设备同步
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
