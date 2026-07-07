/**
 * 通用对象池（对应 GDD §9.2、技术方案 §4.2）
 * 小球、掉落道具复用实例，回收而非频繁 destroy，减少 GC 卡顿。
 */
export class ObjectPool<T> {
  private readonly free: T[] = [];
  private readonly factory: () => T;
  private readonly resetFn: (obj: T) => void;
  private readonly maxCache: number;

  constructor(factory: () => T, resetFn: (obj: T) => void, maxCache: number) {
    this.factory = factory;
    this.resetFn = resetFn;
    this.maxCache = maxCache;
  }

  /** 取出一个空闲实例，池空则新建 */
  obtain(): T {
    const obj = this.free.pop() ?? this.factory();
    return obj;
  }

  /** 回收实例；超过最大缓存则丢弃（交由 GC） */
  recycle(obj: T): void {
    this.resetFn(obj);
    if (this.free.length < this.maxCache) {
      this.free.push(obj);
    }
  }

  get freeCount(): number {
    return this.free.length;
  }
}
