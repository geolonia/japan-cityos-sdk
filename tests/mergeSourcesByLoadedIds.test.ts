import { mergeSourcesByLoadedIds } from '../src/utils/mapUtils';

describe('mergeSourcesByLoadedIds', () => {
  it('loadedSourceIdsに含まれるsourceのみ抽出し、nextSourcesをマージする', () => {
    const previousSources = {
      a: { type: 'geojson' },
      b: { type: 'vector' },
      c: { type: 'raster' }
    };
    const nextSources = {
      d: { type: 'geojson' },
      b: { type: 'vector', url: 'new' }
    };
    const loadedSourceIds = new Set(['a', 'b']);

    const result = mergeSourcesByLoadedIds(previousSources, nextSources, loadedSourceIds);

    expect(result).toEqual({
      a: { type: 'geojson' },
      b: { type: 'vector', url: 'new' }, // nextSources優先
      d: { type: 'geojson' }
    });
  });

  it('loadedSourceIdsに一致しないものは含まれない', () => {
    const previousSources = { a: { type: 'geojson' }, b: { type: 'vector' } };
    const nextSources = {};
    const loadedSourceIds = new Set(['b']);
    const result = mergeSourcesByLoadedIds(previousSources, nextSources, loadedSourceIds);
    expect(result).toEqual({ b: { type: 'vector' } });
  });

  it('previousSourcesがloadedSourceIdsに含まれない場合、nextSourcesのみ返す', () => {
    const previousSources = { a: { type: 'geojson' } };
    const nextSources = { b: { type: 'vector' } };
    const loadedSourceIds: Set<string> = new Set();
    const result = mergeSourcesByLoadedIds(previousSources, nextSources, loadedSourceIds);
    expect(result).toEqual({ b: { type: 'vector' } });
  });

  it('previousSourcesが空の場合nextSourcesのみ返す', () => {
    const previousSources = {};
    const nextSources = { b: { type: 'vector' } };
    const loadedSourceIds: Set<string> = new Set();
    const result = mergeSourcesByLoadedIds(previousSources, nextSources, loadedSourceIds);
    expect(result).toEqual({ b: { type: 'vector' } });
  });

  it('どちらも空の場合、空を返す', () => {
    const previousSources = {};
    const nextSources = {};
    const loadedSourceIds: Set<string> = new Set();
    const result = mergeSourcesByLoadedIds(previousSources, nextSources, loadedSourceIds);
    expect(result).toEqual({});
  });
});
