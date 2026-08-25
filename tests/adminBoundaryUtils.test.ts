import maplibregl from 'maplibre-gl';
import {
  addAdminBoundarySource,
  addAdminBoundaryLayer,
  removeAdminBoundaryLayer,
  removeAdminBoundary,
  removeAdminBoundarySource,
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
    removeSource: jest.fn((id: string) => {
      delete sources[id];
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

  it('既にソースが存在する場合は既存ソース（と関連レイヤー）を削除して再追加する', () => {
    const map = createMockMap();
    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: []
    };

    // 1回目の追加
    addAdminBoundarySource(map, 'test-boundary', geojson);
    addAdminBoundaryLayer(map, 'test-boundary');
    const addSourceCount1 = (map.addSource as jest.Mock).mock.calls.length;

    // 2回目の追加（既に存在する）→ 既存ソース・レイヤーを削除して再追加する
    const newGeojson: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };
    addAdminBoundarySource(map, 'test-boundary', newGeojson);

    expect((map.addSource as jest.Mock).mock.calls.length).toBe(addSourceCount1 + 1);
    expect(map.removeSource).toHaveBeenCalledWith('admin-boundary-test-boundary');
  });
});

describe('addAdminBoundaryLayer', () => {
  it('ソースが存在しない場合はエラーをスローする', () => {
    const map = createMockMap();

    expect(() => {
      addAdminBoundaryLayer(map, 'non-existent-source');
    }).toThrow('Source "admin-boundary-non-existent-source" not registered. Call addAdminBoundarySource first.');
    expect(map.addLayer).not.toHaveBeenCalled();
  });

  it('FillレイヤーとLineレイヤーを追加できる', () => {
    const map = createMockMap();
    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: []
    };
    addAdminBoundarySource(map, 'test-boundary', geojson);

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
    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: []
    };
    addAdminBoundarySource(map, 'test-boundary', geojson);
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
    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: []
    };
    addAdminBoundarySource(map, 'test-boundary', geojson);

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
    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: []
    };
    addAdminBoundarySource(map, 'test-boundary', geojson);

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

describe('removeAdminBoundarySource', () => {
    it('ソースを削除する', () => {
      const map = createMockMap();
      const geojson: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };
      addAdminBoundarySource(map, 'test-boundary', geojson);

      removeAdminBoundarySource(map, 'test-boundary');

      expect(map.removeSource).toHaveBeenCalledWith('admin-boundary-test-boundary');
      expect(map.getSource('admin-boundary-test-boundary')).toBeUndefined();
    });

    it('ソースが存在しない場合はエラーにならない', () => {
      const map = createMockMap();
      expect(() => {
        removeAdminBoundarySource(map, 'non-existent');
      }).not.toThrow();
      expect(map.removeSource).not.toHaveBeenCalled();
    });
  });

describe('removeAdminBoundary', () => {
    it('レイヤーとソースをまとめて削除する', () => {
      const map = createMockMap();
      const geojson: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };
      addAdminBoundarySource(map, 'test-boundary', geojson);
      addAdminBoundaryLayer(map, 'test-boundary');

      removeAdminBoundary(map, 'test-boundary');

      expect(map.removeLayer).toHaveBeenCalledWith('admin-boundary-test-boundary-fill');
      expect(map.removeLayer).toHaveBeenCalledWith('admin-boundary-test-boundary-line');
      expect(map.removeSource).toHaveBeenCalledWith('admin-boundary-test-boundary');
      expect(map.getSource('admin-boundary-test-boundary')).toBeUndefined();
    });

    it('何も追加されていない場合はエラーにならない', () => {
      const map = createMockMap();
      expect(() => {
        removeAdminBoundary(map, 'non-existent');
      }).not.toThrow();
    });
  });
