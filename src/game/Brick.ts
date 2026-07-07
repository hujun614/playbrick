import Phaser from "phaser";
import { RES_KEY } from "../config/resourceKey";
import { GAME_VALUE } from "../config/gameValue";

export enum BrickType {
  Grey = "grey",
  Blue = "blue",
  Gold = "gold",
}

/**
 * 砖块实体（对应 GDD §5）
 * - 灰砖：血量1，+10
 * - 蓝砖：血量2，第一次撞击变色提示，+10
 * - 金砖：血量1，+30，100% 掉落随机道具
 */
export class Brick extends Phaser.Physics.Arcade.Image {
  readonly brickType: BrickType;
  private hp: number;

  constructor(scene: Phaser.Scene, x: number, y: number, type: BrickType) {
    super(scene, x, y, Brick.textureFor(type));
    this.brickType = type;
    this.hp = type === BrickType.Blue ? 2 : 1;

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // 静态物理体 immovable
  }

  private static textureFor(type: BrickType): string {
    switch (type) {
      case BrickType.Blue:
        return RES_KEY.BRICK_BLUE;
      case BrickType.Gold:
        return RES_KEY.BRICK_GOLD;
      default:
        return RES_KEY.BRICK_GREY;
    }
  }

  get score(): number {
    switch (this.brickType) {
      case BrickType.Gold:
        return GAME_VALUE.SCORE_GOLD;
      case BrickType.Blue:
        return GAME_VALUE.SCORE_BLUE;
      default:
        return GAME_VALUE.SCORE_GREY;
    }
  }

  /** 金砖 100% 掉落道具 */
  get dropsItem(): boolean {
    return this.brickType === BrickType.Gold;
  }

  /**
   * 承受一次撞击。
   * @returns 是否被击碎
   */
  hit(): boolean {
    this.hp -= 1;
    if (this.hp <= 0) {
      return true;
    }
    // 蓝砖第一次撞击变色提示
    if (this.brickType === BrickType.Blue) {
      this.setTexture(RES_KEY.BRICK_BLUE_HIT);
    }
    return false;
  }
}
