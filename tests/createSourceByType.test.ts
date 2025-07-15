import { createSourceByType } from '../src/utils/mapUtils';

describe('createSourceByType', () => {
  it('geojsonタイプのsourceを正しく生成できる', () => {
    const geojson = {
      type: 'FeatureCollection',
      features: [] as GeoJSON.Feature[]
    };
    const source = createSourceByType('geojson', geojson);
    expect(source).toEqual({
      type: 'geojson',
      data: geojson,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50
    });
  });

  it('vectorタイプのsourceを正しく生成できる', () => {
    const url = 'https://example.com/tiles.json';
    const source = createSourceByType('vector', url);
    expect(source).toEqual({
      type: 'vector',
      url: url
    });
  });

  it('rasterタイプのsource（単一URL）を正しく生成できる', () => {
    const tileUrl = 'https://example.com/tile/{z}/{x}/{y}.png';
    const source = createSourceByType('raster', tileUrl);
    expect(source).toEqual({
      type: 'raster',
      tiles: [tileUrl],
      tileSize: 256
    });
  });

  it('rasterタイプのsource（配列URL）を正しく生成できる', () => {
    const tileUrls = [
      'https://example.com/tile1/{z}/{x}/{y}.png',
      'https://example.com/tile2/{z}/{x}/{y}.png'
    ];
    const source = createSourceByType('raster', tileUrls);
    expect(source).toEqual({
      type: 'raster',
      tiles: tileUrls,
      tileSize: 256
    });
  });

  it('dataがundefinedの場合はundefinedを返す', () => {
    expect(createSourceByType('geojson', undefined)).toBeUndefined();
    expect(createSourceByType('vector', undefined)).toBeUndefined();
    expect(createSourceByType('raster', undefined)).toBeUndefined();
  });

  it('未対応のtypeを渡すとエラーになる', () => {
    // @ts-expect-error
    expect(() => createSourceByType('unknown', {})).toThrow('Unsupported source type');
  });
});
