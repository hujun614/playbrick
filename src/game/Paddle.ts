import Phaser from "phaser";
import { RES_KEY } from "../config/resourceKey";
import { GAME_VALUE } from "../config/gameValue";

/**
 * 挡板实体（对应 GDD §3 操作控制）
 * - PC：左右方向键移动
 * - 移动端：全屏触摸滑动，挡板 X 跟随触摸点并左右限位
 * - 宽挡板道具：宽度 +50%，限时恢复
 */
export class Paddle extends Phaser.Physics.Arcade.Image {
  private wideTimer?: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, RES_KEY.PADDLE_NORMAL);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setImmovable(true);
    body.setAllowGravity(false);
    body.setCollideWorldBounds(true);
  }

  /** 键盘控制：设置水平速度 */
  moveByKeyboard(dir: -1 | 0 | 1): void {
    (this.body as Phaser.Physics.Arcade.Body).setVelocityX(dir * GAME_VALUE.PADDLE_SPEED_KEYBOARD);
  }

  /** 触摸/指针控制：X 跟随并限位 */
  moveToPointer(pointerX: number): void {
    (this.body as Phaser.Physics.Arcade.Body).setVelocityX(0);
    const half = this.displayWidth / 2;
    const clamped = Phaser.Math.Clamp(pointerX, half, GAME_VALUE.WIDTH - half);
    this.x = clamped;
  }

  /** 触发宽挡板增益（限时） */
  applyWide(scene: Phaser.Scene): void {
    this.setTexture(RES_KEY.PADDLE_WIDE);
    this.setDisplaySize(GAME_VALUE.PADDLE_WIDTH_WIDE, GAME_VALUE.PADDLE_HEIGHT);
    (this.body as Phaser.Physics.Arcade.Body).setSize(GAME_VALUE.PADDLE_WIDTH_WIDE, GAME_VALUE.PADDLE_HEIGHT);

    this.wideTimer?.remove();
    this.wideTimer = scene.time.delayedCall(GAME_VALUE.WIDE_PADDLE_DURATION * 1000, () => {
      this.resetWidth();
    });
  }

  private resetWidth(): void {
    this.setTexture(RES_KEY.PADDLE_NORMAL);
    this.setDisplaySize(GAME_VALUE.PADDLE_WIDTH, GAME_VALUE.PADDLE_HEIGHT);
    (this.body as Phaser.Physics.Arcade.Body).setSize(GAME_VALUE.PADDLE_WIDTH, GAME_VALUE.PADDLE_HEIGHT);
  }
}
