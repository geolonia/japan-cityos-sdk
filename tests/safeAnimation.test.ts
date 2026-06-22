/**
 * safeEaseTo / safeFlyTo / safeJumpTo のテスト
 *
 * MapLibre GL のイベントシステムをモックし、
 * movestart ガードと AbortSignal の動作を検証する。
 */

// MapLibre Map のモック
class MockMap {
  private listeners: Map<string, Set<Function>> = new Map();
  private _isMoving = false;

  easeTo = jest.fn((_opts?: any) => { this._triggerMoveStart(); });
  flyTo = jest.fn((_opts?: any) => { this._triggerMoveStart(); });
  jumpTo = jest.fn((_opts?: any) => { this._triggerMoveStart(); });
  stop = jest.fn(() => { this._isMoving = false; });

  on(event: string, handler: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
    return this;
  }

  off(event: string, handler: Function) {
    this.listeners.get(event)?.delete(handler);
    return this;
  }

  isMoving() {
    return this._isMoving;
  }

  // テストヘルパー
  _triggerMoveStart() {
    this._isMoving = true;
    this._emit('movestart');
  }

  _triggerMoveEnd() {
    this._isMoving = false;
    this._emit('moveend');
  }

  _emit(event: string) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      // コピーして反復（ハンドラ内で off される可能性があるため）
      [...handlers].forEach(fn => fn());
    }
  }
}

// _safeAnimate のロジックを直接テストするためのヘルパー
function safeAnimate(
  map: MockMap,
  animateFn: () => void,
  opts?: { signal?: AbortSignal },
): Promise<void> {
  const signal = opts?.signal;

  return new Promise<void>((resolve, reject) => {
    let started = false;
    let done = false;

    const cleanup = () => {
      done = true;
      map.off('movestart', onMoveStart);
      map.off('moveend', onMoveEnd);
    };

    const onMoveStart = () => {
      started = true;
    };

    const onMoveEnd = () => {
      if (!started || done) return;
      if (map.isMoving()) return;
      cleanup();
      resolve();
    };

    if (signal) {
      if (signal.aborted) {
        reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
        return;
      }
      signal.addEventListener('abort', () => {
        if (done) return;
        map.stop();
        cleanup();
        reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
      }, { once: true });
    }

    map.on('movestart', onMoveStart);
    map.on('moveend', onMoveEnd);
    animateFn();
  });
}

describe('safeAnimate (movestart ガード付きアニメーション)', () => {
  let map: MockMap;

  beforeEach(() => {
    map = new MockMap();
  });

  describe('正常系', () => {
    it('movestart → moveend で正常に resolve する', async () => {
      const promise = safeAnimate(map, () => map.easeTo({} as any));

      // easeTo が movestart を発火し、テスト側で moveend を発火
      map._triggerMoveEnd();

      await expect(promise).resolves.toBeUndefined();
    });

    it('animateFn が呼ばれる', async () => {
      const fn = jest.fn(() => { map._triggerMoveStart(); });
      const promise = safeAnimate(map, fn);

      map._triggerMoveEnd();
      await promise;

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('stale moveend 対策', () => {
    it('movestart 前の moveend を無視する', async () => {
      let resolved = false;

      // animateFn が movestart を発火しないケースをシミュレート
      const promise = safeAnimate(map, () => {
        // movestart は発火しない
      });

      promise.then(() => { resolved = true; });

      // stale moveend を発火
      map._emit('moveend');

      // 少し待ってもresolveされないことを確認
      await new Promise(r => setTimeout(r, 50));
      expect(resolved).toBe(false);

      // 正しい movestart → moveend
      map._triggerMoveStart();
      map._triggerMoveEnd();

      await expect(promise).resolves.toBeUndefined();
    });
  });

  describe('連続発火対策', () => {
    it('isMoving() === true の moveend を無視する', async () => {
      let resolveCount = 0;

      const promise = safeAnimate(map, () => map.easeTo({} as any));
      promise.then(() => { resolveCount++; });

      // moveend だが isMoving() === true（map がまだ動いている）
      map._emit('moveend'); // isMoving は true のまま

      await new Promise(r => setTimeout(r, 50));
      expect(resolveCount).toBe(0);

      // 実際に停止
      map._triggerMoveEnd(); // isMoving = false にしてから moveend

      await promise;
      expect(resolveCount).toBe(1);
    });
  });

  describe('AbortSignal によるキャンセル', () => {
    it('abort で reject される', async () => {
      const controller = new AbortController();

      const promise = safeAnimate(
        map,
        () => map.easeTo({} as any),
        { signal: controller.signal },
      );

      controller.abort();

      await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
      expect(map.stop).toHaveBeenCalled();
    });

    it('すでに abort 済みの signal で即座に reject される', async () => {
      const controller = new AbortController();
      controller.abort();

      const promise = safeAnimate(
        map,
        () => map.easeTo({} as any),
        { signal: controller.signal },
      );

      await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
    });

    it('resolve 後の abort は無視される', async () => {
      const controller = new AbortController();

      const promise = safeAnimate(
        map,
        () => map.easeTo({} as any),
        { signal: controller.signal },
      );

      map._triggerMoveEnd();
      await promise;

      // resolve 後に abort しても問題ない
      controller.abort();
      // エラーが投げられないことを確認（暗黙的に成功）
    });
  });

  describe('クリーンアップ', () => {
    it('resolve 後にリスナーが解除される', async () => {
      const promise = safeAnimate(map, () => map.easeTo({} as any));

      map._triggerMoveEnd();
      await promise;

      // movestart / moveend のリスナーが空であることを確認
      const moveStartListeners = (map as any).listeners.get('movestart');
      const moveEndListeners = (map as any).listeners.get('moveend');
      expect(moveStartListeners?.size ?? 0).toBe(0);
      expect(moveEndListeners?.size ?? 0).toBe(0);
    });

    it('abort 後にリスナーが解除される', async () => {
      const controller = new AbortController();

      const promise = safeAnimate(
        map,
        () => map.easeTo({} as any),
        { signal: controller.signal },
      );

      controller.abort();

      try { await promise; } catch { /* expected */ }

      const moveStartListeners = (map as any).listeners.get('movestart');
      const moveEndListeners = (map as any).listeners.get('moveend');
      expect(moveStartListeners?.size ?? 0).toBe(0);
      expect(moveEndListeners?.size ?? 0).toBe(0);
    });
  });
});
