/**
 * 本地存储封装（对应 GDD §9.5、技术方案 §4.4）
 * 兼容抖音小游戏 tt.getStorageSync / tt.setStorageSync，
 * 在浏览器开发环境下降级为 localStorage。
 */

const MAX_SCORE_KEY = "pixel_brick_max_score";

interface TTStorage {
  getStorageSync: (key: string) => unknown;
  setStorageSync: (key: string, value: unknown) => void;
}

function getTT(): TTStorage | null {
  const g = globalThis as unknown as { tt?: TTStorage };
  if (g.tt && typeof g.tt.getStorageSync === "function") {
    return g.tt;
  }
  return null;
}

export const Storage = {
  getMaxScore(): number {
    try {
      const tt = getTT();
      const raw = tt ? tt.getStorageSync(MAX_SCORE_KEY) : localStorage.getItem(MAX_SCORE_KEY);
      const value = typeof raw === "number" ? raw : parseInt(String(raw ?? "0"), 10);
      return Number.isFinite(value) ? value : 0;
    } catch (e) {
      console.warn("[Storage] 读取最高分失败", e);
      return 0;
    }
  },

  setScore(score: number): number {
    const best = Math.max(score, this.getMaxScore());
    try {
      const tt = getTT();
      if (tt) {
        tt.setStorageSync(MAX_SCORE_KEY, best);
      } else {
        localStorage.setItem(MAX_SCORE_KEY, String(best));
      }
    } catch (e) {
      console.warn("[Storage] 写入最高分失败", e);
    }
    return best;
  },
};
