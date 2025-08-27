import { createCircleLayer } from '../src/utils/createLayer';

describe('createCircleLayerのテスト', () => {
  const className = 'test-circle';
  const simpleStyle = {
    'circle-radius': 'large',
    'marker-color': '#abcdef'
  };
  const options = {
    sourceLayer: 'test-source-layer',
    filter: ['==', 'foo', 'bar'] as maplibregl.FilterSpecification
  };

  it('値が渡ってきた時、正しいCircleLayerSpecificationを返す', () => {
    const layer = createCircleLayer(className, simpleStyle, options);
    expect(layer.type).toBe('circle');
    expect(layer.paint && layer.paint['circle-radius']).toBeDefined();
    expect(layer.paint && layer.paint['circle-color']).toBe('#abcdef');
  });

  it('値が渡って来なかった時、デフォルト値で返す', () => {
    const layer = createCircleLayer(className, {}, {});
    expect(layer.paint && layer.paint['circle-radius']).toBeDefined();
    expect(layer.paint && layer.paint['circle-color']).toBeDefined();
  });

  it('渡ってきた値が不正だった時、デフォルト値で返す', () => {
    const layer = createCircleLayer(className, { 'circle-radius': 'invalid' }, {});
    expect(layer.paint && layer.paint['circle-radius']).toBeDefined();
  });

  it('渡ってきた値がundefinedまたはnullだった時、デフォルト値で返す', () => {
    const layer = createCircleLayer(className, undefined as any, undefined as any);
    expect(layer.paint && layer.paint['circle-radius']).toBeDefined();
    expect(layer.paint && layer.paint['circle-color']).toBeDefined();
  });
});
