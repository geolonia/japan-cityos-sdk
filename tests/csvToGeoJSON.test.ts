import { csvToGeoJSON } from '../src/utils';

describe('csvToGeoJSON', () => {
  it('lat/lng カラムがある場合に正しく変換できる', () => {
    const data = [
      { name: 'A', lat: '35.1', lng: '139.2' },
      { name: 'B', lat: '36.2', lng: '140.3' }
    ];
    const geojson = csvToGeoJSON(data);
    expect(geojson.type).toBe('FeatureCollection');
    expect(geojson.features.length).toBe(2);
    expect((geojson.features[0].geometry as GeoJSON.Point).coordinates).toEqual([139.2, 35.1]);
    expect((geojson.features[1].geometry as GeoJSON.Point).coordinates).toEqual([140.3, 36.2]);
  });

  it('緯度・経度カラムが日本語の場合も変換できる', () => {
    const data = [
      { name: 'C', 緯度: '34.5', 経度: '135.5' }
    ];
    const geojson = csvToGeoJSON(data);
    expect(geojson.features.length).toBe(1);
    expect((geojson.features[0].geometry as GeoJSON.Point).coordinates).toEqual([135.5, 34.5]);
  });

  it('lat/lon の場合も変換できる', () => {
    const data = [
      { name: 'D', lat: '33.3', lon: '130.3' }
    ];
    const geojson = csvToGeoJSON(data);
    expect(geojson.features.length).toBe(1);
    expect((geojson.features[0].geometry as GeoJSON.Point).coordinates).toEqual([130.3, 33.3]);
  });

  it('緯度経度が見つからない行は除外される', () => {
    const data = [
      { name: 'E', x: '1', y: '2' },
      { name: 'F', lat: '35.0', lng: '135.0' }
    ];
    const geojson = csvToGeoJSON(data);
    expect(geojson.features.length).toBe(1);
    expect((geojson.features[0].geometry as GeoJSON.Point).coordinates).toEqual([135.0, 35.0]);
  });
});
