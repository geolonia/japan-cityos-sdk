import { createLineLayer } from '../src/utils/createLayer';

describe('createLineLayerのテスト', () => {
  const className = 'test-line';
  const simpleStyle = {
    'line-color': '#ff0000',
    'line-width': 5
  };
  const options = {
      sourceLayer: 'test-source-layer',
      filter: ['==', 'foo', 'bar'] as maplibregl.FilterSpecification
  };

  it('値が渡ってきた時、正しいLineLayerSpecificationを返す', () => {
    const layer = createLineLayer(className, simpleStyle, options);
    expect(layer.type).toBe('line');
    expect(layer.paint && layer.paint['line-color']).toBe('#ff0000');
    expect(layer.paint && layer.paint['line-width']).toBe(5);
  });

  it('値が渡って来なかった時、デフォルト値で返す', () => {
    const layer = createLineLayer(className, {}, {});
    expect(layer.paint && layer.paint['line-color']).toBeDefined();
    expect(layer.paint && layer.paint['line-width']).toBeDefined();
  });

  it('渡ってきた値が不正だった時、デフォルト値で返す', () => {
    const layer = createLineLayer(className, { 'line-width': 'invalid' }, {});
    expect(layer.paint && layer.paint['line-width']).toBeDefined();
  });

  it('渡ってきた値がundefinedまたはnullだった時、デフォルト値で返す', () => {
    const layer = createLineLayer(className, undefined as any, undefined as any);
    expect(layer.paint && layer.paint['line-color']).toBeDefined();
    expect(layer.paint && layer.paint['line-width']).toBeDefined();
  });
});
