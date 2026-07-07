import Phaser from "phaser";
import { RES_KEY } from "../config/resourceKey";
import { GAME_VALUE } from "../config/gameValue";

/**
 * 小球实体（对应 GDD §2、数值 §2）
 * 使用对象池复用：回收时 disable，取出时 reset 位置与速度。
 */
export class Ball extends Phaser.Physics.Arcade.Image {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, RES_KEY.BALL);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCircle(GAME_VALUE.BALL_RADIUS);
    body.setBounce(1, 1);
    body.setCollideWorldBounds(true);
    // 顶部/左右反弹，底部不反弹（掉落扣血）
    body.onWorldBounds = true;
  }

  /** 从对象池取出并投入使用 */
  launch(x: number, y: number, vx: number = GAME_VALUE.BALL_SPEED_X, vy: number = GAME_VALUE.BALL_SPEED_Y): void {
    this.enableBody(true, x, y, true, true);
    (this.body as Phaser.Physics.Arcade.Body).setVelocity(vx, vy);
  }

  /** 回收：隐藏并停止物理 */
  park(): void {
    this.disableBody(true, true);
  }
}
