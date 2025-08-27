import maplibregl from 'maplibre-gl';

/**
 * GeoJSONソースを追加する（既存ならsetData、なければaddSource）
 * @param map maplibregl.Mapインスタンス
 * @param className ソースID
 * @param geojson GeoJSONデータ
 */
export function addOrUpdateGeojsonSource(
  map: maplibregl.Map,
  className: string,
  geojson: GeoJSON.FeatureCollection
) {
  const existingSource = map.getSource(className) as maplibregl.GeoJSONSource | undefined;
  if (existingSource && 'setData' in existingSource) {
    existingSource.setData(geojson as any);
  } else {
    map.addSource(className, {
      type: 'geojson',
      data: geojson
    });
  }
}
