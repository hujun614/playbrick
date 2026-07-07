import Phaser from "phaser";
import { SCENE_KEY, RES_KEY } from "../config/resourceKey";
import { GAME_VALUE } from "../config/gameValue";
import { TextureFactory } from "../core/TextureFactory";
import { SceneManager } from "../core/SceneManager";

/**
 * Boot 加载场景（对应 GDD §7 场景1）
 * 统一生成/预加载全部纹理资源，展示进度，异常捕获后跳转主菜单。
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEY.BOOT);
  }

  create(): void {
    const cx = GAME_VALUE.WIDTH / 2;
    const cy = GAME_VALUE.HEIGHT / 2;

    const tip = this.add
      .text(cx, cy, "资源加载中...", { fontFamily: "monospace", fontSize: "40px", color: "#ffffff" })
      .setOrigin(0.5);

    try {
      TextureFactory.generateAll(this);
      // 校验关键资源是否成功注册，缺失则打印 Key 便于定位（对应 §3.3 加载规则）
      const missing = Object.values(RES_KEY).filter((key) => !this.textures.exists(key));
      if (missing.length > 0) {
        console.error("[Boot] 资源缺失: ", missing.join(", "));
        tip.setText("资源缺失，请查看控制台");
        return;
      }
      console.info("[Boot] 全部纹理生成完成，共", Object.values(RES_KEY).length, "个");
      tip.setText("加载完成");
    } catch (e) {
      console.error("[Boot] 资源生成失败", e);
      tip.setText("资源加载失败");
      return;
    }

    // 加载完成自动跳转菜单
    this.time.delayedCall(300, () => SceneManager.goMenu(this));
  }
}
