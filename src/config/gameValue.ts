/**
 * 全局数值配置表（对应 docs/begindocs/03_数值配置表.md）
 * 所有游戏数值统一在此维护，业务代码禁止硬编码数字。
 */
export const GAME_VALUE = {
  // 1 屏幕与基础尺寸
  WIDTH: 720,
  HEIGHT: 1280,
  PADDLE_WIDTH: 120,
  PADDLE_WIDTH_WIDE: 180,
  PADDLE_HEIGHT: 24,
  BRICK_WIDTH: 80,
  BRICK_HEIGHT: 32,
  BRICK_GAP_X: 8,
  BRICK_GAP_Y: 12,

  // 2 移动与速度数值
  BALL_SPEED_X: 220,
  BALL_SPEED_Y: -280,
  PADDLE_SPEED_KEYBOARD: 380,
  TOUCH_SENSITIVITY: 1.0,

  // 3 生命与得分
  INIT_LIFE: 3,
  SCORE_GREY: 10,
  SCORE_BLUE: 10,
  SCORE_GOLD: 30,
  DOUBLE_SCORE_RATE: 2,

  // 4 道具持续时长
  WIDE_PADDLE_DURATION: 10, // 秒
  DOUBLE_SCORE_DURATION: 8, // 秒
  MULTI_BALL_EXTRA: 2,
  ITEM_FALL_SPEED: 150,

  // 5 砖块布局参数
  BRICK_ROWS: 4,
  BRICK_COLS: 8,
  BRICK_START_Y: 200,

  // 6 性能与对象池
  POOL_BALL_MAX: 10,
  POOL_ITEM_MAX: 15,

  // 其它派生参数
  BALL_RADIUS: 14,
  PADDLE_Y_OFFSET: 120, // 挡板距离底部的距离
} as const;
