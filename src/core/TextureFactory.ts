import Phaser from "phaser";
import { RES_KEY } from "../config/resourceKey";
import { GAME_VALUE } from "../config/gameValue";

/**
 * 纹理工厂（对应 GDD 核心学习目标 #1：完全代码化生成精灵）
 * 在 Boot 场景一次性生成全部像素风纹理并注册到 TextureManager，
 * 后续所有游戏物体仅通过 RES_KEY 常量引用，无磁盘图片、无空引用。
 */
export class TextureFactory {
  /** 生成并注册全部纹理；重复调用安全（已存在则跳过） */
  static generateAll(scene: Phaser.Scene): void {
    this.rect(scene, RES_KEY.PADDLE_NORMAL, GAME_VALUE.PADDLE_WIDTH, GAME_VALUE.PADDLE_HEIGHT, 0x39d0ff, 0xffffff);
    this.rect(scene, RES_KEY.PADDLE_WIDE, GAME_VALUE.PADDLE_WIDTH_WIDE, GAME_VALUE.PADDLE_HEIGHT, 0x8affc1, 0xffffff);

    this.circle(scene, RES_KEY.BALL, GAME_VALUE.BALL_RADIUS, 0xffffff);

    this.brick(scene, RES_KEY.BRICK_GREY, 0x8d8d99, 0x5a5a66);
    this.brick(scene, RES_KEY.BRICK_BLUE, 0x3f78e0, 0x2a4fa0);
    this.brick(scene, RES_KEY.BRICK_BLUE_HIT, 0x86a9f0, 0x2a4fa0);
    this.brick(scene, RES_KEY.BRICK_GOLD, 0xf6c945, 0xb8901c);

    this.itemIcon(scene, RES_KEY.ITEM_WIDE_PADDLE, 0x8affc1);
    this.itemIcon(scene, RES_KEY.ITEM_DOUBLE_SCORE, 0xffd54a);
    this.itemIcon(scene, RES_KEY.ITEM_MULTI_BALL, 0xff7ac6);

    this.heart(scene, RES_KEY.HEART);
    this.rect(scene, RES_KEY.BUTTON, 320, 96, 0x2b2b3d, 0x6c6cff);
  }

  private static rect(
    scene: Phaser.Scene,
    key: string,
    w: number,
    h: number,
    fill: number,
    stroke: number,
  ): void {
    if (scene.textures.exists(key)) return;
    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(fill, 1);
    g.fillRoundedRect(0, 0, w, h, 8);
    g.lineStyle(3, stroke, 1);
    g.strokeRoundedRect(1.5, 1.5, w - 3, h - 3, 8);
    g.generateTexture(key, w, h);
    g.destroy();
  }

  private static brick(scene: Phaser.Scene, key: string, fill: number, stroke: number): void {
    this.rect(scene, key, GAME_VALUE.BRICK_WIDTH, GAME_VALUE.BRICK_HEIGHT, fill, stroke);
  }

  private static circle(scene: Phaser.Scene, key: string, radius: number, fill: number): void {
    if (scene.textures.exists(key)) return;
    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(fill, 1);
    g.fillCircle(radius, radius, radius);
    g.generateTexture(key, radius * 2, radius * 2);
    g.destroy();
  }

  private static itemIcon(scene: Phaser.Scene, key: string, color: number): void {
    if (scene.textures.exists(key)) return;
    const size = 48;
    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(color, 1);
    g.fillRoundedRect(0, 0, size, size, 10);
    g.lineStyle(3, 0xffffff, 0.9);
    g.strokeRoundedRect(2, 2, size - 4, size - 4, 10);
    g.generateTexture(key, size, size);
    g.destroy();
  }

  private static heart(scene: Phaser.Scene, key: string): void {
    if (scene.textures.exists(key)) return;
    const size = 40;
    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(0xff5a7a, 1);
    // 用两个圆 + 一个三角拼出爱心像素感
    g.fillCircle(12, 14, 10);
    g.fillCircle(28, 14, 10);
    g.fillTriangle(2, 18, 38, 18, 20, 38);
    g.generateTexture(key, size, size);
    g.destroy();
  }
}
