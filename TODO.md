# Petit Français TODO

最后更新：2026-11-02

## 当前状态

- `main` 分支：旧版单文件像素风网站（现在在 `legacy/index.html`），线上地址 https://lalalaoooyu.github.io/petit-french/
- `next` 分支：Next.js 重写版，**只在本地提交，还没推送到 GitHub，也没部署**
  - 本地运行：`npm install` 后 `npx next dev -p 3005`
  - 注意：`npm run build` 会覆盖 `.next`，跑完要先删掉 `.next` 再启动 dev server

## 已完成

- [x] 第 1 步：Next.js 骨架、首页「今天」、课程路径（单元解锁和星级）、底部导航
- [x] 词库扩充到约 400 个词：日常 13 个单元、考试（DELF A1）19 个单元，带例句、小贴士、阴阳性标签
- [x] 第 2 步：一节课流程（复习 → 学新词 → 四种题型 → 配对 → 结算页）、练习页

## 待办（按顺序）

- [ ] **第 3 步：Supabase 登录 + 云端进度**（方案已确认，见下）
  - 需要 Alice 先做：在 supabase.com 新建项目（免费方案，东京区域），把 Project URL 和 anon key 给 Claude（不要给 service_role key）
  - 第一版只做邮箱魔法链接登录；Google 登录之后再加；Apple 登录等做 iOS 时再加
  - 一张 `progress` 表（user_id / data JSON / updated_at），开启 RLS，每人只能读写自己的那一行
  - 登录时合并本地和云端进度：已掌握和错题取并集，经验值和最高分取较大值，复习时间取更早的
  - 答题后先存本地，2 秒后再同步云端；断网也能学
  - 文件：`lib/supabase.ts`、建表 SQL、`lib/progress.ts`、`app/login`、`app/auth/callback`、`app/me`
- [ ] 第 4 步：词库迁到数据库
- [ ] 第 5 步：用 edge-tts 生成真人感 mp3 发音，替换浏览器语音
- [ ] 第 6 步：用 AI 绘图（Recraft / Midjourney）做像素风吉祥物和图标，替换手画的占位图标（Alice 指导流程）
- [ ] 第 7 步：iOS 版（SwiftUI，共用同一个 Supabase）

## 小问题 / 以后再做

- [ ] 「我的」页面还是占位：要做学习统计、词汇本（已掌握 / 学习中 / 易错）、设置（每日目标、语速）
- [ ] 空课程状态（全部学完且没有要复习的词）只按代码逻辑核对过，没有实测
- [ ] 部署：确认后部署到 Vercel，再把 `next` 合并到 `main` 替换旧版；新网址的浏览器进度不会继承旧网址的
- [ ] DELF A1 词汇是按经验整理的，没有逐条对照官方考纲
- [ ] 以后可以考虑加 DELF A2 内容
