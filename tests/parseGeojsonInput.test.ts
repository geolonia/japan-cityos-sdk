import { parseGeojsonInput } from '../src/utils/geojsonUtils';

describe('parseGeojsonInputのテスト', () => {
  it('オブジェクト型で正しいFeatureCollectionならFeatureCollectionを返す', () => {
    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: []
    };
    expect(parseGeojsonInput(geojson)).toEqual(geojson);
  });

  it('オブジェクト型でtypeが違う場合はundefinedを返す', () => {
    const geojson = {
      type: 'Feature',
      features: [] as string[]
    };
    expect(parseGeojsonInput(geojson)).toBeUndefined();
  });

  it('オブジェクト型でfeaturesが配列でない場合はundefinedを返す', () => {
    const geojson = {
      type: 'FeatureCollection',
      features: {}
    };
    expect(parseGeojsonInput(geojson)).toBeUndefined();
  });

  it('string型でhttp/httpsかつ.geojson拡張子ならその文字列を返す', () => {
    expect(parseGeojsonInput('https://gist.githubusercontent.com/sugama-satsuki/93867b64377ea2e4999495e3ebf27bdd/raw/sample.geojson')).toBe('https://gist.githubusercontent.com/sugama-satsuki/93867b64377ea2e4999495e3ebf27bdd/raw/sample.geojson');
    expect(parseGeojsonInput('http://example.com/data.geojson')).toBe('http://example.com/data.geojson');
  });

  it('string型でhttp/httpsでも.geojson拡張子でなければundefinedを返す', () => {
    expect(parseGeojsonInput('https://example.com/data.json')).toBeUndefined();
    expect(parseGeojsonInput('http://example.com/data.txt')).toBeUndefined();
  });

  it('string型でhttp/httpsでなく.geojson拡張子でもundefinedを返す', () => {
    expect(parseGeojsonInput('ftp://example.com/data.geojson')).toBeUndefined();
    expect(parseGeojsonInput('/local/path/data.geojson')).toBeUndefined();
  });

  it('nullや未定義はundefinedを返す', () => {
    expect(parseGeojsonInput(null)).toBeUndefined();
    expect(parseGeojsonInput(undefined)).toBeUndefined();
  });

  it('その他の型はundefinedを返す', () => {
    expect(parseGeojsonInput(123)).toBeUndefined();
    expect(parseGeojsonInput([])).toBeUndefined();
    expect(parseGeojsonInput({})).toBeUndefined();
  });
});
