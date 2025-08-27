jest.mock('../src/utils/mapUtils', () => ({
  hasLayer: jest.fn(() => true),
  updateLayer: jest.fn(),
}));

import { addOrUpdateLayers } from '../src/utils/layerUtils';
import { hasLayer, updateLayer } from '../src/utils/mapUtils';

describe('addOrUpdateLayersのテスト', () => {
  const className = 'test-layer';
  const geometryTypes = ['Point', 'LineString', 'Polygon'];
  const simpleStyle = {
    'marker-symbol': 'test-icon',
    'line-color': '#ff0000',
    'fill-color': '#00ff00'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('既存レイヤーがある場合はupdateLayerが呼ばれる', () => {
    const addLayerMock = jest.fn();
    const mapMock = { addLayer: addLayerMock } as any;

    addOrUpdateLayers(mapMock, className, geometryTypes, simpleStyle);

    expect(hasLayer).toHaveBeenCalledWith(mapMock, className);
    expect(updateLayer).toHaveBeenCalled();
    expect(addLayerMock).not.toHaveBeenCalled();
  });

  it('既存レイヤーがない場合はaddLayerが呼ばれる', () => {
    (hasLayer as jest.Mock).mockReturnValue(false);
    const addLayerMock = jest.fn();
    const mapMock = { addLayer: addLayerMock } as any;

    addOrUpdateLayers(mapMock, className, geometryTypes, simpleStyle);

    expect(hasLayer).toHaveBeenCalledWith(mapMock, className);
    expect(addLayerMock).toHaveBeenCalled();
    expect(updateLayer).not.toHaveBeenCalled();
  });
});
