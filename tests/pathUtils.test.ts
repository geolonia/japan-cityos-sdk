/**
 * pathUtils.ts のユニットテスト
 */

import {
  extractLineCoordinates,
  hasLineGeometry,
  calculatePathDistance,
  interpolateAlongPath,
  buildVertexTimings,
} from '../src/utils/pathUtils';

describe('pathUtils', () => {
  describe('extractLineCoordinates', () => {
    it('LineString Geometry から座標を抽出', () => {
      const geojson: GeoJSON.LineString = {
        type: 'LineString',
        coordinates: [
          [139.0, 35.0],
          [140.0, 36.0],
        ],
      };
      const result = extractLineCoordinates(geojson);
      expect(result).toEqual([
        [
          [139.0, 35.0],
          [140.0, 36.0],
        ],
      ]);
    });

    it('MultiLineString Geometry から複数の座標を抽出', () => {
      const geojson: GeoJSON.MultiLineString = {
        type: 'MultiLineString',
        coordinates: [
          [
            [139.0, 35.0],
            [140.0, 36.0],
          ],
          [
            [141.0, 37.0],
            [142.0, 38.0],
          ],
        ],
      };
      const result = extractLineCoordinates(geojson);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual([
        [139.0, 35.0],
        [140.0, 36.0],
      ]);
      expect(result[1]).toEqual([
        [141.0, 37.0],
        [142.0, 38.0],
      ]);
    });

    it('LineString Feature から座標を抽出', () => {
      const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [139.0, 35.0],
            [140.0, 36.0],
          ],
        },
        properties: {},
      };
      const result = extractLineCoordinates(geojson);
      expect(result).toHaveLength(1);
    });

    it('FeatureCollection から複数の LineString を抽出', () => {
      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [139.0, 35.0],
                [140.0, 36.0],
              ],
            },
            properties: {},
          },
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [141.0, 37.0],
                [142.0, 38.0],
              ],
            },
            properties: {},
          },
        ],
      };
      const result = extractLineCoordinates(geojson);
      expect(result).toHaveLength(2);
    });

    it('Point Geometry は抽出されない', () => {
      const geojson: GeoJSON.Point = {
        type: 'Point',
        coordinates: [139.0, 35.0],
      };
      const result = extractLineCoordinates(geojson);
      expect(result).toEqual([]);
    });

    it('null/undefined は空配列を返す', () => {
      expect(extractLineCoordinates(null as any)).toEqual([]);
      expect(extractLineCoordinates(undefined as any)).toEqual([]);
    });

    it('座標が2点未満の LineString は抽出されない', () => {
      const geojson: GeoJSON.LineString = {
        type: 'LineString',
        coordinates: [[139.0, 35.0]],
      };
      const result = extractLineCoordinates(geojson);
      expect(result).toEqual([]);
    });
  });

  describe('hasLineGeometry', () => {
    it('LineString を含む場合 true', () => {
      const geojson: GeoJSON.LineString = {
        type: 'LineString',
        coordinates: [
          [139.0, 35.0],
          [140.0, 36.0],
        ],
      };
      expect(hasLineGeometry(geojson)).toBe(true);
    });

    it('Point のみの場合 false', () => {
      const geojson: GeoJSON.Point = {
        type: 'Point',
        coordinates: [139.0, 35.0],
      };
      expect(hasLineGeometry(geojson)).toBe(false);
    });

    it('空の FeatureCollection の場合 false', () => {
      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      };
      expect(hasLineGeometry(geojson)).toBe(false);
    });
  });

  describe('calculatePathDistance', () => {
    it('2点間の距離を計算（東京-大阪の近似）', () => {
      const coords = [
        [139.6917, 35.6895], // 東京
        [135.5023, 34.6937], // 大阪
      ];
      const distance = calculatePathDistance(coords);
      // 約400km（実測値との誤差を許容）
      expect(distance).toBeGreaterThan(380000);
      expect(distance).toBeLessThan(420000);
    });

    it('3点のパスの総距離を計算', () => {
      const coords = [
        [139.0, 35.0],
        [140.0, 35.0], // 約111km
        [140.0, 36.0], // 約111km
      ];
      const distance = calculatePathDistance(coords);
      // 約222km
      expect(distance).toBeGreaterThan(200000);
      expect(distance).toBeLessThan(250000);
    });

    it('座標が2点未満の場合は 0 を返す', () => {
      expect(calculatePathDistance([])).toBe(0);
      expect(calculatePathDistance([[139.0, 35.0]])).toBe(0);
    });

    it('null/undefined の場合は 0 を返す', () => {
      expect(calculatePathDistance(null as any)).toBe(0);
      expect(calculatePathDistance(undefined as any)).toBe(0);
    });
  });

  describe('interpolateAlongPath', () => {
    const coords = [
      [139.0, 35.0],
      [140.0, 35.0],
      [140.0, 36.0],
    ];

    it('ratio = 0 で始点を返す', () => {
      const result = interpolateAlongPath(coords, 0);
      expect(result).toEqual([139.0, 35.0]);
    });

    it('ratio = 1 で終点を返す', () => {
      const result = interpolateAlongPath(coords, 1);
      expect(result).toEqual([140.0, 36.0]);
    });

    it('ratio = 0.5 で中間点を返す', () => {
      const result = interpolateAlongPath(coords, 0.5);
      expect(result).toBeTruthy();
      // 距離ベースの補間なので、セグメント1（約91km）+ セグメント2の一部（約10km）
      // 結果は2番目のセグメント上（lng=140.0）になる
      expect(result![0]).toBeCloseTo(140.0, 1);
      expect(result![1]).toBeGreaterThan(35.0);
      expect(result![1]).toBeLessThan(35.5);
    });

    it('座標が2点未満の場合は null を返す', () => {
      expect(interpolateAlongPath([], 0.5)).toBeNull();
      expect(interpolateAlongPath([[139.0, 35.0]], 0.5)).toBeNull();
    });

    it('ratio が範囲外の場合は null を返す', () => {
      expect(interpolateAlongPath(coords, -0.1)).toBeNull();
      expect(interpolateAlongPath(coords, 1.1)).toBeNull();
    });

    it('すべての点が同一座標の場合、最初の点を返す', () => {
      const sameCoords = [
        [139.0, 35.0],
        [139.0, 35.0],
      ];
      const result = interpolateAlongPath(sameCoords, 0.5);
      expect(result).toEqual([139.0, 35.0]);
    });
  });

  describe('buildVertexTimings', () => {
    it('各頂点の累積距離と比率を計算', () => {
      const coords = [
        [139.0, 35.0],
        [140.0, 35.0],
        [140.0, 36.0],
      ];
      const timings = buildVertexTimings(coords);

      expect(timings).toHaveLength(3);

      // 最初の頂点
      expect(timings[0].index).toBe(0);
      expect(timings[0].cumulativeDistance).toBe(0);
      expect(timings[0].ratio).toBe(0);

      // 2番目の頂点
      expect(timings[1].index).toBe(1);
      expect(timings[1].cumulativeDistance).toBeGreaterThan(0);
      expect(timings[1].ratio).toBeGreaterThan(0);
      expect(timings[1].ratio).toBeLessThan(1);

      // 最後の頂点
      expect(timings[2].index).toBe(2);
      expect(timings[2].cumulativeDistance).toBeGreaterThan(
        timings[1].cumulativeDistance,
      );
      expect(timings[2].ratio).toBeCloseTo(1, 5);
    });

    it('2点のパスの場合', () => {
      const coords = [
        [139.0, 35.0],
        [140.0, 35.0],
      ];
      const timings = buildVertexTimings(coords);

      expect(timings).toHaveLength(2);
      expect(timings[0].ratio).toBe(0);
      expect(timings[1].ratio).toBeCloseTo(1, 5);
    });

    it('座標が2点未満の場合は空配列を返す', () => {
      expect(buildVertexTimings([])).toEqual([]);
      expect(buildVertexTimings([[139.0, 35.0]])).toEqual([]);
    });

    it('すべての点が同一座標の場合、ratio は 0', () => {
      const sameCoords = [
        [139.0, 35.0],
        [139.0, 35.0],
      ];
      const timings = buildVertexTimings(sameCoords);

      expect(timings).toHaveLength(2);
      expect(timings[0].ratio).toBe(0);
      expect(timings[1].ratio).toBe(0);
    });
  });
});
