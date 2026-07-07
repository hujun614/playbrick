# AGENTS.md

## 项目概述

《像素砖块冲击》(Pixel Brick Impact) —— 基于 **Phaser 3.80 + Vite + TypeScript** 的抖音竖屏小游戏（打砖块 / Breakout）。设计文档见 `docs/begindocs/`（GDD、技术方案、数值配置表、测试验收清单）。

这是纯前端客户端游戏：**没有后端、没有数据库、没有环境变量 / secret**。

## 目录结构

- `src/config/` — `gameValue.ts`（全部数值，改数值只改这里）、`resourceKey.ts`（资源 / 场景 Key 常量）
- `src/core/` — `TextureFactory`（代码生成纹理）、`ObjectPool`、`Storage`、`SceneManager`
- `src/game/` — `Paddle` / `Ball` / `Brick` / `Item` 实体
- `src/scenes/` — `Boot` / `Menu` / `Game` / `Result` 四大场景
- `src/main.ts` — 入口，注册 Phaser.Game

## 常用命令（见 `package.json` scripts）

- 开发运行：`npm run dev`（Vite dev server，默认 `http://localhost:5173/`）
- 类型检查 / lint：`npm run typecheck`（等价 `npm run lint`，均为 `tsc --noEmit`）
- 生产构建：`npm run build`

没有自动化测试框架；验收方式是 `docs/begindocs/04_测试验收清单.md` 的手动清单。功能验证请在浏览器里跑 `npm run dev` 手动测。

## Cursor Cloud specific instructions

- 服务只有一个：Vite dev server（`npm run dev`，端口 5173）。无后端 / DB / secret，可直接启动手动测试。
- **纹理全部由代码生成**（GDD 学习目标 #1）：`src/core/TextureFactory.ts` 在 `BootScene` 里用 `Phaser.Graphics.generateTexture` 生成并注册全部纹理，`RES_KEY` 对应的是这些运行时纹理，**不是磁盘图片文件**。仓库里没有、也不需要 `.png` 资源；新增视觉元素应在 `TextureFactory` 里加生成逻辑。
- **Arcade 物理易踩坑**：把已有 body 的 sprite `add` 进 `Phaser.Physics.Arcade.Group` 会用组默认值重置该 body（`bounce=0`、`collideWorldBounds=false`），覆盖构造函数里的设置。因此小球的 `setBounce` / `setCircle` / `setCollideWorldBounds` 必须在**入组之后**配置——见 `Ball.launch()`（在 `GameScene.spawnBall` 中 `group.add` 之后调用）。否则小球会径直飞出屏幕、不反弹、不碰砖。
- 底部世界边界在 `GameScene` 里被关闭（`setBoundsCollision(true,true,true,false)`），小球落到底部走对象池回收 + 扣血逻辑，而非反弹。
- 抖音本地存储：`src/core/Storage.ts` 优先用 `tt.getStorageSync/setStorageSync`，浏览器开发环境自动降级为 `localStorage`（最高分持久化）。
