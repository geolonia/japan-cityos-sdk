import { getSpriteIconStyles } from '../src/utils/spriteUtils';

// getSpriteIconStyles関数のテスト
// fetchをモックしてさまざまな引数パターンで返り値を検証する

describe('getSpriteIconStyles', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // 正常なスプライトシートURL（拡張子なし）
  it('正常なURL（拡張子なし）でスタイル配列を返す', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        pin: { width: 24, height: 24, x: 0, y: 0 },
        foo: { width: 32, height: 32, x: 10, y: 10 }
      })
    });
    const url = 'https://example.com/sprite';
    const styles = await getSpriteIconStyles(url);
    expect(Array.isArray(styles)).toBe(true);
    expect(styles.length).toBe(2);
    expect(styles[0]).toMatchObject({
      width: '24px',
      height: '24px',
      backgroundImage: `url('https://example.com/sprite.png')`,
      backgroundPosition: '-0px -0px'
    });
    expect(styles[1]).toMatchObject({
      width: '32px',
      height: '32px',
      backgroundImage: `url('https://example.com/sprite.png')`,
      backgroundPosition: '-10px -10px'
    });
  });

  // 正常なスプライトシートURL（.json付き）
  it('正常なURL（.json付き）でスタイル配列を返す', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ bar: { width: 16, height: 16, x: 5, y: 5 } })
    });
    const url = 'https://example.com/sprite.json';
    const styles = await getSpriteIconStyles(url);
    expect(Array.isArray(styles)).toBe(true);
    expect(styles.length).toBe(1);
    expect(styles[0]).toMatchObject({
      width: '16px',
      height: '16px',
      backgroundImage: `url('https://example.com/sprite.png')`,
      backgroundPosition: '-5px -5px'
    });
  });

  // 存在しないURL
  it('存在しないURLの場合は空配列を返す', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
    const url = 'https://example.com/invalid-sprite';
    const styles = await getSpriteIconStyles(url);
    expect(Array.isArray(styles)).toBe(true);
    expect(styles.length).toBe(0);
  });

  // 空文字
  it('空文字の場合は空配列を返す', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
    const url = '';
    const styles = await getSpriteIconStyles(url);
    expect(Array.isArray(styles)).toBe(true);
    expect(styles.length).toBe(0);
  });

  // null
  it('nullの場合は空配列を返す', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
    const styles = await getSpriteIconStyles(null as any);
    expect(Array.isArray(styles)).toBe(true);
    expect(styles.length).toBe(0);
  });

  // undefined
  it('undefinedの場合は空配列を返す', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
    const styles = await getSpriteIconStyles(undefined as any);
    expect(Array.isArray(styles)).toBe(true);
    expect(styles.length).toBe(0);
  });

  // fetchで例外が発生した場合
  it('fetchで例外が発生した場合も空配列を返す', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('network error'));
    const styles = await getSpriteIconStyles('https://example.com/sprite');
    expect(Array.isArray(styles)).toBe(true);
    expect(styles.length).toBe(0);
  });
});
