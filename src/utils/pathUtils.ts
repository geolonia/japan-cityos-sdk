/**
 * パス補間・距離計算ユーティリティ
 *
 * scratch (chizubouken-lab-scratch) の path-utils.js から移植。
 * パス上の座標補間やアニメーション用の時間計算を提供。
 */

import { distanceBetweenPoints } from './geometryUtils';

/** buildVertexTimings の戻り値の要素 */
export interface VertexTiming {
  /** 頂点のインデックス */
  index: number;
  /** 始点からこの頂点までの累積距離（メートル） */
  cumulativeDistance: number;
  /** パス全体に対するこの頂点の距離比率 (0〜1) */
  ratio: number;
}

/**
 * GeoJSON から LineString/MultiLineString の座標配列を抽出する。
 * @param geojson GeoJSON オブジェクト（Feature, FeatureCollection, Geometry）
 * @returns 座標配列 [[lng, lat], ...] の配列。線が見つからない場合は空配列
 */
export const extractLineCoordinates = (
  geojson: GeoJSON.GeoJSON,
): number[][][] => {
  if (!geojson) return [];

  const lines: number[][][] = [];

  // FeatureCollection の場合
  if (geojson.type === 'FeatureCollection') {
    for (const feature of geojson.features) {
      if (!feature || !feature.geometry) continue;
      lines.push(...extractLineCoordinates(feature.geometry));
    }
    return lines;
  }

  // Feature の場合
  if (geojson.type === 'Feature') {
    if (!geojson.geometry) return [];
    return extractLineCoordinates(geojson.geometry);
  }

  // Geometry の場合
  if (geojson.type === 'LineString') {
    if (Array.isArray(geojson.coordinates) && geojson.coordinates.length >= 2) {
      lines.push(geojson.coordinates);
    }
  } else if (geojson.type === 'MultiLineString') {
    for (const coords of geojson.coordinates) {
      if (Array.isArray(coords) && coords.length >= 2) {
        lines.push(coords);
      }
    }
  }

  return lines;
};

/**
 * GeoJSON が線ジオメトリ（LineString/MultiLineString）を含むか判定する。
 * @param geojson GeoJSON オブジェクト
 * @returns 線ジオメトリが1つ以上含まれている場合 true
 */
export const hasLineGeometry = (geojson: GeoJSON.GeoJSON): boolean => {
  const lines = extractLineCoordinates(geojson);
  return lines.length > 0;
};

/**
 * パス全体の総距離をメートルで計算する（ハバーサイン公式）。
 * @param coords 座標配列 [[lng, lat], ...]
 * @returns 総距離（メートル）。座標が2点未満の場合は 0
 */
export const calculatePathDistance = (coords: number[][]): number => {
  if (!coords || coords.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    const from: [number, number] = [coords[i][0], coords[i][1]];
    const to: [number, number] = [coords[i + 1][0], coords[i + 1][1]];
    totalDistance += distanceBetweenPoints(from, to);
  }

  return totalDistance;
};

/**
 * パス上の指定割合（0〜1）の座標を線形補間で算出する。
 * @param coords 座標配列 [[lng, lat], ...]
 * @param ratio パス全体に対する割合 (0 = 始点, 1 = 終点)
 * @returns 補間された座標 [lng, lat]。座標が2点未満または ratio が範囲外の場合は null
 */
export const interpolateAlongPath = (
  coords: number[][],
  ratio: number,
): [number, number] | null => {
  if (!coords || coords.length < 2) return null;
  if (ratio < 0 || ratio > 1) return null;

  const totalDistance = calculatePathDistance(coords);
  if (totalDistance === 0) {
    // すべての点が同一座標の場合、最初の点を返す
    return [coords[0][0], coords[0][1]];
  }

  const targetDistance = totalDistance * ratio;
  let cumulativeDistance = 0;

  for (let i = 0; i < coords.length - 1; i++) {
    const from: [number, number] = [coords[i][0], coords[i][1]];
    const to: [number, number] = [coords[i + 1][0], coords[i + 1][1]];
    const segmentDistance = distanceBetweenPoints(from, to);

    if (cumulativeDistance + segmentDistance >= targetDistance) {
      // 目標距離がこのセグメント内にある
      const segmentRatio =
        segmentDistance === 0
          ? 0
          : (targetDistance - cumulativeDistance) / segmentDistance;

      const lng = from[0] + (to[0] - from[0]) * segmentRatio;
      const lat = from[1] + (to[1] - from[1]) * segmentRatio;
      return [lng, lat];
    }

    cumulativeDistance += segmentDistance;
  }

  // ratio = 1.0 の場合、最終点を返す
  const lastCoord = coords[coords.length - 1];
  return [lastCoord[0], lastCoord[1]];
};

/**
 * 各頂点への移動時間を距離比率で計算する（アニメーション用）。
 * @param coords 座標配列 [[lng, lat], ...]
 * @returns 各頂点の累積距離と比率の配列。座標が2点未満の場合は空配列
 */
export const buildVertexTimings = (coords: number[][]): VertexTiming[] => {
  if (!coords || coords.length < 2) return [];

  const totalDistance = calculatePathDistance(coords);
  const timings: VertexTiming[] = [];

  let cumulativeDistance = 0;

  for (let i = 0; i < coords.length; i++) {
    const ratio = totalDistance === 0 ? 0 : cumulativeDistance / totalDistance;

    timings.push({
      index: i,
      cumulativeDistance,
      ratio,
    });

    if (i < coords.length - 1) {
      const from: [number, number] = [coords[i][0], coords[i][1]];
      const to: [number, number] = [coords[i + 1][0], coords[i + 1][1]];
      cumulativeDistance += distanceBetweenPoints(from, to);
    }
  }

  return timings;
};
