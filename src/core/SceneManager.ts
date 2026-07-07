import Phaser from "phaser";
import { SCENE_KEY } from "../config/resourceKey";

/**
 * 场景跳转统一工具（对应 GDD §9.3 全局统一跳转工具函数）
 * 所有场景切换通过此处，避免各场景之间硬编码 key 造成耦合。
 */
export const SceneManager = {
  goMenu(scene: Phaser.Scene): void {
    scene.scene.start(SCENE_KEY.MENU);
  },
  goGame(scene: Phaser.Scene): void {
    scene.scene.start(SCENE_KEY.GAME);
  },
  /** 结算场景以覆盖方式启动，暂停底层游戏物理 */
  goResult(scene: Phaser.Scene, data: { win: boolean; score: number }): void {
    scene.scene.launch(SCENE_KEY.RESULT, data);
    scene.scene.pause();
  },
};
