import { addOrUpdateGeojsonSource } from '../src/sourceUtils';

describe('addOrUpdateGeojsonSourceのテスト', () => {
  const className = 'test-source';
  const geojson = {
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', geometry: { type: 'Point', coordinates: [0, 0] }, properties: {} }
    ]
  };

  it('既存ソースがある場合はsetDataが呼ばれる', () => {
    const setDataMock = jest.fn();
    const mapMock = {
      getSource: jest.fn(() => ({ setData: setDataMock })),
      addSource: jest.fn()
    } as any;

    addOrUpdateGeojsonSource(mapMock, className, geojson as any);
    expect(mapMock.getSource).toHaveBeenCalledWith(className);
    expect(setDataMock).toHaveBeenCalledWith(geojson);
    expect(mapMock.addSource).not.toHaveBeenCalled();
  });

  it('既存ソースがない場合はaddSourceが呼ばれる', () => {
    const mapMock = {
      getSource: jest.fn(() => undefined),
      addSource: jest.fn()
    } as any;

    addOrUpdateGeojsonSource(mapMock, className, geojson as any);
    expect(mapMock.getSource).toHaveBeenCalledWith(className);
    expect(mapMock.addSource).toHaveBeenCalledWith(className, {
      type: 'geojson',
      data: geojson
    });
  });
});
