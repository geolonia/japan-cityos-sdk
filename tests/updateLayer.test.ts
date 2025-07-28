import { LayerSpecification } from 'maplibre-gl';
import { updateLayer } from '../src/utils/mapUtils';

describe('updateLayer', () => {
  let map: any;

  beforeEach(() => {
    map = {
      getLayer: jest.fn(),
      setLayoutProperty: jest.fn(),
      setPaintProperty: jest.fn(),
    };
  });

  it('layoutとpaintプロパティを正しく更新する', () => {
    map.getLayer.mockReturnValue({ id: 'foo' });

    const layer = {
      id: 'foo',
      layout: {
        'icon-image': 'marker:blue',
        'text-field': '{name}'
      },
      paint: {
        'text-color': '#ff0000',
        'text-halo-width': 2
      }
    };

    updateLayer(map, layer as LayerSpecification);

    expect(map.setLayoutProperty).toHaveBeenCalledWith('foo', 'icon-image', 'marker:blue');
    expect(map.setLayoutProperty).toHaveBeenCalledWith('foo', 'text-field', '{name}');
    expect(map.setPaintProperty).toHaveBeenCalledWith('foo', 'text-color', '#ff0000');
    expect(map.setPaintProperty).toHaveBeenCalledWith('foo', 'text-halo-width', 2);
  });

  it('既存レイヤーがなければ何もしない', () => {
    map.getLayer.mockReturnValue(undefined);

    const layer = {
      id: 'foo',
      layout: { 'icon-image': 'marker:blue' },
      paint: { 'text-color': '#ff0000' }
    };

    updateLayer(map, layer as LayerSpecification);

    expect(map.setLayoutProperty).not.toHaveBeenCalled();
    expect(map.setPaintProperty).not.toHaveBeenCalled();
  });

  it('layoutやpaintが無い場合もエラーにならない', () => {
    map.getLayer.mockReturnValue({ id: 'foo' });

    const layer = {
      id: 'foo'
    };

    updateLayer(map, layer as LayerSpecification);

    expect(map.setLayoutProperty).not.toHaveBeenCalled();
    expect(map.setPaintProperty).not.toHaveBeenCalled();
  });

  it('setLayoutProperty/setPaintPropertyが例外を投げても落ちない', () => {
    map.getLayer.mockReturnValue({ id: 'foo' });
    map.setLayoutProperty.mockImplementation(() => { throw new Error('layout error'); });
    map.setPaintProperty.mockImplementation(() => { throw new Error('paint error'); });

    const layer = {
      id: 'foo',
      layout: { 'icon-image': 'marker:blue' },
      paint: { 'text-color': '#ff0000' }
    };

    expect(() => updateLayer(map, layer as LayerSpecification)).not.toThrow();
  });
});
