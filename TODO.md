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

- [ ] **第 3 步：Supabase 登录 + 云端进度**（代码已完成并提交，等 Supabase 后台设置后测试）
  - [x] Supabase 项目：`petit-french`，东京区域（ap-northeast-1），Project URL `https://dndkhnudbztndwmmaxwb.supabase.co`
  - [x] publishable key 已保存在 `.env.local`（已被 git 忽略；部署时要在 Vercel 里配置同样的环境变量）
  - [x] 代码：邮箱魔法链接登录（`app/login`、`app/auth/callback`）、云端同步（`lib/sync.ts`）、合并逻辑（`lib/merge.ts`，测试已通过）、完整「我的」页面
  - [ ] **Alice 要在 Supabase 后台做：**
    - [x] SQL Editor → New query → 粘贴 `supabase/schema.sql` 全部内容 → Run（建 `progress` 表 + RLS + grant）
    - [x] Authentication → URL Configuration：Site URL 填 `http://localhost:3005`，Redirect URLs 加 `http://localhost:3005/auth/callback`
    - [ ] 删除德国区域的旧项目
  - [ ] 设置后：Claude 检查表是否建好 → Alice 用自己的邮箱在 http://localhost:3005/login 测试登录 → 检查同步、两个账号互相看不到数据
  - 注意：免费方案自带邮件每小时只能发很少几封，测试时别连续发送
- [ ] 第 4 步：词库迁到数据库
- [ ] 第 5 步：用 edge-tts 生成真人感 mp3 发音，替换浏览器语音
- [ ] 第 6 步：用 AI 绘图（Recraft / Midjourney）做像素风吉祥物和图标，替换手画的占位图标（Alice 指导流程）
- [ ] 第 7 步：iOS 版（SwiftUI，共用同一个 Supabase）

## 小问题 / 以后再做

- [ ] 「我的」页面已有统计和设置，还缺词汇本（已掌握 / 学习中 / 易错词列表）
- [ ] 空课程状态（全部学完且没有要复习的词）只按代码逻辑核对过，没有实测
- [ ] 部署：确认后部署到 Vercel，再把 `next` 合并到 `main` 替换旧版；新网址的浏览器进度不会继承旧网址的
- [ ] DELF A1 词汇是按经验整理的，没有逐条对照官方考纲
- [ ] 以后可以考虑加 DELF A2 内容
