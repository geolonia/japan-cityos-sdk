import maplibregl from 'maplibre-gl';
import { addTerrainSource, addHillshadeLayer, TERRAIN_SOURCE_ID, HILLSHADE_LAYER_ID } from '../src/utils/terrainUtils';

describe('terrainUtils', () => {
  let map: any;

  beforeEach(() => {
    map = {
      sources: {},
      layers: {},
      addSource: jest.fn((id, src) => { map.sources[id] = src; }),
      getSource: jest.fn((id) => map.sources[id]),
      addLayer: jest.fn((layer) => { map.layers[layer.id] = layer; }),
      getLayer: jest.fn((id) => map.layers[id]),
    };
  });

  it('addTerrainSource: DEMソースがなければ追加', () => {
    addTerrainSource(map, 'test-key');
    expect(map.addSource).toHaveBeenCalledWith(TERRAIN_SOURCE_ID, expect.objectContaining({ type: 'raster-dem' }));
    expect(map.sources[TERRAIN_SOURCE_ID].url).toContain('test-key');
  });

  it('addTerrainSource: 既存ソースがあれば追加しない', () => {
    map.sources[TERRAIN_SOURCE_ID] = { type: 'raster-dem' };
    addTerrainSource(map, 'test-key');
    expect(map.addSource).not.toHaveBeenCalled();
  });

  it('addHillshadeLayer: hillshadeレイヤーがなければ追加', () => {
    addHillshadeLayer(map);
    expect(map.addLayer).toHaveBeenCalledWith(expect.objectContaining({ id: HILLSHADE_LAYER_ID, type: 'hillshade' }));
  });

  it('addHillshadeLayer: 既存レイヤーがあれば追加しない', () => {
    map.layers[HILLSHADE_LAYER_ID] = { id: HILLSHADE_LAYER_ID };
    addHillshadeLayer(map);
    expect(map.addLayer).not.toHaveBeenCalled();
  });
});
