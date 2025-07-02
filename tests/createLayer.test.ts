import { createLayer } from '../src/utils';

describe('createLayer', () => {
  it('marker-symbolまたはtitleがある場合はsymbolレイヤーが含まれる', () => {
    const layers = createLayer('test', {
      simpleStyle: {
        'marker-symbol': 'marker:restaurant',
        'marker-size': 'medium',
        'title': 'レストラン'
      }
    });
    const symbolLayer = layers.find(l => l.type === 'symbol');
    expect(symbolLayer).toBeDefined();
    expect((symbolLayer?.layout as any)['icon-image']).toBe('marker:restaurant');
    expect((symbolLayer?.layout as any)['text-field']).toBe('レストラン');
    expect((symbolLayer as any)?.filter).toEqual(
      expect.arrayContaining([['==', '$type', 'Point']])
    );
  });

  it('titleがある場合はtext-font, text-size, text-offset, text-anchor, text-colorが含まれる', () => {
    const layers = createLayer('test', {
      simpleStyle: {
        'title': 'テストラベル',
        'text-font': ['Noto Sans JP Bold'],
        'text-size': 16,
        'text-color': '#ff0000'
      }
    });
    const symbolLayer = layers.find(l => l.type === 'symbol');
    expect(symbolLayer).toBeDefined();
    const layout = (symbolLayer?.layout as any);
    expect(layout['text-field']).toBe('テストラベル');
    expect(layout['text-font']).toEqual(['Noto Sans JP Bold']);
    expect(layout['text-size']).toBe(16);
    expect(layout['text-offset']).toEqual([0, 1.5]);
    expect(layout['text-anchor']).toBe('top');
    const paint = (symbolLayer?.paint as any);
    expect(paint['text-color']).toBe('#ff0000');
  });

  it('marker-symbolやtitleが無い場合はcircleレイヤーが含まれる', () => {
    const layers = createLayer('test', {
      simpleStyle: {
        'marker-color': '#123456',
        'circle-radius': 'medium'
      }
    });
    const circleLayer = layers.find(l => l.type === 'circle');
    expect(circleLayer).toBeDefined();
    expect((circleLayer?.paint as any)['circle-color']).toBe('#123456');
    expect((circleLayer as any)?.filter as any).toEqual(
      expect.arrayContaining([['==', '$type', 'Point']])
    );
  });

  it('lineレイヤーとpolygonレイヤーも必ず含まれる', () => {
    const layers = createLayer('test', {
      simpleStyle: {}
    });
    const lineLayer = layers.find(l => l.type === 'line');
    const fillLayer = layers.find(l => l.type === 'fill');
    expect(lineLayer).toBeDefined();
    expect(fillLayer).toBeDefined();
    expect((lineLayer as any)?.filter).toEqual(
      expect.arrayContaining([['==', '$type', 'LineString']])
    );
    expect((fillLayer as any)?.filter).toEqual(
      expect.arrayContaining([['==', '$type', 'Polygon']])
    );
  });

  it('classNameが空の場合は空配列を返す', () => {
    const layers = createLayer('');
    expect(layers).toEqual([]);
  });
});
