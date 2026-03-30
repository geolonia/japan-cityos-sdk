import { setLineStyle, LineStyleOptions } from '../src/utils/lineStyleUtils';

describe('setLineStyle', () => {
  let map: any;

  beforeEach(() => {
    map = {
      getLayer: jest.fn(),
      setPaintProperty: jest.fn(),
    };
  });

  it('全てのスタイルプロパティを設定する', () => {
    map.getLayer.mockReturnValue({ id: 'roads-line', type: 'line' });

    const style: LineStyleOptions = {
      color: '#FF0000',
      width: 5,
      opacity: 0.8,
    };

    setLineStyle(map, 'roads', style);

    expect(map.getLayer).toHaveBeenCalledWith('roads-line');
    expect(map.setPaintProperty).toHaveBeenCalledWith('roads-line', 'line-color', '#FF0000');
    expect(map.setPaintProperty).toHaveBeenCalledWith('roads-line', 'line-width', 5);
    expect(map.setPaintProperty).toHaveBeenCalledWith('roads-line', 'line-opacity', 0.8);
    expect(map.setPaintProperty).toHaveBeenCalledTimes(3);
  });

  it('colorだけ指定した場合、line-colorのみ設定する', () => {
    map.getLayer.mockReturnValue({ id: 'roads-line', type: 'line' });

    setLineStyle(map, 'roads', { color: '#00FF00' });

    expect(map.setPaintProperty).toHaveBeenCalledWith('roads-line', 'line-color', '#00FF00');
    expect(map.setPaintProperty).toHaveBeenCalledTimes(1);
  });

  it('widthだけ指定した場合、line-widthのみ設定する', () => {
    map.getLayer.mockReturnValue({ id: 'roads-line', type: 'line' });

    setLineStyle(map, 'roads', { width: 3 });

    expect(map.setPaintProperty).toHaveBeenCalledWith('roads-line', 'line-width', 3);
    expect(map.setPaintProperty).toHaveBeenCalledTimes(1);
  });

  it('opacityだけ指定した場合、line-opacityのみ設定する', () => {
    map.getLayer.mockReturnValue({ id: 'roads-line', type: 'line' });

    setLineStyle(map, 'roads', { opacity: 0.5 });

    expect(map.setPaintProperty).toHaveBeenCalledWith('roads-line', 'line-opacity', 0.5);
    expect(map.setPaintProperty).toHaveBeenCalledTimes(1);
  });

  it('レイヤーが存在しない場合、setPaintPropertyを呼ばない', () => {
    map.getLayer.mockReturnValue(undefined);

    setLineStyle(map, 'nonexistent', { color: '#FF0000' });

    expect(map.getLayer).toHaveBeenCalledWith('nonexistent-line');
    expect(map.setPaintProperty).not.toHaveBeenCalled();
  });

  it('空のスタイルオブジェクトの場合、setPaintPropertyを呼ばない', () => {
    map.getLayer.mockReturnValue({ id: 'roads-line', type: 'line' });

    setLineStyle(map, 'roads', {});

    expect(map.setPaintProperty).not.toHaveBeenCalled();
  });

  it('opacity が 0 の場合でも正しく設定される', () => {
    map.getLayer.mockReturnValue({ id: 'roads-line', type: 'line' });

    setLineStyle(map, 'roads', { opacity: 0 });

    expect(map.setPaintProperty).toHaveBeenCalledWith('roads-line', 'line-opacity', 0);
    expect(map.setPaintProperty).toHaveBeenCalledTimes(1);
  });

  it('width が 0 の場合でも正しく設定される', () => {
    map.getLayer.mockReturnValue({ id: 'roads-line', type: 'line' });

    setLineStyle(map, 'roads', { width: 0 });

    expect(map.setPaintProperty).toHaveBeenCalledWith('roads-line', 'line-width', 0);
    expect(map.setPaintProperty).toHaveBeenCalledTimes(1);
  });

  it('レイヤーIDが className + "-line" で構成されることを確認する', () => {
    map.getLayer.mockReturnValue({ id: 'custom-layer-line' });

    setLineStyle(map, 'custom-layer', { color: '#123456' });

    expect(map.getLayer).toHaveBeenCalledWith('custom-layer-line');
    expect(map.setPaintProperty).toHaveBeenCalledWith('custom-layer-line', 'line-color', '#123456');
  });

  it('setPaintPropertyが例外を投げても落ちない', () => {
    map.getLayer.mockReturnValue({ id: 'roads-line', type: 'line' });
    map.setPaintProperty.mockImplementation(() => { throw new Error('paint error'); });

    expect(() => setLineStyle(map, 'roads', { color: '#FF0000' })).not.toThrow();
  });
});
