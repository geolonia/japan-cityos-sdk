import { getLayerIdsBySource } from '../src/utils/layerUtils';

describe('getLayerIdsBySource', () => {
  it('should return layer ids with matching source', () => {
    const layers = [
      { id: 'a', source: 'foo' },
      { id: 'b', source: 'bar' },
      { id: 'c', source: 'foo' },
      { id: 'd' }
    ] as any;
    expect(getLayerIdsBySource(layers, 'foo')).toEqual(['a', 'c']);
    expect(getLayerIdsBySource(layers, 'bar')).toEqual(['b']);
    expect(getLayerIdsBySource(layers, 'baz')).toEqual([]);
  });
});
