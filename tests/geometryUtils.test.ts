import {
  nearestPointOnSegment,
  nearestPointOnLine,
  bearingBetweenPoints,
  distanceBetweenPoints,
  collectLineFeatures,
} from '../src/utils/geometryUtils';

describe('nearestPointOnSegment', () => {
  it('線分の始点が最近点になる場合', () => {
    const p: [number, number] = [139.0, 35.0];
    const a: [number, number] = [139.5, 35.5];
    const b: [number, number] = [140.0, 36.0];
    const result = nearestPointOnSegment(p, a, b);
    expect(result.point[0]).toBeCloseTo(139.5, 5);
    expect(result.point[1]).toBeCloseTo(35.5, 5);
    expect(result.t).toBe(0);
  });

  it('線分の終点が最近点になる場合', () => {
    const p: [number, number] = [141.0, 37.0];
    const a: [number, number] = [139.5, 35.5];
    const b: [number, number] = [140.0, 36.0];
    const result = nearestPointOnSegment(p, a, b);
    expect(result.point[0]).toBeCloseTo(140.0, 5);
    expect(result.point[1]).toBeCloseTo(36.0, 5);
    expect(result.t).toBe(1);
  });

  it('線分の中間が最近点になる場合', () => {
    // 線分 (139, 35) → (140, 35) の上に、(139.5, 35.5) からの垂線を下ろす
    const p: [number, number] = [139.5, 35.5];
    const a: [number, number] = [139.0, 35.0];
    const b: [number, number] = [140.0, 35.0];
    const result = nearestPointOnSegment(p, a, b);
    expect(result.point[0]).toBeCloseTo(139.5, 3);
    expect(result.point[1]).toBeCloseTo(35.0, 3);
    expect(result.t).toBeGreaterThan(0);
    expect(result.t).toBeLessThan(1);
  });

  it('始点と終点が同一の場合（零ベクトル線分）', () => {
    const p: [number, number] = [139.5, 35.5];
    const a: [number, number] = [139.0, 35.0];
    const b: [number, number] = [139.0, 35.0];
    const result = nearestPointOnSegment(p, a, b);
    expect(result.point).toEqual([139.0, 35.0]);
    expect(result.t).toBe(0);
    expect(result.distance).toBeGreaterThan(0);
  });
});

describe('nearestPointOnLine', () => {
  it('ポリライン上の最近点を正しく返す', () => {
    // (139.5, 35.5) からの最近点は、コサイン補正により
    // セグメント1 (140,35)→(140,36) 上の (140.0, 35.5) の方が近い
    // （経度差0.5度は cos(35°)≈0.82 で縮小されるため）
    const point: [number, number] = [139.5, 35.5];
    const lineCoords: [number, number][] = [
      [139.0, 35.0],
      [140.0, 35.0],
      [140.0, 36.0],
    ];
    const result = nearestPointOnLine(point, lineCoords);
    expect(result).not.toBeNull();
    expect(result!.point[0]).toBeCloseTo(140.0, 3);
    expect(result!.point[1]).toBeCloseTo(35.5, 3);
    expect(result!.segmentIndex).toBe(1);
  });

  it('座標が2点未満の場合はnullを返す', () => {
    expect(nearestPointOnLine([139.0, 35.0], [[139.0, 35.0]])).toBeNull();
  });

  it('nullの場合はnullを返す', () => {
    expect(nearestPointOnLine([139.0, 35.0], null as any)).toBeNull();
  });

  it('2番目のセグメントが最近の場合', () => {
    const point: [number, number] = [140.5, 35.5];
    const lineCoords: [number, number][] = [
      [139.0, 35.0],
      [140.0, 35.0],
      [140.0, 36.0],
    ];
    const result = nearestPointOnLine(point, lineCoords);
    expect(result).not.toBeNull();
    expect(result!.segmentIndex).toBe(1);
  });
});

describe('bearingBetweenPoints', () => {
  it.each([
    {
      name: '真北（同経度、北方向）',
      from: [139.0, 35.0] as [number, number],
      to: [139.0, 36.0] as [number, number],
      expected: 0,
      digits: 0,
    },
    {
      name: '真東（同緯度、東方向）',
      from: [139.0, 35.0] as [number, number],
      to: [140.0, 35.0] as [number, number],
      expected: 90,
      digits: -1,
    },
    {
      name: '真南（同経度、南方向）',
      from: [139.0, 36.0] as [number, number],
      to: [139.0, 35.0] as [number, number],
      expected: 180,
      digits: 0,
    },
  ])('$name', ({ from, to, expected, digits }) => {
    const bearing = bearingBetweenPoints(from, to);
    expect(bearing).toBeCloseTo(expected, digits);
  });

  it('同一地点の場合は0を返す', () => {
    const p: [number, number] = [139.0, 35.0];
    expect(bearingBetweenPoints(p, p)).toBe(0);
  });
});

describe('distanceBetweenPoints', () => {
  it('東京（35.6762, 139.6503）と大阪（34.6937, 135.5023）の間は約400km', () => {
    const tokyo: [number, number] = [139.6503, 35.6762];
    const osaka: [number, number] = [135.5023, 34.6937];
    const dist = distanceBetweenPoints(tokyo, osaka);
    // 約395km前後
    expect(dist).toBeGreaterThan(380_000);
    expect(dist).toBeLessThan(410_000);
  });

  it('同一地点の距離は0', () => {
    const p: [number, number] = [139.0, 35.0];
    expect(distanceBetweenPoints(p, p)).toBe(0);
  });

  it('赤道上1度の距離は約111km', () => {
    const a: [number, number] = [0, 0];
    const b: [number, number] = [1, 0];
    const dist = distanceBetweenPoints(a, b);
    expect(dist).toBeGreaterThan(110_000);
    expect(dist).toBeLessThan(112_000);
  });
});

describe('collectLineFeatures', () => {
  it('LineString を正しく抽出する', () => {
    const geojson = {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          geometry: {
            type: 'LineString' as const,
            coordinates: [[139, 35], [140, 36]],
          },
          properties: { name: 'route1' },
        },
      ],
    };
    const result = collectLineFeatures(geojson);
    expect(result).toHaveLength(1);
    expect(result[0].coordinates).toEqual([[139, 35], [140, 36]]);
    expect(result[0].feature.properties).toEqual({ name: 'route1' });
  });

  it('MultiLineString を個別のラインに展開する', () => {
    const geojson = {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          geometry: {
            type: 'MultiLineString' as const,
            coordinates: [
              [[139, 35], [140, 36]],
              [[141, 37], [142, 38]],
            ],
          },
          properties: { name: 'multi' },
        },
      ],
    };
    const result = collectLineFeatures(geojson);
    expect(result).toHaveLength(2);
    expect(result[0].coordinates).toEqual([[139, 35], [140, 36]]);
    expect(result[1].coordinates).toEqual([[141, 37], [142, 38]]);
  });

  it('Point フィーチャーは無視される', () => {
    const geojson = {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: [139, 35] },
          properties: {},
        },
      ],
    };
    const result = collectLineFeatures(geojson);
    expect(result).toHaveLength(0);
  });

  it('null や不正なGeoJSONの場合は空配列を返す', () => {
    expect(collectLineFeatures(null as any)).toEqual([]);
    expect(collectLineFeatures({} as any)).toEqual([]);
    expect(collectLineFeatures({ features: 'invalid' } as any)).toEqual([]);
  });

  it('geometry が null のフィーチャーはスキップする', () => {
    const geojson = {
      type: 'FeatureCollection' as const,
      features: [
        { type: 'Feature' as const, geometry: null, properties: {} },
        {
          type: 'Feature' as const,
          geometry: {
            type: 'LineString' as const,
            coordinates: [[139, 35], [140, 36]],
          },
          properties: {},
        },
      ],
    };
    const result = collectLineFeatures(geojson as any);
    expect(result).toHaveLength(1);
  });
});
