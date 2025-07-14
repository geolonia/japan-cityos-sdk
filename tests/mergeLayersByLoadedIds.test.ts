import { LayerSpecification } from 'maplibre-gl';
import { mergeLayersByLoadedIds } from '../src/utils/mapUtils';

describe('mergeLayersByLoadedIds', () => {
  it('loadedSourceIdsに含まれるsourceを持つlayerのみ抽出し、nextLayersを先頭にマージする', () => {
    const previousLayers = [
      { id: 'a', source: 'foo' },
      { id: 'b', source: 'bar' },
      { id: 'c', source: 'baz' }
    ] as LayerSpecification[];
    const nextLayers = [
      { id: 'd', source: 'qux' }
    ] as LayerSpecification[];
    const loadedSourceIds = new Set(['foo', 'baz']);

    const result = mergeLayersByLoadedIds(previousLayers, nextLayers, loadedSourceIds);

    expect(result).toEqual([
      { id: 'd', source: 'qux' },
      { id: 'a', source: 'foo' },
      { id: 'c', source: 'baz' }
    ]);
  });

  it('loadedSourceIdsに一致しないlayerは含まれない', () => {
    const previousLayers = [
      { id: 'a', source: 'foo' },
      { id: 'b', source: 'bar' }
    ] as LayerSpecification[];
    const nextLayers = [] as LayerSpecification[];
    const loadedSourceIds = new Set(['bar']);
    const result = mergeLayersByLoadedIds(previousLayers, nextLayers, loadedSourceIds);
    expect(result).toEqual([{ id: 'b', source: 'bar' }]);
  });

  it('nextLayersのみの場合も正しく返す', () => {
    const previousLayers = [] as LayerSpecification[];
    const nextLayers = [{ id: 'x', source: 'y' }] as LayerSpecification[];
    const loadedSourceIds: Set<string> = new Set();
    const result = mergeLayersByLoadedIds(previousLayers, nextLayers, loadedSourceIds);
    expect(result).toEqual([{ id: 'x', source: 'y' }]);
  });

  it('どちらも空なら空を返す', () => {
    const previousLayers = [] as LayerSpecification[];
    const nextLayers = [] as LayerSpecification[];
    const loadedSourceIds: Set<string> = new Set();
    const result = mergeLayersByLoadedIds(previousLayers, nextLayers, loadedSourceIds);
    expect(result).toEqual([]);
  });
});
