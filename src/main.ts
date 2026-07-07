import Phaser from "phaser";
import { GAME_VALUE } from "./config/gameValue";
import { BootScene } from "./scenes/BootScene";
import { MenuScene } from "./scenes/MenuScene";
import { GameScene } from "./scenes/GameScene";
import { ResultScene } from "./scenes/ResultScene";

/**
 * 游戏入口（对应 技术方案 §2 目录规范 main.ts）
 * 竖屏 720×1280，Arcade 物理，四大场景解耦注册。
 */
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game-root",
  width: GAME_VALUE.WIDTH,
  height: GAME_VALUE.HEIGHT,
  backgroundColor: "#101018",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, MenuScene, GameScene, ResultScene],
};

new Phaser.Game(config);
