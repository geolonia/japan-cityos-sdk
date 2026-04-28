import maplibregl from 'maplibre-gl';
import {
  addAdminBoundarySource,
  addAdminBoundaryLayer,
  removeAdminBoundaryLayer,
  AdminBoundaryStyleOptions
} from '../src/utils/adminBoundaryUtils';

// Mock map object
const createMockMap = () => {
  const sources: { [key: string]: any } = {};
  const layers: { [key: string]: any } = {};

  return {
    getSource: jest.fn((id: string) => sources[id]),
    addSource: jest.fn((id: string, source: any) => {
      sources[id] = source;
    }),
    getLayer: jest.fn((id: string) => layers[id]),
    addLayer: jest.fn((layer: any) => {
      layers[layer.id] = layer;
    }),
    removeLayer: jest.fn((id: string) => {
      delete layers[id];
    }),
    sources,
    layers
  } as unknown as maplibregl.Map;
};

describe('addAdminBoundarySource', () => {
  it('GeoJSONソースを追加できる', () => {
    const map = createMockMap();
    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: []
    };
    const sourceId = addAdminBoundarySource(map, 'test-boundary', geojson);

    expect(sourceId).toBe('admin-boundary-test-boundary');
    expect(map.addSource).toHaveBeenCalledWith(
      'admin-boundary-test-boundary',
      expect.objectContaining({
        type: 'geojson',
        data: geojson
      })
    );
  });

  it('既にソースが存在する場合は追加しない', () => {
    const map = createMockMap();
    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: []
    };

    // 1回目の追加
    addAdminBoundarySource(map, 'test-boundary', geojson);
    const callCount1 = (map.addSource as jest.Mock).mock.calls.length;

    // 2回目の追加（既に存在する）
    addAdminBoundarySource(map, 'test-boundary', geojson);
    const callCount2 = (map.addSource as jest.Mock).mock.calls.length;

    expect(callCount2).toBe(callCount1);
  });
});

describe('addAdminBoundaryLayer', () => {
  it('FillレイヤーとLineレイヤーを追加できる', () => {
    const map = createMockMap();

    addAdminBoundaryLayer(map, 'test-boundary');

    expect(map.addLayer).toHaveBeenCalledTimes(2);

    // Fillレイヤーのチェック
    expect(map.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'admin-boundary-test-boundary-fill',
        type: 'fill',
        source: 'admin-boundary-test-boundary'
      })
    );

    // Lineレイヤーのチェック
    expect(map.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'admin-boundary-test-boundary-line',
        type: 'line',
        source: 'admin-boundary-test-boundary'
      })
    );
  });

  it('カスタムスタイルオプションを適用できる', () => {
    const map = createMockMap();
    const styleOptions: AdminBoundaryStyleOptions = {
      fillColor: '#ff0000',
      fillOpacity: 0.5,
      lineColor: '#0000ff',
      lineWidth: 3,
      lineOpacity: 0.8
    };

    addAdminBoundaryLayer(map, 'test-boundary', styleOptions);

    // Fillレイヤーのスタイルチェック
    expect(map.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        paint: expect.objectContaining({
          'fill-color': '#ff0000',
          'fill-opacity': 0.5
        })
      })
    );

    // Lineレイヤーのスタイルチェック
    expect(map.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        paint: expect.objectContaining({
          'line-color': '#0000ff',
          'line-width': 3,
          'line-opacity': 0.8
        })
      })
    );
  });

  it('デフォルトスタイルが適用される', () => {
    const map = createMockMap();

    addAdminBoundaryLayer(map, 'test-boundary');

    // Fillレイヤーのデフォルトスタイルチェック
    expect(map.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        paint: expect.objectContaining({
          'fill-color': '#0080ff',
          'fill-opacity': 0.2
        })
      })
    );

    // Lineレイヤーのデフォルトスタイルチェック
    expect(map.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        paint: expect.objectContaining({
          'line-color': '#0080ff',
          'line-width': 2,
          'line-opacity': 1
        })
      })
    );
  });
});

describe('removeAdminBoundaryLayer', () => {
  it('FillレイヤーとLineレイヤーを削除できる', () => {
    const map = createMockMap();

    // レイヤーを追加
    addAdminBoundaryLayer(map, 'test-boundary');

    // レイヤーを削除
    removeAdminBoundaryLayer(map, 'test-boundary');

    expect(map.removeLayer).toHaveBeenCalledWith('admin-boundary-test-boundary-fill');
    expect(map.removeLayer).toHaveBeenCalledWith('admin-boundary-test-boundary-line');
  });

  it('レイヤーが存在しない場合はエラーにならない', () => {
    const map = createMockMap();

    expect(() => {
      removeAdminBoundaryLayer(map, 'non-existent');
    }).not.toThrow();
  });
});
