import { removeLayersByLoadedIds } from '../src/utils/mapUtils';

describe('removeLayersByLoadedIds', () => {
  it('loadedSourceIdsに含まれないsourceを持つlayerのみ返す', () => {
    const layers = [
      { id: 'a', type: 'symbol', source: 'a' },
      { id: 'b', type: 'circle', source: 'b' },
      { id: 'c', type: 'line', source: 'c' }
    ] as any[];
    const loadedSourceIds = new Set(['a', 'c']);

    const result = removeLayersByLoadedIds(layers, loadedSourceIds);

    expect(result).toEqual([
      { id: 'b', type: 'circle', source: 'b' }
    ]);
  });

  it('全て含まれていれば空配列を返す', () => {
    const layers = [
      { id: 'a', type: 'symbol', source: 'a' }
    ] as any[];
    const loadedSourceIds = new Set(['a']);

    const result = removeLayersByLoadedIds(layers, loadedSourceIds);

    expect(result).toEqual([]);
  });

  it('loadedSourceIdsが空なら全て返す', () => {
    const layers = [
      { id: 'a', type: 'symbol', source: 'a' },
      { id: 'b', type: 'circle', source: 'b' }
    ] as any[];
    const loadedSourceIds: Set<string> = new Set();

    const result = removeLayersByLoadedIds(layers, loadedSourceIds);

    expect(result).toEqual(layers);
  });

  it('sourceを持たないlayerは除外される', () => {
    const layers = [
      { id: 'background', type: 'background' },
      { id: 'a', type: 'symbol', source: 'a' }
    ] as any[];
    const loadedSourceIds = new Set(['a']);

    const result = removeLayersByLoadedIds(layers, loadedSourceIds);

    expect(result).toEqual([]);
  });
});
