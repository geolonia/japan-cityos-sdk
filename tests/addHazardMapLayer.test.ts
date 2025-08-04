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
    addHazardMapLayer(map, '洪水浸水想定区域(想定最大規模)');
    expect(map.getLayer).toHaveBeenCalledWith('flood-inundation-assumed-area-maximum-assumed-scale');
    expect(map.addLayer).toHaveBeenCalledWith({
      id: 'flood-inundation-assumed-area-maximum-assumed-scale',
      type: 'raster',
      source: 'flood-inundation-assumed-area-maximum-assumed-scale',
      paint: {
        'raster-opacity': 0.5
      }
    });
  });

  it('レイヤーが既に存在する場合はaddLayerが呼ばれない', () => {
    map.getLayer.mockReturnValue({ id: 'flood-inundation-assumed-area-maximum-assumed-scale' });
    addHazardMapLayer(map, '洪水浸水想定区域(想定最大規模)');
    expect(map.getLayer).toHaveBeenCalledWith('flood-inundation-assumed-area-maximum-assumed-scale');
    expect(map.addLayer).not.toHaveBeenCalled();
  });
});
