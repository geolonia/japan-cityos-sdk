import { removeSourcesByLoadedIds } from '../src/utils/mapUtils';

describe('removeSourcesByLoadedIds', () => {
  it('loadedSourceIdsに含まれないsourceのみ返す', () => {
    const sources = {
        a: { type: 'geojson', data: {} },
        b: { type: 'vector', url: '...' },
        c: { type: 'raster', tiles: [] }
    } as unknown as Record<string, maplibregl.SourceSpecification>;
    const loadedSourceIds = new Set(['a', 'c']);

    const result = removeSourcesByLoadedIds(sources, loadedSourceIds);

    expect(result).toEqual({
      b: { type: 'vector', url: '...' }
    });
  });

  it('全て含まれていれば空オブジェクトを返す', () => {
    const sources = {
      a: { type: 'geojson', data: {} }
    } as unknown as Record<string, maplibregl.SourceSpecification>;
    const loadedSourceIds = new Set(['a']);

    const result = removeSourcesByLoadedIds(sources, loadedSourceIds);

    expect(result).toEqual({});
  });

  it('loadedSourceIdsが空なら全て返す', () => {
    const sources = {
      a: { type: 'geojson', data: {} },
      b: { type: 'vector', url: '...' }
    } as unknown as Record<string, maplibregl.SourceSpecification>;
    const loadedSourceIds: Set<string> = new Set();

    const result = removeSourcesByLoadedIds(sources, loadedSourceIds);

    expect(result).toEqual(sources);
  });
});
