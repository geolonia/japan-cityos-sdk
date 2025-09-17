
// geojson内のtypeを配列で取得
export function getGeometryTypes(geojson: GeoJSON.FeatureCollection | string): string[] {
  if (typeof geojson === 'string') {
    // URLの場合は全てのgeometry typeを返す
    return [
      'Point',
      'LineString',
      'Polygon',
      'MultiPoint',
      'MultiLineString',
      'MultiPolygon',
      'GeometryCollection'
    ];
  }
  const types = new Set<string>();
  for (const feature of geojson.features) {
    if (feature.geometry && feature.geometry.type) {
      types.add(feature.geometry.type);
    }
  }
  return Array.from(types);
}

// geojsonか判定し、データを返すかundefinedを返す関数
export function parseGeojsonInput(geojson: any): string | GeoJSON.FeatureCollection | undefined {

  if (!geojson) { return undefined; }

  if (typeof geojson === 'string') {
    // URLの場合はJSON.parseせずそのまま返す
    if (/^https?:\/\/.+\.geojson$/i.test(geojson.trim())) {
      return geojson;
    }
    // URLでなければJSON.parseを試みる
    try {
      const parsed = JSON.parse(geojson);
      if (parsed && parsed.type === 'FeatureCollection' && Array.isArray(parsed.features)) {
        return parsed;
      } else {
        return undefined;
      }
    } catch (e) {
      return undefined;
    }
  }

  if (
    typeof geojson === 'object' &&
    geojson.type === 'FeatureCollection' &&
    Array.isArray(geojson.features)
  ) {
    return geojson;
  }

  return undefined;
}