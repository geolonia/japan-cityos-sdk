describe('setSymbolIconSize', () => {
  let map: any;
  let setSymbolIconSize: (map: any, className: string, size: number) => void;

  beforeEach(() => {
    map = {
      getLayer: jest.fn(),
      setLayoutProperty: jest.fn(),
    };

    setSymbolIconSize = require('../src/utils/mapUtils').setSymbolIconSize;
  });

  it('指定したclassNameのSymbolレイヤーのicon-sizeを変更する', () => {
    map.getLayer.mockReturnValue({ id: 'restaurant', type: 'symbol' });

    setSymbolIconSize(map, 'restaurant', 0.8);

    expect(map.getLayer).toHaveBeenCalledWith('restaurant');
    expect(map.setLayoutProperty).toHaveBeenCalledWith('restaurant', 'icon-size', 0.8);
  });

  it('レイヤーが存在しない場合はsetLayoutPropertyを呼ばない', () => {
    map.getLayer.mockReturnValue(undefined);

    setSymbolIconSize(map, 'nonexistent', 0.5);

    expect(map.getLayer).toHaveBeenCalledWith('nonexistent');
    expect(map.setLayoutProperty).not.toHaveBeenCalled();
  });

  it('sizeに0を指定しても正常に動作する', () => {
    map.getLayer.mockReturnValue({ id: 'restaurant', type: 'symbol' });

    setSymbolIconSize(map, 'restaurant', 0);

    expect(map.setLayoutProperty).toHaveBeenCalledWith('restaurant', 'icon-size', 0);
  });

  it('sizeに大きな値を指定しても正常に動作する', () => {
    map.getLayer.mockReturnValue({ id: 'restaurant', type: 'symbol' });

    setSymbolIconSize(map, 'restaurant', 5);

    expect(map.setLayoutProperty).toHaveBeenCalledWith('restaurant', 'icon-size', 5);
  });
});
