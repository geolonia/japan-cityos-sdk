import {
  getPrefectureAnchor,
  buildPrefectureLineFeature,
  buildPrefectureLineLayerName,
  buildPrefectureLine,
  PREFECTURE_ANCHOR_CENTER,
  PREFECTURE_ANCHOR_CAPITAL,
} from '../src/utils/prefectureUtils';

// @geolonia/normalize-japanese-addresses のモック
jest.mock('@geolonia/normalize-japanese-addresses', () => ({
  normalize: jest.fn(),
}));

import { normalize } from '@geolonia/normalize-japanese-addresses';
const mockNormalize = normalize as jest.MockedFunction<typeof normalize>;

describe('getPrefectureAnchor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('中心座標（デフォルト）を返す', async () => {
    mockNormalize.mockResolvedValueOnce({
      pref: '東京都',
      city: '',
      town: '',
      addr: '',
      lat: 35.6762,
      lng: 139.6503,
      level: 1,
      point: { lat: 35.6762, lng: 139.6503 },
    } as any);

    const result = await getPrefectureAnchor('東京都');
    expect(result).not.toBeNull();
    expect(result![0]).toBeCloseTo(139.6503, 3);
    expect(result![1]).toBeCloseTo(35.6762, 3);
  });

  it('県庁所在地の座標を返す', async () => {
    // 最初の呼び出し（都道府県名の正規化）
    mockNormalize.mockResolvedValueOnce({
      pref: '大阪府',
      city: '',
      town: '',
      addr: '',
      lat: 34.6937,
      lng: 135.5023,
      level: 1,
      point: { lat: 34.6937, lng: 135.5023 },
    } as any);
    // 2回目の呼び出し（県庁所在地）
    mockNormalize.mockResolvedValueOnce({
      pref: '大阪府',
      city: '大阪市',
      town: '',
      addr: '',
      lat: 34.6937,
      lng: 135.5023,
      level: 2,
      point: { lat: 34.6937, lng: 135.5023 },
    } as any);

    const result = await getPrefectureAnchor('大阪府', PREFECTURE_ANCHOR_CAPITAL);
    expect(result).not.toBeNull();
    expect(result![0]).toBeCloseTo(135.5023, 3);
    expect(result![1]).toBeCloseTo(34.6937, 3);
  });

  it('存在しない都道府県名の場合は null を返す', async () => {
    mockNormalize.mockResolvedValueOnce({
      pref: '',
      city: '',
      town: '',
      addr: '',
      lat: null,
      lng: null,
      level: 0,
    } as any);

    const result = await getPrefectureAnchor('存在しない県');
    expect(result).toBeNull();
  });

  it('normalize がエラーを投げた場合は null を返す', async () => {
    mockNormalize.mockRejectedValueOnce(new Error('Network error'));

    const result = await getPrefectureAnchor('東京都');
    expect(result).toBeNull();
  });

  it('東京都の場合 capital アンカーで「東京」を使用する', async () => {
    mockNormalize.mockResolvedValueOnce({
      pref: '東京都',
      city: '',
      town: '',
      addr: '',
      lat: 35.6762,
      lng: 139.6503,
      level: 1,
      point: { lat: 35.6762, lng: 139.6503 },
    } as any);
    mockNormalize.mockResolvedValueOnce({
      pref: '東京都',
      city: '東京',
      town: '',
      addr: '',
      lat: 35.6895,
      lng: 139.6917,
      level: 2,
      point: { lat: 35.6895, lng: 139.6917 },
    } as any);

    await getPrefectureAnchor('東京都', PREFECTURE_ANCHOR_CAPITAL);
    expect(mockNormalize).toHaveBeenCalledTimes(2);
    expect(mockNormalize).toHaveBeenCalledWith('東京都東京');
  });
});

describe('buildPrefectureLineFeature', () => {
  it('2地点から LineString FeatureCollection を生成する', () => {
    const from: [number, number] = [139.6503, 35.6762];
    const to: [number, number] = [135.5023, 34.6937];
    const result = buildPrefectureLineFeature(from, to);

    expect(result.type).toBe('FeatureCollection');
    expect(result.features).toHaveLength(1);
    expect(result.features[0].geometry.type).toBe('LineString');
    expect(result.features[0].geometry.coordinates).toEqual([from, to]);
    expect(result.features[0].properties).toEqual({});
  });

  it('properties を指定できる', () => {
    const from: [number, number] = [139.6503, 35.6762];
    const to: [number, number] = [135.5023, 34.6937];
    const result = buildPrefectureLineFeature(from, to, { color: 'red' });

    expect(result.features[0].properties).toEqual({ color: 'red' });
  });
});

describe('buildPrefectureLineLayerName', () => {
  it('安定なレイヤー名を生成する', () => {
    const name = buildPrefectureLineLayerName('東京都', PREFECTURE_ANCHOR_CENTER, '大阪府', PREFECTURE_ANCHOR_CAPITAL);
    expect(name).toBe('line-東京-center-大阪-capital');
  });

  it('同じ引数で同じレイヤー名を返す（冪等性）', () => {
    const name1 = buildPrefectureLineLayerName('北海道', PREFECTURE_ANCHOR_CENTER, '沖縄県', PREFECTURE_ANCHOR_CENTER);
    const name2 = buildPrefectureLineLayerName('北海道', PREFECTURE_ANCHOR_CENTER, '沖縄県', PREFECTURE_ANCHOR_CENTER);
    expect(name1).toBe(name2);
  });

  it('異なる引数で異なるレイヤー名を返す', () => {
    const name1 = buildPrefectureLineLayerName('東京都', PREFECTURE_ANCHOR_CENTER, '大阪府', PREFECTURE_ANCHOR_CENTER);
    const name2 = buildPrefectureLineLayerName('東京都', PREFECTURE_ANCHOR_CENTER, '大阪府', PREFECTURE_ANCHOR_CAPITAL);
    expect(name1).not.toBe(name2);
  });
});

describe('buildPrefectureLine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('2つの都道府県間の LineString と layerName を返す', async () => {
    mockNormalize
      .mockResolvedValueOnce({
        pref: '東京都',
        point: { lat: 35.6762, lng: 139.6503 },
      } as any)
      .mockResolvedValueOnce({
        pref: '大阪府',
        point: { lat: 34.6937, lng: 135.5023 },
      } as any);

    const result = await buildPrefectureLine('東京都', PREFECTURE_ANCHOR_CENTER, '大阪府', PREFECTURE_ANCHOR_CENTER);
    expect(result).not.toBeNull();
    expect(result!.geojson.type).toBe('FeatureCollection');
    expect(result!.geojson.features[0].geometry.type).toBe('LineString');
    expect(result!.layerName).toBe('line-東京-center-大阪-center');
  });

  it('座標取得に失敗した場合は null を返す', async () => {
    mockNormalize.mockResolvedValueOnce({
      pref: '',
    } as any);

    const result = await buildPrefectureLine('不明', PREFECTURE_ANCHOR_CENTER, '大阪府', PREFECTURE_ANCHOR_CENTER);
    expect(result).toBeNull();
  });
});
