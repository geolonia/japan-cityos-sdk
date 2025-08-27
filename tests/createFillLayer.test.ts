import { createFillLayer } from '../src/utils/createLayer';

describe('createFillLayerのテスト', () => {
  const className = 'test-fill';
  const simpleStyle = {
    'fill-color': '#00ff00',
    'fill-opacity': 0.8
  };
  const options = {
    sourceLayer: 'test-source-layer',
    filter: ['==', 'foo', 'bar'] as maplibregl.FilterSpecification
  };

  it('値が渡ってきた時、正しいFillLayerSpecificationを返す', () => {
    const layer = createFillLayer(className, simpleStyle, options);
    expect(layer.type).toBe('fill');
    expect(layer.paint && layer.paint['fill-color']).toBe('#00ff00');
    expect(layer.paint && layer.paint['fill-opacity']).toBe(0.8);
  });

  it('値が渡って来なかった時、デフォルト値で返す', () => {
    const layer = createFillLayer(className, {}, {});
    expect(layer.paint && layer.paint['fill-color']).toBeDefined();
    expect(layer.paint && layer.paint['fill-opacity']).toBeDefined();
  });

  it('渡ってきた値が不正だった時、デフォルト値で返す', () => {
    const layer = createFillLayer(className, { 'fill-opacity': 'invalid' }, {});
    expect(layer.paint && layer.paint['fill-opacity']).toBeDefined();
  });

  it('渡ってきた値がundefinedまたはnullだった時、デフォルト値で返す', () => {
    const layer = createFillLayer(className, undefined as any, undefined as any);
    console.log(layer);
    expect(layer.paint && layer.paint['fill-color']).toBeDefined();
    expect(layer.paint && layer.paint['fill-opacity']).toBeDefined();
  });
});
