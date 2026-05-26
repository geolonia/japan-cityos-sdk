/**
 * 地理座標に関する幾何計算ユーティリティ
 *
 * scratch (chizubouken-lab-scratch) の follow-line-utils.js から移植。
 * MapLibre GL 非依存の純粋関数群。
 */

/** nearestPointOnSegment の戻り値 */
export interface NearestPointOnSegmentResult {
  /** 最近点の座標 [lng, lat] */
  point: [number, number];
  /** 対象点から最近点までの補正済み距離（度単位の近似値） */
  distance: number;
  /** 線分上のパラメータ (0 = 始点, 1 = 終点) */
  t: number;
}

/** nearestPointOnLine の戻り値 */
export interface NearestPointOnLineResult {
  /** 最近点の座標 [lng, lat] */
  point: [number, number];
  /** 対象点から最近点までの補正済み距離（度単位の近似値） */
  distance: number;
  /** 最近点が属するセグメントのインデックス */
  segmentIndex: number;
  /** セグメント上のパラメータ (0 = 始点, 1 = 終点) */
  t: number;
}

/** collectLineFeatures の戻り値の要素 */
export interface LineFeatureEntry {
  /** ラインの座標配列 */
  coordinates: number[][];
  /** 元のフィーチャー */
  feature: GeoJSON.Feature;
}

/**
 * 線分 AB 上の点 P に最も近い点を求める。
 * 経度方向にコサイン補正を適用し、地理座標での精度を向上させる。
 * @param p 対象点 [lng, lat]
 * @param a 線分の始点 [lng, lat]
 * @param b 線分の終点 [lng, lat]
 */
export const nearestPointOnSegment = (
  p: [number, number],
  a: [number, number],
  b: [number, number],
): NearestPointOnSegmentResult => {
  const EPSILON = 1e-12;
  // 経度方向の補正係数（緯度によるメルカトル近似）
  const avgLat = (a[1] + b[1]) / 2;
  const cosLat = Math.cos((avgLat * Math.PI) / 180);

  const rawDx = b[0] - a[0];
  const rawDy = b[1] - a[1];
  // 補正済み差分（実距離に近い比率）
  const dx = rawDx * cosLat;
  const dy = rawDy;
  const lenSq = dx * dx + dy * dy;

  if (lenSq <= EPSILON) {
    const dxP = (p[0] - a[0]) * cosLat;
    const dyP = p[1] - a[1];
    const dist = Math.sqrt(dxP * dxP + dyP * dyP);
    return { point: [a[0], a[1]], distance: dist, t: 0 };
  }

  // 補正済み座標で t を計算
  let t = ((p[0] - a[0]) * cosLat * dx + (p[1] - a[1]) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));

  // 元の lng/lat 座標で投影点を求める
  const projX = a[0] + t * rawDx;
  const projY = a[1] + t * rawDy;

  // 補正済み距離
  const dxDist = (p[0] - projX) * cosLat;
  const dyDist = p[1] - projY;
  const dist = Math.sqrt(dxDist * dxDist + dyDist * dyDist);

  return { point: [projX, projY], distance: dist, t };
};

/**
 * ポリライン上の点 P に最も近い点を求める。
 * @param point 対象点 [lng, lat]
 * @param lineCoords ライン座標 [[lng, lat], ...]
 * @returns 最近点情報。座標が2点未満の場合は null
 */
export const nearestPointOnLine = (
  point: [number, number],
  lineCoords: [number, number][],
): NearestPointOnLineResult | null => {
  if (!lineCoords || lineCoords.length < 2) return null;

  let minDist = Infinity;
  let bestResult: NearestPointOnLineResult | null = null;

  for (let i = 0; i < lineCoords.length - 1; i++) {
    const result = nearestPointOnSegment(point, lineCoords[i], lineCoords[i + 1]);
    if (result.distance < minDist) {
      minDist = result.distance;
      bestResult = {
        point: result.point,
        distance: result.distance,
        segmentIndex: i,
        t: result.t,
      };
    }
  }

  return bestResult;
};

/**
 * 2点間の方位角を計算する（度数法、北=0, 東=90, 南=180, 西=270）。
 * 球面三角法に基づく計算。
 * @param from 始点 [lng, lat]
 * @param to 終点 [lng, lat]
 * @returns 方位角 (0–360)
 */
export const bearingBetweenPoints = (
  from: [number, number],
  to: [number, number],
): number => {
  const dLng = from[0] - to[0];
  const dLat = from[1] - to[1];
  if (dLng === 0 && dLat === 0) return 0;

  const fromLatRad = (from[1] * Math.PI) / 180;
  const toLatRad = (to[1] * Math.PI) / 180;
  const dLngRad = ((to[0] - from[0]) * Math.PI) / 180;

  const x = Math.sin(dLngRad) * Math.cos(toLatRad);
  const y =
    Math.cos(fromLatRad) * Math.sin(toLatRad) -
    Math.sin(fromLatRad) * Math.cos(toLatRad) * Math.cos(dLngRad);

  const bearing = (Math.atan2(x, y) * 180) / Math.PI;
  return (bearing + 360) % 360;
};

/**
 * 2点間の距離をメートルで計算する（ハバーサイン公式）。
 * @param from 始点 [lng, lat]
 * @param to 終点 [lng, lat]
 * @returns 距離（メートル）
 */
export const distanceBetweenPoints = (
  from: [number, number],
  to: [number, number],
): number => {
  const R = 6378137; // 地球の赤道半径 (m)
  const lat1 = (from[1] * Math.PI) / 180;
  const lat2 = (to[1] * Math.PI) / 180;
  const dLat = ((to[1] - from[1]) * Math.PI) / 180;
  const dLng = ((to[0] - from[0]) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * GeoJSON FeatureCollection から LineString の座標配列を抽出する。
 * MultiLineString は個別のラインに展開する。
 * @param geojson GeoJSON FeatureCollection
 */
export const collectLineFeatures = (
  geojson: GeoJSON.FeatureCollection,
): LineFeatureEntry[] => {
  if (!geojson || !Array.isArray(geojson.features)) return [];

  const lines: LineFeatureEntry[] = [];
  for (const feature of geojson.features) {
    if (!feature || !feature.geometry) continue;
    const { geometry } = feature;

    if (geometry.type === 'LineString') {
      if (Array.isArray(geometry.coordinates)) {
        lines.push({ coordinates: geometry.coordinates, feature });
      }
    } else if (geometry.type === 'MultiLineString') {
      for (const coords of geometry.coordinates) {
        if (Array.isArray(coords)) {
          lines.push({ coordinates: coords, feature });
        }
      }
    }
  }

  return lines;
};

/**
 * 指定座標から方向（度）・距離（メートル）で移動した新座標を計算する。
 * ハバーサイン公式の逆計算（destination point）。
 * @param center 始点座標 [lng, lat]
 * @param direction 方位角（度、北=0, 東=90, 南=180, 西=270）
 * @param distance 移動距離（メートル）
 * @returns 移動後の座標 [lng, lat]
 */
export const getMovedCoordinate = (
  center: [number, number],
  direction: number,
  distance: number,
): [number, number] => {
  const R = 6378137; // 地球の赤道半径 (m)
  const lat1 = (center[1] * Math.PI) / 180;
  const lng1 = (center[0] * Math.PI) / 180;
  const bearing = (direction * Math.PI) / 180;
  const angularDistance = distance / R;

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(angularDistance) +
    Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearing),
  );

  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat1),
      Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2),
    );

  return [(lng2 * 180) / Math.PI, (lat2 * 180) / Math.PI];
};
