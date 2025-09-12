import { isValidGeojsonInput } from '../src/utils/geojsonUtils';

describe('isValidGeojsonInputのテスト', () => {
  it('オブジェクト型で正しいFeatureCollectionならtrue', () => {
    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: []
    };
    expect(isValidGeojsonInput(geojson)).toBe(true);
  });

  it('オブジェクト型でtypeが違う場合はfalse', () => {
    const geojson = {
      type: 'Feature',
      features: [] as string[]
    };
    expect(isValidGeojsonInput(geojson)).toBe(false);
  });

  it('オブジェクト型でfeaturesが配列でない場合はfalse', () => {
    const geojson = {
      type: 'FeatureCollection',
      features: {}
    };
    expect(isValidGeojsonInput(geojson)).toBe(false);
  });

  it('string型でhttp/httpsかつ.geojson拡張子ならtrue', () => {
    expect(isValidGeojsonInput('https://example.com/data.geojson')).toBe(true);
    expect(isValidGeojsonInput('http://example.com/data.geojson')).toBe(true);
  });

  it('string型でhttp/httpsでも.geojson拡張子でなければfalse', () => {
    expect(isValidGeojsonInput('https://example.com/data.json')).toBe(false);
    expect(isValidGeojsonInput('http://example.com/data.txt')).toBe(false);
  });

  it('string型でhttp/httpsでなく.geojson拡張子でもfalse', () => {
    expect(isValidGeojsonInput('ftp://example.com/data.geojson')).toBe(false);
    expect(isValidGeojsonInput('/local/path/data.geojson')).toBe(false);
  });

  it('nullや未定義はfalse', () => {
    expect(isValidGeojsonInput(null)).toBe(false);
    expect(isValidGeojsonInput(undefined)).toBe(false);
  });

  it('その他の型はfalse', () => {
    expect(isValidGeojsonInput(123)).toBe(false);
    expect(isValidGeojsonInput([])).toBe(false);
    expect(isValidGeojsonInput({})).toBe(false);
  });
});
