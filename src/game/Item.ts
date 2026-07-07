import Phaser from "phaser";
import { RES_KEY } from "../config/resourceKey";
import { GAME_VALUE } from "../config/gameValue";

export enum ItemType {
  WidePaddle = "wide_paddle",
  DoubleScore = "double_score",
  MultiBall = "multi_ball",
}

const ITEM_TEXTURE: Record<ItemType, string> = {
  [ItemType.WidePaddle]: RES_KEY.ITEM_WIDE_PADDLE,
  [ItemType.DoubleScore]: RES_KEY.ITEM_DOUBLE_SCORE,
  [ItemType.MultiBall]: RES_KEY.ITEM_MULTI_BALL,
};

/**
 * 掉落道具实体（对应 GDD §6）
 * 仅金砖掉落，匀速下落，挡板触碰触发增益，超出屏幕回收对象池。
 */
export class Item extends Phaser.Physics.Arcade.Image {
  itemType: ItemType = ItemType.WidePaddle;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, RES_KEY.ITEM_WIDE_PADDLE);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.disableBody(true, true);
  }

  /** 从对象池取出，在指定位置以固定类型开始下落 */
  spawn(x: number, y: number, type: ItemType): void {
    this.itemType = type;
    this.setTexture(ITEM_TEXTURE[type]);
    this.enableBody(true, x, y, true, true);
    (this.body as Phaser.Physics.Arcade.Body).setVelocity(0, GAME_VALUE.ITEM_FALL_SPEED);
  }

  park(): void {
    this.disableBody(true, true);
  }

  static randomType(): ItemType {
    const all = [ItemType.WidePaddle, ItemType.DoubleScore, ItemType.MultiBall];
    return all[Math.floor(Math.random() * all.length)];
  }
}
