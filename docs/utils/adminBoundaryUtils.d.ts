import type maplibregl from 'maplibre-gl';
import type * as GeoJSON from 'geojson';
/**
 * 行政区画境界レイヤーのスタイルオプション
 */
export interface AdminBoundaryStyleOptions {
    /** 塗りつぶしの色（デフォルト: '#0080ff'） */
    fillColor?: string;
    /** 塗りつぶしの透明度（デフォルト: 0.2） */
    fillOpacity?: number;
    /** 境界線の色（デフォルト: '#0080ff'） */
    lineColor?: string;
    /** 境界線の太さ（デフォルト: 2） */
    lineWidth?: number;
    /** 境界線の透明度（デフォルト: 1） */
    lineOpacity?: number;
}
/**
 * 行政区画境界のGeoJSONソースを地図に追加する
 * @param map MapLibre Mapインスタンス
 * @param id ソースを識別するためのID
 * @param geojson 行政区画境界のGeoJSONデータ
 * @returns 追加されたソースのID
 *
 * @example
 * const geojson = await fetchAdminBoundary('01101');
 * if (geojson) {
 *   addAdminBoundarySource(map, 'sapporo-chuo', geojson);
 * }
 */
export declare function addAdminBoundarySource(map: maplibregl.Map, id: string, geojson: GeoJSON.FeatureCollection): string;
/**
 * 行政区画境界のレイヤー（Fill + Line）を地図に追加する
 * @param map MapLibre Mapインスタンス
 * @param id レイヤーを識別するためのID（ソースIDと同じ）
 * @param styleOptions スタイルオプション（オプション）
 *
 * @example
 * // デフォルトスタイルで追加
 * addAdminBoundaryLayer(map, 'sapporo-chuo');
 *
 * @example
 * // カスタムスタイルで追加
 * addAdminBoundaryLayer(map, 'sapporo-chuo', {
 *   fillColor: '#ff0000',
 *   fillOpacity: 0.3,
 *   lineColor: '#ff0000',
 *   lineWidth: 3
 * });
 */
export declare function addAdminBoundaryLayer(map: maplibregl.Map, id: string, styleOptions?: AdminBoundaryStyleOptions): void;
/**
 * 行政区画境界のレイヤーを地図から削除する
 * @param map MapLibre Mapインスタンス
 * @param id レイヤーを識別するためのID
 *
 * ソース（`admin-boundary-${id}`）はこの関数では削除されません。
 * ソースも削除する場合は `map.removeSource(...)` を別途呼び出してください。
 *
 * @example
 * removeAdminBoundaryLayer(map, 'sapporo-chuo');
 */
export declare function removeAdminBoundaryLayer(map: maplibregl.Map, id: string): void;
/**
 * 行政区画境界のGeoJSONソースを地図から削除する
 * @param map MapLibre Mapインスタンス
 * @param id ソースを識別するためのID
 *
 * レイヤーが残っているとソースを削除できないため、先に
 * `removeAdminBoundaryLayer` を呼ぶか `removeAdminBoundary` を使う。
 *
 * @example
 * removeAdminBoundaryLayer(map, 'sapporo-chuo');
 * removeAdminBoundarySource(map, 'sapporo-chuo');
 */
export declare function removeAdminBoundarySource(map: maplibregl.Map, id: string): void;
/**
 * 行政区画境界のレイヤーとソースをまとめて地図から削除する
 * @param map MapLibre Mapインスタンス
 * @param id 識別用のID
 *
 * @example
 * removeAdminBoundary(map, 'sapporo-chuo');
 */
export declare function removeAdminBoundary(map: maplibregl.Map, id: string): void;
