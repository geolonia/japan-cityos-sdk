
// geojson内のtypeを配列で取得
export function getGeometryTypes(geojson: GeoJSON.FeatureCollection): string[] {
  const types = new Set<string>();
  for (const feature of geojson.features) {
    if (feature.geometry && feature.geometry.type) {
      types.add(feature.geometry.type);
    }
  }
  return Array.from(types);
}
