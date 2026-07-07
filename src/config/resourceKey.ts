/**
 * 全局资源常量 Key（对应 docs/begindocs/02_技术方案 §3.2）
 * 所有精灵、纹理、音频均通过此处常量索引，禁止硬编码字符串路径。
 *
 * 依据 GDD 核心学习目标：全部精灵由代码生成（Phaser.Graphics 生成纹理），
 * 因此此处的 Key 对应 BootScene 中动态生成并注册的纹理，而非磁盘图片文件。
 */
export const RES_KEY = {
  // 挡板
  PADDLE_NORMAL: "paddle_normal",
  PADDLE_WIDE: "paddle_wide",
  // 小球
  BALL: "ball",
  // 砖块
  BRICK_GREY: "brick_grey",
  BRICK_BLUE: "brick_blue",
  BRICK_BLUE_HIT: "brick_blue_hit",
  BRICK_GOLD: "brick_gold",
  // 道具图标
  ITEM_WIDE_PADDLE: "item_wide_paddle",
  ITEM_DOUBLE_SCORE: "item_double_score",
  ITEM_MULTI_BALL: "item_multi_ball",
  // UI 素材
  HEART: "heart",
  BUTTON: "button",
} as const;

export type ResKey = (typeof RES_KEY)[keyof typeof RES_KEY];

/** 场景 Key 统一索引，配合 SceneManager 解耦跳转 */
export const SCENE_KEY = {
  BOOT: "BootScene",
  MENU: "MenuScene",
  GAME: "GameScene",
  RESULT: "ResultScene",
} as const;
