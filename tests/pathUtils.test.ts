import {
  extractLineCoordinates,
  hasLineGeometry,
  calculatePathDistance,
  interpolateAlongPath,
  buildVertexTimings,
} from '../src/utils/pathUtils';

describe('extractLineCoordinates', () => {
  it('LineString Geometry から座標配列を抽出する', () => {
    const geojson: GeoJSON.LineString = {
      type: 'LineString',
      coordinates: [[139, 35], [140, 36]],
    };
    const result = extractLineCoordinates(geojson);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual([[139, 35], [140, 36]]);
  });

  it('MultiLineString Geometry から複数の座標配列を抽出する', () => {
    const geojson: GeoJSON.MultiLineString = {
      type: 'MultiLineString',
      coordinates: [
        [[139, 35], [140, 36]],
        [[141, 37], [142, 38]],
      ],
    };
    const result = extractLineCoordinates(geojson);
    expect(result).toHaveLength(2);
  });

  it('Feature から座標配列を抽出する', () => {
    const geojson: GeoJSON.Feature = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [[139, 35], [140, 36]],
      },
      properties: {},
    };
    const result = extractLineCoordinates(geojson);
    expect(result).toHaveLength(1);
  });

  it('FeatureCollection から座標配列を抽出する', () => {
    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [[139, 35], [140, 36]],
          },
          properties: {},
        },
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [[141, 37], [142, 38]],
          },
          properties: {},
        },
      ],
    };
    const result = extractLineCoordinates(geojson);
    expect(result).toHaveLength(2);
  });

  it('Point ジオメトリは無視する', () => {
    const geojson: GeoJSON.Point = {
      type: 'Point',
      coordinates: [139, 35],
    };
    const result = extractLineCoordinates(geojson);
    expect(result).toHaveLength(0);
  });

  it('座標が1点のみの LineString は無視する', () => {
    const geojson: GeoJSON.LineString = {
      type: 'LineString',
      coordinates: [[139, 35]],
    };
    const result = extractLineCoordinates(geojson);
    expect(result).toHaveLength(0);
  });

  it('null の場合は空配列を返す', () => {
    expect(extractLineCoordinates(null as any)).toEqual([]);
  });

  it('Feature の geometry が null の場合は空配列を返す', () => {
    const geojson: any = {
      type: 'Feature',
      geometry: null,
      properties: {},
    };
    expect(extractLineCoordinates(geojson)).toEqual([]);
  });

  it('FeatureCollection 内の geometry が null のフィーチャーをスキップする', () => {
    const geojson = {
      type: 'FeatureCollection' as const,
      features: [
        { type: 'Feature' as const, geometry: null, properties: {} },
        {
          type: 'Feature' as const,
          geometry: { type: 'LineString' as const, coordinates: [[139, 35], [140, 36]] },
          properties: {},
        },
      ],
    };
    const result = extractLineCoordinates(geojson as any);
    expect(result).toHaveLength(1);
  });
});

describe('hasLineGeometry', () => {
  it('LineString を含む場合 true を返す', () => {
    const geojson: GeoJSON.Feature = {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: [[139, 35], [140, 36]] },
      properties: {},
    };
    expect(hasLineGeometry(geojson)).toBe(true);
  });

  it('Point のみの場合 false を返す', () => {
    const geojson: GeoJSON.Feature = {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [139, 35] },
      properties: {},
    };
    expect(hasLineGeometry(geojson)).toBe(false);
  });
});

describe('calculatePathDistance', () => {
  it('2点間のパス距離をメートルで計算する', () => {
    // 東京（35.6762, 139.6503）→ 大阪（34.6937, 135.5023）: 約395km
    const coords = [[139.6503, 35.6762], [135.5023, 34.6937]];
    const dist = calculatePathDistance(coords);
    expect(dist).toBeGreaterThan(380_000);
    expect(dist).toBeLessThan(410_000);
  });

  it('3点のパス距離は各セグメントの合計', () => {
    const coords = [[139, 35], [140, 35], [140, 36]];
    const dist = calculatePathDistance(coords);
    expect(dist).toBeGreaterThan(0);
  });

  it('座標が2点未満の場合は0を返す', () => {
    expect(calculatePathDistance([[139, 35]])).toBe(0);
    expect(calculatePathDistance([])).toBe(0);
  });

  it('null の場合は0を返す', () => {
    expect(calculatePathDistance(null as any)).toBe(0);
  });
});

describe('interpolateAlongPath', () => {
  const coords = [[139, 35], [140, 35], [140, 36]];

  it('ratio=0 で始点を返す', () => {
    const result = interpolateAlongPath(coords, 0);
    expect(result).not.toBeNull();
    expect(result![0]).toBeCloseTo(139, 5);
    expect(result![1]).toBeCloseTo(35, 5);
  });

  it('ratio=1 で終点を返す', () => {
    const result = interpolateAlongPath(coords, 1);
    expect(result).not.toBeNull();
    expect(result![0]).toBeCloseTo(140, 5);
    expect(result![1]).toBeCloseTo(36, 5);
  });

  it('ratio=0.5 で中間点を返す', () => {
    const result = interpolateAlongPath(coords, 0.5);
    expect(result).not.toBeNull();
    // 中間は最初のセグメントの終点付近か2番目のセグメント上
    expect(result![0]).toBeGreaterThanOrEqual(139);
    expect(result![0]).toBeLessThanOrEqual(140);
  });

  it('ratio が負の場合は null を返す', () => {
    expect(interpolateAlongPath(coords, -0.1)).toBeNull();
  });

  it('ratio が1を超える場合は null を返す', () => {
    expect(interpolateAlongPath(coords, 1.1)).toBeNull();
  });

  it('座標が2点未満の場合は null を返す', () => {
    expect(interpolateAlongPath([[139, 35]], 0.5)).toBeNull();
  });

  it('すべての点が同一座標の場合、最初の点を返す', () => {
    const sameCoords = [[139, 35], [139, 35], [139, 35]];
    const result = interpolateAlongPath(sameCoords, 0.5);
    expect(result).not.toBeNull();
    expect(result![0]).toBeCloseTo(139, 5);
    expect(result![1]).toBeCloseTo(35, 5);
  });
});

describe('buildVertexTimings', () => {
  it('各頂点の累積距離と比率を返す', () => {
    const coords = [[139, 35], [140, 35], [140, 36]];
    const timings = buildVertexTimings(coords);
    expect(timings).toHaveLength(3);

    // 最初の頂点は ratio=0
    expect(timings[0].index).toBe(0);
    expect(timings[0].cumulativeDistance).toBe(0);
    expect(timings[0].ratio).toBe(0);

    // 中間の頂点
    expect(timings[1].index).toBe(1);
    expect(timings[1].cumulativeDistance).toBeGreaterThan(0);
    expect(timings[1].ratio).toBeGreaterThan(0);
    expect(timings[1].ratio).toBeLessThan(1);

    // 最後の頂点は最終距離に近い比率
    expect(timings[2].index).toBe(2);
    expect(timings[2].ratio).toBeCloseTo(1, 1);
  });

  it('座標が2点未満の場合は空配列を返す', () => {
    expect(buildVertexTimings([[139, 35]])).toEqual([]);
    expect(buildVertexTimings([])).toEqual([]);
  });

  it('null の場合は空配列を返す', () => {
    expect(buildVertexTimings(null as any)).toEqual([]);
  });

  it('すべての点が同一座標の場合、ratio はすべて0', () => {
    const sameCoords = [[139, 35], [139, 35], [139, 35]];
    const timings = buildVertexTimings(sameCoords);
    expect(timings).toHaveLength(3);
    timings.forEach(t => {
      expect(t.ratio).toBe(0);
      expect(t.cumulativeDistance).toBe(0);
    });
  });

  it('比率は単調増加する', () => {
    const coords = [[139, 35], [139.5, 35.5], [140, 36], [140.5, 36.5]];
    const timings = buildVertexTimings(coords);
    for (let i = 1; i < timings.length; i++) {
      expect(timings[i].ratio).toBeGreaterThanOrEqual(timings[i - 1].ratio);
      expect(timings[i].cumulativeDistance).toBeGreaterThanOrEqual(timings[i - 1].cumulativeDistance);
    }
  });
});
