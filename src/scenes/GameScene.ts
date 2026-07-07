import Phaser from "phaser";
import { SCENE_KEY, RES_KEY } from "../config/resourceKey";
import { GAME_VALUE } from "../config/gameValue";
import { SceneManager } from "../core/SceneManager";
import { ObjectPool } from "../core/ObjectPool";
import { Paddle } from "../game/Paddle";
import { Ball } from "../game/Ball";
import { Brick, BrickType } from "../game/Brick";
import { Item, ItemType } from "../game/Item";

/**
 * Game 主游戏场景（对应 GDD §2 主循环、§5/§6 系统）
 * 全部游戏物体代码生成；物理碰撞分层：砖块组 / 小球组 / 道具组 / 挡板。
 */
export class GameScene extends Phaser.Scene {
  private paddle!: Paddle;
  private bricks!: Phaser.Physics.Arcade.StaticGroup;
  private balls!: Phaser.Physics.Arcade.Group;
  private items!: Phaser.Physics.Arcade.Group;

  private ballPool!: ObjectPool<Ball>;
  private itemPool!: ObjectPool<Item>;

  private score = 0;
  private life = GAME_VALUE.INIT_LIFE;
  private remainingBricks = 0;
  private gameOver = false;

  private doubleScoreUntil = 0;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private scoreText!: Phaser.GameObjects.Text;
  private hearts: Phaser.GameObjects.Image[] = [];
  private buffText!: Phaser.GameObjects.Text;

  constructor() {
    super(SCENE_KEY.GAME);
  }

  create(): void {
    this.resetState();

    // 底部不反弹（掉落扣血），其余三边反弹
    this.physics.world.setBoundsCollision(true, true, true, false);

    this.bricks = this.physics.add.staticGroup();
    this.balls = this.physics.add.group();
    this.items = this.physics.add.group();

    this.ballPool = new ObjectPool<Ball>(
      () => new Ball(this, 0, 0),
      (b) => b.park(),
      GAME_VALUE.POOL_BALL_MAX,
    );
    this.itemPool = new ObjectPool<Item>(
      () => new Item(this),
      (i) => i.park(),
      GAME_VALUE.POOL_ITEM_MAX,
    );

    this.createBricks();
    this.createPaddle();
    this.spawnBall(GAME_VALUE.WIDTH / 2, this.paddle.y - 60);

    this.setupColliders();
    this.setupInput();
    this.createHud();
  }

  private resetState(): void {
    this.score = 0;
    this.life = GAME_VALUE.INIT_LIFE;
    this.remainingBricks = 0;
    this.gameOver = false;
    this.doubleScoreUntil = 0;
    this.hearts = [];
  }

  private createBricks(): void {
    const totalW = GAME_VALUE.BRICK_COLS * GAME_VALUE.BRICK_WIDTH + (GAME_VALUE.BRICK_COLS - 1) * GAME_VALUE.BRICK_GAP_X;
    const startX = (GAME_VALUE.WIDTH - totalW) / 2 + GAME_VALUE.BRICK_WIDTH / 2;

    for (let row = 0; row < GAME_VALUE.BRICK_ROWS; row++) {
      for (let col = 0; col < GAME_VALUE.BRICK_COLS; col++) {
        const x = startX + col * (GAME_VALUE.BRICK_WIDTH + GAME_VALUE.BRICK_GAP_X);
        const y = GAME_VALUE.BRICK_START_Y + row * (GAME_VALUE.BRICK_HEIGHT + GAME_VALUE.BRICK_GAP_Y);
        const type = this.pickBrickType(row);
        const brick = new Brick(this, x, y, type);
        this.bricks.add(brick);
        this.remainingBricks++;
      }
    }
  }

  /** 顶部行更硬/更贵，底部普通砖，金砖随机点缀 */
  private pickBrickType(row: number): BrickType {
    if (Math.random() < 0.12) return BrickType.Gold;
    if (row === 0) return BrickType.Blue;
    return BrickType.Grey;
  }

  private createPaddle(): void {
    const y = GAME_VALUE.HEIGHT - GAME_VALUE.PADDLE_Y_OFFSET;
    this.paddle = new Paddle(this, GAME_VALUE.WIDTH / 2, y);
  }

  private spawnBall(x: number, y: number, vx: number = GAME_VALUE.BALL_SPEED_X, vy: number = GAME_VALUE.BALL_SPEED_Y): void {
    const ball = this.ballPool.obtain();
    this.balls.add(ball);
    ball.launch(x, y, vx, vy);
  }

  private setupColliders(): void {
    this.physics.add.collider(this.balls, this.bricks, this.onBallBrick, undefined, this);
    this.physics.add.collider(this.balls, this.paddle, this.onBallPaddle, undefined, this);
    this.physics.add.overlap(this.items, this.paddle, this.onItemPaddle, undefined, this);
  }

  private onBallBrick: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (_ball, brickObj) => {
    const brick = brickObj as Brick;
    const destroyed = brick.hit();
    if (!destroyed) return;

    this.addScore(brick.score);
    if (brick.dropsItem) {
      this.dropItem(brick.x, brick.y);
    }
    brick.destroy();
    this.remainingBricks--;
    if (this.remainingBricks <= 0) {
      this.endGame(true);
    }
  };

  private onBallPaddle: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (ballObj, paddleObj) => {
    const ball = ballObj as Ball;
    const paddle = paddleObj as Paddle;
    const body = ball.body as Phaser.Physics.Arcade.Body;
    // 依据击打挡板的相对位置调整反弹角度，手感更自然
    const diff = ball.x - paddle.x;
    const speed = Math.max(body.velocity.length(), 300);
    const angle = Phaser.Math.Clamp(diff / (paddle.displayWidth / 2), -1, 1) * (Math.PI / 3);
    body.setVelocity(Math.sin(angle) * speed, -Math.abs(Math.cos(angle) * speed));
  };

  private onItemPaddle: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (itemObj) => {
    const item = itemObj as Item;
    this.applyItem(item.itemType);
    this.items.remove(item);
    this.itemPool.recycle(item);
  };

  private dropItem(x: number, y: number): void {
    const item = this.itemPool.obtain();
    this.items.add(item);
    item.spawn(x, y, Item.randomType());
  }

  private applyItem(type: ItemType): void {
    switch (type) {
      case ItemType.WidePaddle:
        this.paddle.applyWide(this);
        break;
      case ItemType.DoubleScore:
        this.doubleScoreUntil = this.time.now + GAME_VALUE.DOUBLE_SCORE_DURATION * 1000;
        break;
      case ItemType.MultiBall: {
        const source = this.balls.getFirstAlive() as Ball | null;
        const bx = source ? source.x : GAME_VALUE.WIDTH / 2;
        const by = source ? source.y : this.paddle.y - 60;
        for (let i = 0; i < GAME_VALUE.MULTI_BALL_EXTRA; i++) {
          const dir = i === 0 ? -1 : 1;
          this.spawnBall(bx, by, GAME_VALUE.BALL_SPEED_X * dir, GAME_VALUE.BALL_SPEED_Y);
        }
        break;
      }
    }
  }

  private addScore(base: number): void {
    const mult = this.time.now < this.doubleScoreUntil ? GAME_VALUE.DOUBLE_SCORE_RATE : 1;
    this.score += base * mult;
    this.scoreText.setText(`分数：${this.score}`);
  }

  private setupInput(): void {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown && !this.gameOver) {
        this.paddle.moveToPointer(pointer.x);
      }
    });
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (!this.gameOver) this.paddle.moveToPointer(pointer.x);
    });
  }

  private createHud(): void {
    this.scoreText = this.add
      .text(24, 24, `分数：${this.score}`, { fontFamily: "monospace", fontSize: "36px", color: "#ffffff" })
      .setDepth(10);

    for (let i = 0; i < this.life; i++) {
      const heart = this.add.image(40 + i * 50, 90, RES_KEY.HEART).setDepth(10);
      this.hearts.push(heart);
    }

    this.buffText = this.add
      .text(GAME_VALUE.WIDTH - 24, 24, "", {
        fontFamily: "monospace",
        fontSize: "28px",
        color: "#ffd54a",
        align: "right",
      })
      .setOrigin(1, 0)
      .setDepth(10);
  }

  private updateHearts(): void {
    this.hearts.forEach((h, i) => h.setVisible(i < this.life));
  }

  private loseLife(): void {
    this.life--;
    this.updateHearts();
    if (this.life <= 0) {
      this.endGame(false);
    }
  }

  private endGame(win: boolean): void {
    if (this.gameOver) return;
    this.gameOver = true;
    this.physics.pause();
    SceneManager.goResult(this, { win, score: this.score });
  }

  update(): void {
    if (this.gameOver) return;

    // 键盘控制优先
    if (this.cursors.left.isDown) {
      this.paddle.moveByKeyboard(-1);
    } else if (this.cursors.right.isDown) {
      this.paddle.moveByKeyboard(1);
    } else if (!this.input.activePointer.isDown) {
      this.paddle.moveByKeyboard(0);
    }

    // 小球掉出底部：回收对象池并扣血
    (this.balls.getChildren() as Ball[]).forEach((ball) => {
      if (ball.active && ball.y > GAME_VALUE.HEIGHT + GAME_VALUE.BALL_RADIUS) {
        this.balls.remove(ball);
        this.ballPool.recycle(ball);
        // 多球时仅当场上没有球才扣血；确保掉落仅扣 1 点
        if (this.balls.countActive(true) === 0 && !this.gameOver) {
          this.loseLife();
          if (!this.gameOver) {
            this.spawnBall(this.paddle.x, this.paddle.y - 60);
          }
        }
      }
    });

    // 道具超出底部回收
    (this.items.getChildren() as Item[]).forEach((item) => {
      if (item.active && item.y > GAME_VALUE.HEIGHT + 48) {
        this.items.remove(item);
        this.itemPool.recycle(item);
      }
    });

    // 增益倒计时 UI
    const remain = Math.max(0, Math.ceil((this.doubleScoreUntil - this.time.now) / 1000));
    this.buffText.setText(remain > 0 ? `双倍得分：${remain}s` : "");
  }
}
