
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

// geojson引数の型チェック関数
export function isValidGeojsonInput(geojson: any): boolean {
  if (typeof geojson === 'object' && geojson !== null) {
    return (
      geojson.type === 'FeatureCollection' &&
      Array.isArray(geojson.features)
    );
  }
  if (typeof geojson === 'string') {
    return (
      /^https?:\/\/.+\.geojson$/i.test(geojson.trim())
    );
  }
  return false;
}