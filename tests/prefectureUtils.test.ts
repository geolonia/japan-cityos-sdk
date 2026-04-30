/**
 * prefectureUtils.ts のユニットテスト
 */

import {
  getPrefectureAnchor,
  buildPrefectureLineFeature,
  buildPrefectureLineLayerName,
  buildPrefectureLine,
  PREFECTURE_ANCHOR_CENTER,
  PREFECTURE_ANCHOR_CAPITAL,
} from '../src/utils/prefectureUtils';

// @geolonia/normalize-japanese-addresses をモック
jest.mock('@geolonia/normalize-japanese-addresses', () => ({
  normalize: jest.fn((address: string) => {
    // 都道府県名のモックデータ
    const mockData: { [key: string]: any } = {
      '東京都': {
        pref: '東京都',
        point: { lat: 35.689568, lng: 139.691717 },
      },
      '北海道': {
        pref: '北海道',
        point: { lat: 43.064300, lng: 141.346900 },
      },
      '大阪府': {
        pref: '大阪府',
        point: { lat: 34.693737, lng: 135.502165 },
      },
      '東京都東京': {
        pref: '東京都',
        point: { lat: 35.689568, lng: 139.691717 },
      },
      '大阪府大阪': {
        pref: '大阪府',
        point: { lat: 34.693737, lng: 135.502165 },
      },
    };

    return Promise.resolve(mockData[address] || null);
  }),
}));

describe('prefectureUtils', () => {
  describe('getPrefectureAnchor', () => {
    it('東京都の中心座標を取得', async () => {
      const coord = await getPrefectureAnchor('東京都', PREFECTURE_ANCHOR_CENTER);
      expect(coord).not.toBeNull();
      expect(coord![0]).toBeGreaterThan(139);
      expect(coord![0]).toBeLessThan(140);
      expect(coord![1]).toBeGreaterThan(35);
      expect(coord![1]).toBeLessThan(36);
    });

    it('北海道の中心座標を取得', async () => {
      const coord = await getPrefectureAnchor('北海道', PREFECTURE_ANCHOR_CENTER);
      expect(coord).not.toBeNull();
      expect(coord![0]).toBeGreaterThan(140);
      expect(coord![1]).toBeGreaterThan(42);
    });

    it('存在しない都道府県名の場合は null を返す', async () => {
      const coord = await getPrefectureAnchor('存在しない県', PREFECTURE_ANCHOR_CENTER);
      expect(coord).toBeNull();
    });

    it('デフォルトで中心座標を取得', async () => {
      const coord = await getPrefectureAnchor('東京都');
      expect(coord).not.toBeNull();
    });
  });

  describe('buildPrefectureLineFeature', () => {
    it('2地点から LineString GeoJSON を生成', () => {
      const from: [number, number] = [139.6917, 35.6895]; // 東京
      const to: [number, number] = [135.5023, 34.6937]; // 大阪
      const geojson = buildPrefectureLineFeature(from, to);

      expect(geojson.type).toBe('FeatureCollection');
      expect(geojson.features).toHaveLength(1);
      expect(geojson.features[0].geometry.type).toBe('LineString');
      expect(geojson.features[0].geometry.coordinates).toEqual([from, to]);
    });

    it('プロパティを追加できる', () => {
      const from: [number, number] = [139.0, 35.0];
      const to: [number, number] = [140.0, 36.0];
      const properties = { name: 'test-line', color: 'red' };
      const geojson = buildPrefectureLineFeature(from, to, properties);

      expect(geojson.features[0].properties).toEqual(properties);
    });

    it('プロパティなしでも動作する', () => {
      const from: [number, number] = [139.0, 35.0];
      const to: [number, number] = [140.0, 36.0];
      const geojson = buildPrefectureLineFeature(from, to);

      expect(geojson.features[0].properties).toEqual({});
    });
  });

  describe('buildPrefectureLineLayerName', () => {
    it('レイヤー名を生成（中心→中心）', () => {
      const layerName = buildPrefectureLineLayerName(
        '東京都',
        PREFECTURE_ANCHOR_CENTER,
        '大阪府',
        PREFECTURE_ANCHOR_CENTER,
      );
      expect(layerName).toBe('line-東京-center-大阪-center');
    });

    it('レイヤー名を生成（中心→県庁所在地）', () => {
      const layerName = buildPrefectureLineLayerName(
        '東京都',
        PREFECTURE_ANCHOR_CENTER,
        '大阪府',
        PREFECTURE_ANCHOR_CAPITAL,
      );
      expect(layerName).toBe('line-東京-center-大阪-capital');
    });

    it('レイヤー名を生成（北海道）', () => {
      const layerName = buildPrefectureLineLayerName(
        '北海道',
        PREFECTURE_ANCHOR_CENTER,
        '沖縄県',
        PREFECTURE_ANCHOR_CENTER,
      );
      expect(layerName).toBe('line-北海-center-沖縄-center');
    });

    it('同じ入力で同じレイヤー名が生成される', () => {
      const layerName1 = buildPrefectureLineLayerName(
        '東京都',
        PREFECTURE_ANCHOR_CENTER,
        '大阪府',
        PREFECTURE_ANCHOR_CENTER,
      );
      const layerName2 = buildPrefectureLineLayerName(
        '東京都',
        PREFECTURE_ANCHOR_CENTER,
        '大阪府',
        PREFECTURE_ANCHOR_CENTER,
      );
      expect(layerName1).toBe(layerName2);
    });
  });

  describe('buildPrefectureLine', () => {
    it('東京-大阪間の LineString を生成', async () => {
      const result = await buildPrefectureLine(
        '東京都',
        PREFECTURE_ANCHOR_CENTER,
        '大阪府',
        PREFECTURE_ANCHOR_CENTER,
      );

      expect(result).not.toBeNull();
      expect(result!.geojson.type).toBe('FeatureCollection');
      expect(result!.geojson.features).toHaveLength(1);
      expect(result!.geojson.features[0].geometry.type).toBe('LineString');
      expect(result!.layerName).toBe('line-東京-center-大阪-center');
    });

    it('デフォルトで中心座標を使用', async () => {
      const result = await buildPrefectureLine('東京都', undefined, '大阪府', undefined);

      expect(result).not.toBeNull();
      expect(result!.layerName).toContain('center');
    });

    it('存在しない都道府県の場合は null を返す', async () => {
      const result = await buildPrefectureLine(
        '存在しない県',
        PREFECTURE_ANCHOR_CENTER,
        '大阪府',
        PREFECTURE_ANCHOR_CENTER,
      );

      expect(result).toBeNull();
    });

    it('プロパティに都道府県情報が含まれる', async () => {
      const result = await buildPrefectureLine(
        '東京都',
        PREFECTURE_ANCHOR_CENTER,
        '大阪府',
        PREFECTURE_ANCHOR_CAPITAL,
      );

      expect(result).not.toBeNull();
      const props = result!.geojson.features[0].properties;
      expect(props.prefFrom).toBe('東京都');
      expect(props.anchorFrom).toBe(PREFECTURE_ANCHOR_CENTER);
      expect(props.prefTo).toBe('大阪府');
      expect(props.anchorTo).toBe(PREFECTURE_ANCHOR_CAPITAL);
    });
  });
});
