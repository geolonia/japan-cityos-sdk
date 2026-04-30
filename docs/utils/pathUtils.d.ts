/**
 * パス補間・距離計算ユーティリティ
 *
 * scratch (chizubouken-lab-scratch) の path-utils.js から移植。
 * パス上の座標補間やアニメーション用の時間計算を提供。
 */
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
export declare const extractLineCoordinates: (geojson: GeoJSON.GeoJSON) => number[][][];
/**
 * GeoJSON が線ジオメトリ（LineString/MultiLineString）を含むか判定する。
 * @param geojson GeoJSON オブジェクト
 * @returns 線ジオメトリが1つ以上含まれている場合 true
 */
export declare const hasLineGeometry: (geojson: GeoJSON.GeoJSON) => boolean;
/**
 * パス全体の総距離をメートルで計算する（ハバーサイン公式）。
 * @param coords 座標配列 [[lng, lat], ...]
 * @returns 総距離（メートル）。座標が2点未満の場合は 0
 */
export declare const calculatePathDistance: (coords: number[][]) => number;
/**
 * パス上の指定割合（0〜1）の座標を線形補間で算出する。
 * @param coords 座標配列 [[lng, lat], ...]
 * @param ratio パス全体に対する割合 (0 = 始点, 1 = 終点)
 * @returns 補間された座標 [lng, lat]。座標が2点未満または ratio が範囲外の場合は null
 */
export declare const interpolateAlongPath: (coords: number[][], ratio: number) => [number, number] | null;
/**
 * 各頂点への移動時間を距離比率で計算する（アニメーション用）。
 * @param coords 座標配列 [[lng, lat], ...]
 * @returns 各頂点の累積距離と比率の配列。座標が2点未満の場合は空配列
 */
export declare const buildVertexTimings: (coords: number[][]) => VertexTiming[];
