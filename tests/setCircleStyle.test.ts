import { setCircleStyle, CircleStyleOptions } from '../src/utils/circleStyleUtils';

describe('setCircleStyle', () => {
  let map: any;

  beforeEach(() => {
    map = {
      getLayer: jest.fn(),
      setPaintProperty: jest.fn(),
    };
  });

  it('全てのスタイルプロパティを設定する', () => {
    map.getLayer.mockReturnValue({ id: 'restaurant', type: 'circle' });

    const style: CircleStyleOptions = {
      color: '#00FF00',
      radius: 10,
      strokeColor: '#0000FF',
      strokeWidth: 2,
      opacity: 0.5,
    };

    setCircleStyle(map, 'restaurant', style);

    expect(map.setPaintProperty).toHaveBeenCalledWith('restaurant', 'circle-color', '#00FF00');
    expect(map.setPaintProperty).toHaveBeenCalledWith('restaurant', 'circle-radius', 10);
    expect(map.setPaintProperty).toHaveBeenCalledWith('restaurant', 'circle-stroke-color', '#0000FF');
    expect(map.setPaintProperty).toHaveBeenCalledWith('restaurant', 'circle-stroke-width', 2);
    expect(map.setPaintProperty).toHaveBeenCalledWith('restaurant', 'circle-opacity', 0.5);
    expect(map.setPaintProperty).toHaveBeenCalledTimes(5);
  });

  it('colorだけ指定した場合、circle-colorのみ設定する', () => {
    map.getLayer.mockReturnValue({ id: 'restaurant', type: 'circle' });

    setCircleStyle(map, 'restaurant', { color: '#FF0000' });

    expect(map.setPaintProperty).toHaveBeenCalledWith('restaurant', 'circle-color', '#FF0000');
    expect(map.setPaintProperty).toHaveBeenCalledTimes(1);
  });

  it('radiusだけ指定した場合、circle-radiusのみ設定する', () => {
    map.getLayer.mockReturnValue({ id: 'restaurant', type: 'circle' });

    setCircleStyle(map, 'restaurant', { radius: 8 });

    expect(map.setPaintProperty).toHaveBeenCalledWith('restaurant', 'circle-radius', 8);
    expect(map.setPaintProperty).toHaveBeenCalledTimes(1);
  });

  it('strokeColorだけ指定した場合、circle-stroke-colorのみ設定する', () => {
    map.getLayer.mockReturnValue({ id: 'restaurant', type: 'circle' });

    setCircleStyle(map, 'restaurant', { strokeColor: '#333333' });

    expect(map.setPaintProperty).toHaveBeenCalledWith('restaurant', 'circle-stroke-color', '#333333');
    expect(map.setPaintProperty).toHaveBeenCalledTimes(1);
  });

  it('strokeWidthだけ指定した場合、circle-stroke-widthのみ設定する', () => {
    map.getLayer.mockReturnValue({ id: 'restaurant', type: 'circle' });

    setCircleStyle(map, 'restaurant', { strokeWidth: 3 });

    expect(map.setPaintProperty).toHaveBeenCalledWith('restaurant', 'circle-stroke-width', 3);
    expect(map.setPaintProperty).toHaveBeenCalledTimes(1);
  });

  it('opacityだけ指定した場合、circle-opacityのみ設定する', () => {
    map.getLayer.mockReturnValue({ id: 'restaurant', type: 'circle' });

    setCircleStyle(map, 'restaurant', { opacity: 0.3 });

    expect(map.setPaintProperty).toHaveBeenCalledWith('restaurant', 'circle-opacity', 0.3);
    expect(map.setPaintProperty).toHaveBeenCalledTimes(1);
  });

  it('レイヤーが存在しない場合、setPaintPropertyを呼ばない', () => {
    map.getLayer.mockReturnValue(undefined);

    setCircleStyle(map, 'nonexistent', { color: '#FF0000' });

    expect(map.setPaintProperty).not.toHaveBeenCalled();
  });

  it('空のスタイルオブジェクトの場合、setPaintPropertyを呼ばない', () => {
    map.getLayer.mockReturnValue({ id: 'restaurant', type: 'circle' });

    setCircleStyle(map, 'restaurant', {});

    expect(map.setPaintProperty).not.toHaveBeenCalled();
  });

  it('複数のプロパティを部分的に指定した場合、指定されたものだけ設定する', () => {
    map.getLayer.mockReturnValue({ id: 'restaurant', type: 'circle' });

    setCircleStyle(map, 'restaurant', {
      color: '#FF0000',
      strokeWidth: 2,
    });

    expect(map.setPaintProperty).toHaveBeenCalledWith('restaurant', 'circle-color', '#FF0000');
    expect(map.setPaintProperty).toHaveBeenCalledWith('restaurant', 'circle-stroke-width', 2);
    expect(map.setPaintProperty).toHaveBeenCalledTimes(2);
  });

  it('setPaintPropertyが例外を投げても落ちない', () => {
    map.getLayer.mockReturnValue({ id: 'restaurant', type: 'circle' });
    map.setPaintProperty.mockImplementation(() => { throw new Error('paint error'); });

    expect(() => setCircleStyle(map, 'restaurant', { color: '#FF0000' })).not.toThrow();
  });

  it('一部プロパティで例外が出ても他プロパティの適用を継続する', () => {
    map.getLayer.mockReturnValue({ id: 'restaurant', type: 'circle' });
    map.setPaintProperty.mockImplementation((_: string, prop: string) => {
      if (prop === 'circle-color') throw new Error('paint error');
    });

    expect(() =>
      setCircleStyle(map, 'restaurant', { color: '#FF0000', radius: 8 })
    ).not.toThrow();

    expect(map.setPaintProperty).toHaveBeenCalledWith('restaurant', 'circle-color', '#FF0000');
    expect(map.setPaintProperty).toHaveBeenCalledWith('restaurant', 'circle-radius', 8);
  });
});
