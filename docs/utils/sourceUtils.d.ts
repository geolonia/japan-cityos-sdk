import maplibregl from 'maplibre-gl';
/**
 * GeoJSONソースを追加する（既存ならsetData、なければaddSource）
 * @param map maplibregl.Mapインスタンス
 * @param className ソースID
 * @param geojson GeoJSONデータ
 */
export declare function addOrUpdateGeojsonSource(map: maplibregl.Map, className: string, geojson: GeoJSON.FeatureCollection): void;
