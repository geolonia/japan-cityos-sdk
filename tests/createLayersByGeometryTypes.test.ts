import { createLayersByGeometryTypes } from '../src/utils/createLayer';

describe('createLayersByGeometryTypesのテスト', () => {
  const className = 'test-layer';

  it('Point, LineString, Polygonが含まれる場合、全てのレイヤーが返る', () => {
    const types = ['Point', 'LineString', 'Polygon'];
    const simpleStyle = {
      'marker-symbol': 'test-icon',
      'line-color': '#ff0000',
      'fill-color': '#00ff00'
    };
    const layers = createLayersByGeometryTypes(className, types, simpleStyle);
    expect(layers.length).toBe(3);
    expect(layers.some(l => l.type === 'symbol')).toBe(true);
    expect(layers.some(l => l.type === 'line')).toBe(true);
    expect(layers.some(l => l.type === 'fill')).toBe(true);
  });

  it('Pointのみの場合、symbolレイヤーが返る', () => {
    const types = ['Point'];
    const simpleStyle = { 'marker-symbol': 'test-icon' };
    const layers = createLayersByGeometryTypes(className, types, simpleStyle);
    expect(layers.length).toBe(1);
    expect(layers[0].type).toBe('symbol');
  });

  it('PointのみでsimpleStyleにmarker-symbol/titleがない場合、circleレイヤーが返る', () => {
    const types = ['Point'];
    const simpleStyle = {};
    const layers = createLayersByGeometryTypes(className, types, simpleStyle);
    expect(layers.length).toBe(1);
    expect(layers[0].type).toBe('circle');
  });

  it('LineStringのみの場合、lineレイヤーが返る', () => {
    const types = ['LineString'];
    const layers = createLayersByGeometryTypes(className, types, {});
    expect(layers.length).toBe(1);
    expect(layers[0].type).toBe('line');
  });

  it('Polygonのみの場合、fillレイヤーが返る', () => {
    const types = ['Polygon'];
    const layers = createLayersByGeometryTypes(className, types, {});
    expect(layers.length).toBe(1);
    expect(layers[0].type).toBe('fill');
  });

  it('空配列の場合、空のレイヤー配列が返る', () => {
    const types: string[] = [];
    const layers = createLayersByGeometryTypes(className, types, {});
    expect(Array.isArray(layers)).toBe(true);
    expect(layers.length).toBe(0);
  });

  it('simpleStyleやoptionsがundefinedでもエラーにならず返る', () => {
    const types = ['Point', 'LineString', 'Polygon'];
    const layers = createLayersByGeometryTypes(className, types, undefined, undefined);
    expect(layers.length).toBe(3);
  });
});
