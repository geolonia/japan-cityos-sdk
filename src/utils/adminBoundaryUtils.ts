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
 * デフォルトのスタイルオプション
 */
const DEFAULT_STYLE: Required<AdminBoundaryStyleOptions> = {
  fillColor: '#0080ff',
  fillOpacity: 0.2,
  lineColor: '#0080ff',
  lineWidth: 2,
  lineOpacity: 1
};

/**
 * ソースIDを生成する
 * @param id ベースとなるID
 * @returns ソースID
 */
function getSourceId(id: string): string {
  return `admin-boundary-${id}`;
}

/**
 * FillレイヤーIDを生成する
 * @param id ベースとなるID
 * @returns FillレイヤーID
 */
function getFillLayerId(id: string): string {
  return `${getSourceId(id)}-fill`;
}

/**
 * LineレイヤーIDを生成する
 * @param id ベースとなるID
 * @returns LineレイヤーID
 */
function getLineLayerId(id: string): string {
  return `${getSourceId(id)}-line`;
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
export function addAdminBoundarySource(
  map: maplibregl.Map,
  id: string,
  geojson: GeoJSON.FeatureCollection
): string {
  const sourceId = getSourceId(id);

  if (map.getSource(sourceId)) {
    // 既存ソースを使うレイヤーを先に削除してからソースを再追加する
    const fillLayerId = getFillLayerId(id);
    const lineLayerId = getLineLayerId(id);
    if (map.getLayer(fillLayerId)) {
      map.removeLayer(fillLayerId);
    }
    if (map.getLayer(lineLayerId)) {
      map.removeLayer(lineLayerId);
    }
    map.removeSource(sourceId);
  }

  map.addSource(sourceId, {
    type: 'geojson',
    data: geojson,
    attribution: '国土交通省国土数値情報（行政区域データ）'
  });

  return sourceId;
}

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
export function addAdminBoundaryLayer(
  map: maplibregl.Map,
  id: string,
  styleOptions?: AdminBoundaryStyleOptions
): void {
  const sourceId = getSourceId(id);
  const fillLayerId = getFillLayerId(id);
  const lineLayerId = getLineLayerId(id);

  // ソースの存在確認
  if (!map.getSource(sourceId)) {
    throw new Error(`Source "${sourceId}" not registered. Call addAdminBoundarySource first.`);
  }

  // スタイルオプションをデフォルト値とマージ
  const style: Required<AdminBoundaryStyleOptions> = {
    ...DEFAULT_STYLE,
    ...styleOptions
  };

  // Fillレイヤー（塗りつぶし）を追加
  if (!map.getLayer(fillLayerId)) {
    map.addLayer({
      id: fillLayerId,
      type: 'fill',
      source: sourceId,
      paint: {
        'fill-color': style.fillColor,
        'fill-opacity': style.fillOpacity
      }
    });
  }

  // Lineレイヤー（境界線）を追加
  if (!map.getLayer(lineLayerId)) {
    map.addLayer({
      id: lineLayerId,
      type: 'line',
      source: sourceId,
      paint: {
        'line-color': style.lineColor,
        'line-width': style.lineWidth,
        'line-opacity': style.lineOpacity
      }
    });
  }
}

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
export function removeAdminBoundaryLayer(
  map: maplibregl.Map,
  id: string
): void {
  const fillLayerId = getFillLayerId(id);
  const lineLayerId = getLineLayerId(id);

  if (map.getLayer(fillLayerId)) {
    map.removeLayer(fillLayerId);
  }

  if (map.getLayer(lineLayerId)) {
    map.removeLayer(lineLayerId);
  }
}

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
export function removeAdminBoundarySource(
  map: maplibregl.Map,
  id: string
): void {
  const sourceId = getSourceId(id);

  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }
}

/**
 * 行政区画境界のレイヤーとソースをまとめて地図から削除する
 * @param map MapLibre Mapインスタンス
 * @param id 識別用のID
 *
 * @example
 * removeAdminBoundary(map, 'sapporo-chuo');
 */
export function removeAdminBoundary(
  map: maplibregl.Map,
  id: string
): void {
  removeAdminBoundaryLayer(map, id);
  removeAdminBoundarySource(map, id);
}
