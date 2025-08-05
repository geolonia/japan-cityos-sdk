import { getSpriteIconNames } from '../src/utils/spriteUtils';

describe('getSpriteIconNames', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetchが正しいURLで呼ばれる（.json自動付与）', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ pin: {}, foo: {} })
    });
    await getSpriteIconNames('https://example.com/sprite');
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/sprite.json');
  });

  it('fetchが正しいURLで呼ばれる（.json付き）', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ pin: {}, foo: {} })
    });
    await getSpriteIconNames('https://example.com/sprite.json');
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/sprite.json');
  });

  it('アイコン名一覧を返す', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ pin: {}, foo: {}, bar: {} })
    });
    const result = await getSpriteIconNames('https://example.com/sprite');
    expect(result).toEqual(['pin', 'foo', 'bar']);
  });

  it('fetchが失敗した場合は空配列を返す', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false
    });
    const result = await getSpriteIconNames('https://example.com/sprite');
    expect(result).toEqual([]);
  });

  it('例外が発生した場合も空配列を返す', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('network error'));
    const result = await getSpriteIconNames('https://example.com/sprite');
    expect(result).toEqual([]);
  });
});
