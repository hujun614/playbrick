import Phaser from "phaser";
import { SCENE_KEY } from "../config/resourceKey";
import { GAME_VALUE } from "../config/gameValue";
import { Storage } from "../core/Storage";

interface ResultData {
  win: boolean;
  score: number;
}

/**
 * Result 结算场景（对应 GDD §7 场景4，胜负复用）
 * 半透明遮罩、本局得分 vs 历史最高分、再来一局 / 返回菜单。
 */
export class ResultScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEY.RESULT);
  }

  create(data: ResultData): void {
    const cx = GAME_VALUE.WIDTH / 2;
    const best = Storage.setScore(data.score);

    this.add.rectangle(cx, GAME_VALUE.HEIGHT / 2, GAME_VALUE.WIDTH, GAME_VALUE.HEIGHT, 0x000000, 0.7);

    this.add
      .text(cx, 420, data.win ? "胜利！" : "游戏结束", {
        fontFamily: "monospace",
        fontSize: "80px",
        color: data.win ? "#8affc1" : "#ff7a7a",
        stroke: "#0a0a14",
        strokeThickness: 8,
      })
      .setOrigin(0.5);

    this.add
      .text(cx, 560, `本局得分：${data.score}`, { fontFamily: "monospace", fontSize: "42px", color: "#ffffff" })
      .setOrigin(0.5);

    this.add
      .text(cx, 630, `历史最高：${best}`, { fontFamily: "monospace", fontSize: "36px", color: "#ffd54a" })
      .setOrigin(0.5);

    this.makeButton(cx, 800, "再来一局", () => {
      this.scene.stop(SCENE_KEY.GAME);
      this.scene.start(SCENE_KEY.GAME);
    });

    this.makeButton(cx, 940, "返回菜单", () => {
      this.scene.stop(SCENE_KEY.GAME);
      this.scene.start(SCENE_KEY.MENU);
    });
  }

  private makeButton(x: number, y: number, label: string, onClick: () => void): void {
    const btn = this.add
      .text(x, y, label, {
        fontFamily: "monospace",
        fontSize: "44px",
        color: "#ffffff",
        backgroundColor: "#2b2b3d",
        padding: { x: 40, y: 18 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => btn.setColor("#ffd54a"));
    btn.on("pointerout", () => btn.setColor("#ffffff"));
    btn.on("pointerdown", onClick);
  }
}
