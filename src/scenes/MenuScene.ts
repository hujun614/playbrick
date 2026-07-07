import Phaser from "phaser";
import { SCENE_KEY } from "../config/resourceKey";
import { GAME_VALUE } from "../config/gameValue";
import { SceneManager } from "../core/SceneManager";
import { Storage } from "../core/Storage";

/**
 * Menu 主菜单场景（对应 GDD §7 场景2）
 * 像素标题、开始按钮、历史最高分展示、静音开关。
 */
export class MenuScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEY.MENU);
  }

  create(): void {
    const cx = GAME_VALUE.WIDTH / 2;

    this.add
      .text(cx, 320, "像素砖块冲击", {
        fontFamily: "monospace",
        fontSize: "72px",
        color: "#39d0ff",
        stroke: "#0a0a14",
        strokeThickness: 8,
      })
      .setOrigin(0.5);

    this.add
      .text(cx, 430, "PIXEL BRICK IMPACT", { fontFamily: "monospace", fontSize: "28px", color: "#8affc1" })
      .setOrigin(0.5);

    this.add
      .text(cx, 560, `历史最高分：${Storage.getMaxScore()}`, {
        fontFamily: "monospace",
        fontSize: "36px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // 开始游戏按钮
    const startBtn = this.add
      .text(cx, 760, "▶ 开始游戏", {
        fontFamily: "monospace",
        fontSize: "48px",
        color: "#ffffff",
        backgroundColor: "#2b2b3d",
        padding: { x: 40, y: 20 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    startBtn.on("pointerover", () => startBtn.setColor("#ffd54a"));
    startBtn.on("pointerout", () => startBtn.setColor("#ffffff"));
    startBtn.on("pointerdown", () => SceneManager.goGame(this));

    // 静音开关
    const soundBtn = this.add
      .text(cx, 900, this.sound.mute ? "🔇 静音：开" : "🔊 静音：关", {
        fontFamily: "monospace",
        fontSize: "32px",
        color: "#cccccc",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    soundBtn.on("pointerdown", () => {
      this.sound.mute = !this.sound.mute;
      soundBtn.setText(this.sound.mute ? "🔇 静音：开" : "🔊 静音：关");
    });

    this.add
      .text(cx, 1120, "PC：← → 移动挡板 / 手机：滑动屏幕", {
        fontFamily: "monospace",
        fontSize: "24px",
        color: "#888899",
      })
      .setOrigin(0.5);
  }
}
