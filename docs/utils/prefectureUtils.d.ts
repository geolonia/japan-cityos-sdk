/**
 * 都道府県座標ユーティリティ
 *
 * scratch (chizubouken-lab-scratch) の prefecture-anchor.js および
 * draw-prefecture-line.js から移植。
 */
/** アンカー種別: 中心座標 */
export declare const PREFECTURE_ANCHOR_CENTER = "center";
/** アンカー種別: 県庁所在地 */
export declare const PREFECTURE_ANCHOR_CAPITAL = "capital";
/** アンカー種別 */
export type PrefectureAnchor = typeof PREFECTURE_ANCHOR_CENTER | typeof PREFECTURE_ANCHOR_CAPITAL;
/**
 * 都道府県名からアンカー座標（中心 or 県庁所在地）を取得する。
 * @param prefName 都道府県名（例: "東京都", "北海道"）
 * @param anchor アンカー種別（"center" または "capital"、デフォルト: "center"）
 * @returns 座標 [lng, lat]、取得できない場合は null
 */
export declare const getPrefectureAnchor: (prefName: string, anchor?: PrefectureAnchor) => Promise<[number, number] | null>;
/**
 * 2地点座標から LineString GeoJSON FeatureCollection を生成する。
 * @param from 始点座標 [lng, lat]
 * @param to 終点座標 [lng, lat]
 * @param properties 追加するプロパティ（オプション）
 * @returns LineString GeoJSON FeatureCollection
 */
export declare const buildPrefectureLineFeature: (from: [number, number], to: [number, number], properties?: Record<string, any>) => GeoJSON.FeatureCollection<GeoJSON.LineString>;
/**
 * 安定なレイヤー識別子を生成する。
 * 再実行時に同じレイヤー名が生成されるため、上書き更新が可能。
 * @param prefFrom 始点都道府県名
 * @param pointFrom 始点アンカー種別
 * @param prefTo 終点都道府県名
 * @param pointTo 終点アンカー種別
 * @returns レイヤー識別子（例: "line-tokyo-center-osaka-capital"）
 */
export declare const buildPrefectureLineLayerName: (prefFrom: string, pointFrom: PrefectureAnchor, prefTo: string, pointTo: PrefectureAnchor) => string;
/**
 * 2つの都道府県間の LineString を生成する（便利関数）。
 * @param prefFrom 始点都道府県名
 * @param anchorFrom 始点アンカー種別（デフォルト: "center"）
 * @param prefTo 終点都道府県名
 * @param anchorTo 終点アンカー種別（デフォルト: "center"）
 * @returns LineString GeoJSON FeatureCollection、座標取得失敗時は null
 */
export declare const buildPrefectureLine: (prefFrom: string, anchorFrom: PrefectureAnchor, prefTo: string, anchorTo?: PrefectureAnchor) => Promise<{
    geojson: GeoJSON.FeatureCollection<GeoJSON.LineString>;
    layerName: string;
}>;
