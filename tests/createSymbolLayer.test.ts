import { createSymbolLayer } from '../src/utils/createLayer';

describe('createSymbolLayerのテスト', () => {
  const className = 'test-symbol';
  const simpleStyle = {
    'marker-symbol': 'test-icon',
    'marker-size': 'large',
    'title': 'テストタイトル',
    'text-color': '#123456'
  };
  const options = {
    sourceLayer: 'test-source-layer',
    filter: ['==', ['get', 'foo'], 'bar'] as maplibregl.FilterSpecification
  };

  it('値が渡ってきた時、正しいSymbolLayerSpecificationを返す', () => {
    const layer = createSymbolLayer(className, simpleStyle, options);
    expect(layer.type).toBe('symbol');
    expect(layer.id).toBe(className);
    expect(layer.layout).toBeDefined();
    expect(layer.layout && layer.layout['icon-image']).toBe('test-icon');
    expect(layer.layout && layer.layout['text-field']).toBe('テストタイトル');
    expect(layer.paint).toBeDefined();
    expect(layer.paint && layer.paint['text-color']).toBe('#123456');
  });

  it('値が渡って来なかった時、デフォルト値で返す', () => {
    const layer = createSymbolLayer(className, {}, {});
    expect(layer.layout && layer.layout['icon-image']).toBeDefined();
    expect(layer.layout && layer.layout['icon-size']).toBeDefined();
  });

  it('渡ってきた値が不正だった時、デフォルト値で返す', () => {
    const layer = createSymbolLayer(className, { 'marker-size': 'invalid' }, {});
    expect(layer.layout && layer.layout['icon-size']).toBeDefined();
  });

  it('渡ってきた値がundefinedまたはnullだった時、デフォルト値で返す', () => {
    const layer = createSymbolLayer(className, undefined as any, undefined as any);
    expect(layer.layout && layer.layout['icon-image']).toBeDefined();
    expect(layer.layout && layer.layout['icon-size']).toBeDefined();
  });
});
