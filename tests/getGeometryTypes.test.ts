import { getGeometryTypes } from '../src/utils/geojsonUtils';

describe('getGeometryTypesのテスト', () => {
  it('Point, LineString, Polygonが混在している場合、全て取得できる', () => {
    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        { type: 'Feature', geometry: { type: 'Point', coordinates: [0, 0] }, properties: {} },
        { type: 'Feature', geometry: { type: 'LineString', coordinates: [[0, 0], [1, 1]] }, properties: {} },
        { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[0,0],[1,1],[1,0],[0,0]]] }, properties: {} }
      ]
    };
    const types = getGeometryTypes(geojson);
    expect(types).toContain('Point');
    expect(types).toContain('LineString');
    expect(types).toContain('Polygon');
    expect(types.length).toBe(3);
  });

  it('geometryTypeが単一の場合は1つだけ返る', () => {
    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        { type: 'Feature', geometry: { type: 'Point', coordinates: [0, 0] }, properties: {} },
        { type: 'Feature', geometry: { type: 'Point', coordinates: [1, 1] }, properties: {} }
      ]
    };
    const types = getGeometryTypes(geojson);
    expect(types).toEqual(['Point']);
    expect(types.length).toBe(1);
  });

  it('空のFeatureCollectionの場合、空の配列を返す', () => {
    const geojson: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };
    const types = getGeometryTypes(geojson);
    expect(Array.isArray(types)).toBe(true);
    expect(types.length).toBe(0);
  });

  it('geometryがnullの場合は無視される', () => {
    const geojson = {
      type: 'FeatureCollection',
      features: [
        { type: 'Feature', geometry: null, properties: {} },
        { type: 'Feature', geometry: { type: 'Point', coordinates: [0, 0] }, properties: {} }
      ]
    };
    const types = getGeometryTypes(geojson as any);
    expect(types).toEqual(['Point']);
    expect(types.length).toBe(1);
  });

  it('geometry.typeが未定義の場合は無視される', () => {
    const geojson = {
      type: 'FeatureCollection',
      features: [
        { type: 'Feature', geometry: { coordinates: [0, 0] }, properties: {} },
        { type: 'Feature', geometry: { type: 'Point', coordinates: [0, 0] }, properties: {} }
      ]
    };
    const types = getGeometryTypes(geojson as any);
    expect(types).toEqual(['Point']);
    expect(types.length).toBe(1);
  });
});
