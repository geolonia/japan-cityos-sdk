import { setFillStyle, FillStyleOptions } from '../src/setFillStyle';

describe('setFillStyle', () => {
  let map: any;

  beforeEach(() => {
    map = {
      getLayer: jest.fn(),
      setPaintProperty: jest.fn(),
    };
  });

  it('全てのオプションを指定した場合、対応するpaintプロパティが設定される', () => {
    map.getLayer.mockReturnValue({ id: 'mydata-polygon' });

    const style: FillStyleOptions = {
      color: '#FF0000',
      opacity: 0.8,
      outlineColor: '#0000FF',
    };

    setFillStyle(map, 'mydata', style);

    expect(map.getLayer).toHaveBeenCalledWith('mydata-polygon');
    expect(map.setPaintProperty).toHaveBeenCalledWith('mydata-polygon', 'fill-color', '#FF0000');
    expect(map.setPaintProperty).toHaveBeenCalledWith('mydata-polygon', 'fill-opacity', 0.8);
    expect(map.setPaintProperty).toHaveBeenCalledWith('mydata-polygon', 'fill-outline-color', '#0000FF');
  });

  it('colorのみ指定した場合、fill-colorだけが設定される', () => {
    map.getLayer.mockReturnValue({ id: 'mydata-polygon' });

    setFillStyle(map, 'mydata', { color: '#FF0000' });

    expect(map.setPaintProperty).toHaveBeenCalledWith('mydata-polygon', 'fill-color', '#FF0000');
    expect(map.setPaintProperty).toHaveBeenCalledTimes(1);
  });

  it('opacityのみ指定した場合、fill-opacityだけが設定される', () => {
    map.getLayer.mockReturnValue({ id: 'mydata-polygon' });

    setFillStyle(map, 'mydata', { opacity: 0.3 });

    expect(map.setPaintProperty).toHaveBeenCalledWith('mydata-polygon', 'fill-opacity', 0.3);
    expect(map.setPaintProperty).toHaveBeenCalledTimes(1);
  });

  it('outlineColorのみ指定した場合、fill-outline-colorだけが設定される', () => {
    map.getLayer.mockReturnValue({ id: 'mydata-polygon' });

    setFillStyle(map, 'mydata', { outlineColor: '#00FF00' });

    expect(map.setPaintProperty).toHaveBeenCalledWith('mydata-polygon', 'fill-outline-color', '#00FF00');
    expect(map.setPaintProperty).toHaveBeenCalledTimes(1);
  });

  it('レイヤーが存在しない場合、setPaintPropertyは呼ばれない', () => {
    map.getLayer.mockReturnValue(undefined);

    setFillStyle(map, 'nonexistent', { color: '#FF0000' });

    expect(map.getLayer).toHaveBeenCalledWith('nonexistent-polygon');
    expect(map.setPaintProperty).not.toHaveBeenCalled();
  });

  it('空のオプションの場合、setPaintPropertyは呼ばれない', () => {
    map.getLayer.mockReturnValue({ id: 'mydata-polygon' });

    setFillStyle(map, 'mydata', {});

    expect(map.setPaintProperty).not.toHaveBeenCalled();
  });

  it('opacity が 0 の場合でも正しく設定される', () => {
    map.getLayer.mockReturnValue({ id: 'mydata-polygon' });

    setFillStyle(map, 'mydata', { opacity: 0 });

    expect(map.setPaintProperty).toHaveBeenCalledWith('mydata-polygon', 'fill-opacity', 0);
    expect(map.setPaintProperty).toHaveBeenCalledTimes(1);
  });

  it('レイヤーIDが className + "-polygon" で構成されることを確認する', () => {
    map.getLayer.mockReturnValue({ id: 'custom-layer-polygon' });

    setFillStyle(map, 'custom-layer', { color: '#123456' });

    expect(map.getLayer).toHaveBeenCalledWith('custom-layer-polygon');
    expect(map.setPaintProperty).toHaveBeenCalledWith('custom-layer-polygon', 'fill-color', '#123456');
  });
});
