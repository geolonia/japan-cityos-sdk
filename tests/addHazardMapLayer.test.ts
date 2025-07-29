import { addHazardMapLayer } from '../src/utils/hazardmapUtils';

describe('addHazardMapLayer', () => {
  let map: any;

  beforeEach(() => {
    map = {
      getLayer: jest.fn(),
      addLayer: jest.fn()
    };
  });

  it('sourceIdが空なら何もしない', () => {
    addHazardMapLayer(map, '');
    expect(map.getLayer).not.toHaveBeenCalled();
    expect(map.addLayer).not.toHaveBeenCalled();
  });

  it('レイヤーが存在しない場合はaddLayerが呼ばれる', () => {
    map.getLayer.mockReturnValue(undefined);
    addHazardMapLayer(map, 'test-source');
    expect(map.getLayer).toHaveBeenCalledWith('test-source');
    expect(map.addLayer).toHaveBeenCalledWith({
      id: 'test-source',
      type: 'raster',
      source: 'test-source',
      paint: {
        'raster-opacity': 0.5
      }
    });
  });

  it('レイヤーが既に存在する場合はaddLayerが呼ばれない', () => {
    map.getLayer.mockReturnValue({ id: 'test-source' });
    addHazardMapLayer(map, 'test-source');
    expect(map.getLayer).toHaveBeenCalledWith('test-source');
    expect(map.addLayer).not.toHaveBeenCalled();
  });
});
