import { searchPlaces, type SearchResult } from '../src/utils/searchPlaces';

const mockFetch = jest.fn();

beforeAll(() => {
  global.fetch = mockFetch;
});

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  mockFetch.mockReset();
});

const makeNominatimResponse = (overrides: object[] = [{}]) =>
  overrides.map((o, i) => ({
    place_id: `place-${i}`,
    display_name: `施設名 ${i}, 東京都千代田区, 日本`,
    name: `施設名 ${i}`,
    address: {
      city: '千代田区',
      state: '東京都',
      country: '日本',
    },
    lon: `139.${700 + i}`,
    lat: `35.${680 + i}`,
    ...o,
  }));

describe('searchPlaces', () => {
  describe('正常系', () => {
    it('クエリに対して SearchResult 配列を返す', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(makeNominatimResponse([{}, {}])),
      });

      const results = await searchPlaces('東京タワー');

      expect(results).toHaveLength(2);
      const first = results[0];
      expect(first).toMatchObject<Partial<SearchResult>>({
        id: expect.any(String),
        name: expect.any(String),
        address: expect.any(String),
        lng: expect.any(Number),
        lat: expect.any(Number),
        source: 'nominatim',
      });
    });

    it('lng と lat が数値として返る', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve(makeNominatimResponse([{ lon: '139.7670', lat: '35.6804' }])),
      });

      const results = await searchPlaces('新宿');

      expect(results[0].lng).toBe(139.767);
      expect(results[0].lat).toBe(35.6804);
    });

    it('limit オプションがクエリパラメータに反映される', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await searchPlaces('渋谷', { limit: 3 });

      const url = new URL(mockFetch.mock.calls[0][0] as string);
      expect(url.searchParams.get('limit')).toBe('3');
    });

    it('デフォルト limit が適用される', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await searchPlaces('渋谷');

      const url = new URL(mockFetch.mock.calls[0][0] as string);
      expect(Number(url.searchParams.get('limit'))).toBeGreaterThan(0);
    });

    it('空結果の場合は空配列を返す（クライアントが落ちない）', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });

      const results = await searchPlaces('存在しない場所');

      expect(results).toEqual([]);
    });

    it('User-Agent ヘッダーを付与する', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await searchPlaces('test');

      const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
      expect((init.headers as Record<string, string>)['User-Agent']).toBeDefined();
    });
  });

  describe('異常系', () => {
    it('ネットワークエラーで例外をスロー', async () => {
      mockFetch.mockRejectedValue(new TypeError('Failed to fetch'));

      await expect(searchPlaces('東京')).rejects.toThrow();
    });

    it('429 レート制限でエラーをスロー', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        text: () => Promise.resolve('Too Many Requests'),
      });

      await expect(searchPlaces('東京')).rejects.toThrow(/429/);
    });

    it('500 サーバーエラーでエラーをスロー', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () => Promise.resolve('Internal Server Error'),
      });

      await expect(searchPlaces('東京')).rejects.toThrow(/500/);
    });
  });

  describe('キャンセル', () => {
    it('AbortSignal を渡すと fetch にそのまま転送する', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });

      const controller = new AbortController();
      await searchPlaces('東京', { signal: controller.signal });

      const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
      expect(init.signal).toBe(controller.signal);
    });

    it('中断済み AbortSignal でフェッチを開始すると AbortError が発生する', async () => {
      const controller = new AbortController();
      controller.abort();

      mockFetch.mockRejectedValue(new DOMException('Aborted', 'AbortError'));

      await expect(
        searchPlaces('東京', { signal: controller.signal }),
      ).rejects.toMatchObject({ name: 'AbortError' });
    });
  });
});
