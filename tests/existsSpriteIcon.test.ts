import { existsSpriteIcon } from '../src/utils/spriteUtils';

describe('existsSpriteIcon', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetchが正しいURLで呼ばれる（.json自動付与）', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ pin: {} })
    });
    await existsSpriteIcon('https://example.com/sprite', 'pin');
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/sprite.json');
  });

  it('fetchが正しいURLで呼ばれる（.json付き）', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ pin: {} })
    });
    await existsSpriteIcon('https://example.com/sprite.json', 'pin');
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/sprite.json');
  });

  it('アイコンが存在する場合はtrueを返す', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ pin: {}, foo: {} })
    });
    const result = await existsSpriteIcon('https://example.com/sprite', 'pin');
    expect(result).toBe(true);
  });

  it('アイコンが存在しない場合はfalseを返す', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ foo: {} })
    });
    const result = await existsSpriteIcon('https://example.com/sprite', 'pin');
    expect(result).toBe(false);
  });

  it('fetchが失敗した場合はfalseを返す', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false
    });
    const result = await existsSpriteIcon('https://example.com/sprite', 'pin');
    expect(result).toBe(false);
  });

  it('例外が発生した場合もfalseを返す', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('network error'));
    const result = await existsSpriteIcon('https://example.com/sprite', 'pin');
    expect(result).toBe(false);
  });
});
