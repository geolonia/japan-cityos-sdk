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
export declare const nearestPointOnSegment: (p: [number, number], a: [number, number], b: [number, number]) => NearestPointOnSegmentResult;
/**
 * ポリライン上の点 P に最も近い点を求める。
 * @param point 対象点 [lng, lat]
 * @param lineCoords ライン座標 [[lng, lat], ...]
 * @returns 最近点情報。座標が2点未満の場合は null
 */
export declare const nearestPointOnLine: (point: [number, number], lineCoords: [number, number][]) => NearestPointOnLineResult | null;
/**
 * 2点間の方位角を計算する（度数法、北=0, 東=90, 南=180, 西=270）。
 * 球面三角法に基づく計算。
 * @param from 始点 [lng, lat]
 * @param to 終点 [lng, lat]
 * @returns 方位角 (0–360)
 */
export declare const bearingBetweenPoints: (from: [number, number], to: [number, number]) => number;
/**
 * 2点間の距離をメートルで計算する（ハバーサイン公式）。
 * @param from 始点 [lng, lat]
 * @param to 終点 [lng, lat]
 * @returns 距離（メートル）
 */
export declare const distanceBetweenPoints: (from: [number, number], to: [number, number]) => number;
/**
 * GeoJSON FeatureCollection から LineString の座標配列を抽出する。
 * MultiLineString は個別のラインに展開する。
 * @param geojson GeoJSON FeatureCollection
 */
export declare const collectLineFeatures: (geojson: GeoJSON.FeatureCollection) => LineFeatureEntry[];
