import type { Feature, FeatureCollection } from "geojson";
import { CIRCLE_SIZE_MAP, DEFAULT_CIRCLE_COLOR, DEFAULT_MARKER_NAME, DEFAULT_TEXT_COLOR, MARKER_SIZE_MAP } from "../constants";

/**
 * Parses the API key from the URL of the current script tag.
 *
 * @param {HTMLScriptElement} script - The current script tag.
 */
export const parseApiKey = (script: HTMLScriptElement) => {

  let apiKey: string | null = null;

  const url = new URL(
    (
      script.src.startsWith('https://') ||
      script.src.startsWith('http://') ||
      script.src.startsWith('//')
    ) ? script.src : `https://${location.host}/${script.src}`);

  const _apiKey = url.searchParams.get('api-key');

  if (_apiKey) {
    apiKey = _apiKey;
  }

  return apiKey;
}


export const csvToGeoJSON = (data: any[]): FeatureCollection => {
  return {
    type: 'FeatureCollection',
    features: data
      .map((d: any) => {
        let latKey = Object.keys(d).find(k => k.toLowerCase().includes('lat') || k.includes('緯度'));
        let lngKey = Object.keys(d).find(k => k.toLowerCase().includes('lng') || k.toLowerCase().includes('lon') || k.includes('経度'));

        // 緯度経度が見つからない場合はundefinedを返す
        if (!latKey || !lngKey || !d[latKey] || !d[lngKey]) return undefined;

        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [
              Number(d[lngKey]),
              Number(d[latKey])
            ]
          },
          properties: d
        } as Feature;
      })
      .filter((f): f is Feature => !!f) // undefinedを除外
  };
}


export const createSourceByType = (type: 'geojson' | 'vector' | 'raster', data: any | undefined): maplibregl.SourceSpecification | undefined => {
  if (!data) { return undefined; }

  if (type === 'geojson') {
    return {
      type: 'geojson',
      data: data,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50
    };

  } else if (type === 'vector') {
    if (Array.isArray(data)) {
      return {
        type: 'vector',
        tiles: data
      };
    }

    return {
      type: 'vector',
      url: data
    };

  } else if (type === 'raster') {
    return {
      type: 'raster',
      tiles: Array.isArray(data) ? data : [data],
      tileSize: 256
    };

  } else {
    throw new Error('Unsupported source type');
  }
}

/**
 * 指定したレイヤーIDまたはその派生（-line, -polygonなど）がマップに追加されているかチェックする
 * @param map maplibregl.Mapインスタンス
 * @param layerId レイヤーID
 * @returns 存在すればtrue、なければfalse
 */
const LAYER_PATTERN = [
  'line',
  'polygon'
]
export function hasLayer(map: maplibregl.Map, layerId: string): boolean {
  // ベースIDとLAYER_PATTERNの派生IDもチェック
  const idsToCheck = [layerId, ...LAYER_PATTERN.map(type => `${layerId}-${type}`)];
  return idsToCheck.some(id => {
    try {
      return !!map.getLayer(id);
    } catch {
      return false;
    }
  });
}

/**
 * 指定された情報からpoint/symbol, line, polygonレイヤーのLayer定義を返す
 * @param className クラス名（レイヤーIDにも利用）
 * @param options.simpleStyle シンボルや色などのスタイル指定
 * @param options.sourceLayer 任意のsource-layer名
 * @param options.filter 任意のfilter
 * @returns maplibregl.LayerSpecification[]
 */
export const createLayer = (
  className: string,
  options?: {
    simpleStyle?: { [key: string]: any },
    sourceLayer?: string,
    filter?: maplibregl.FilterSpecification
  }
): maplibregl.LayerSpecification[] => {
  if (!className) { return []; }

  const simpleStyle = options?.simpleStyle || {};
  const base = {
    id: className,
    source: className,
    ...(options?.sourceLayer ? { 'source-layer': options.sourceLayer } : {}),
    ...(options?.filter ? { filter: options.filter } : {})
  };

  const layers: maplibregl.LayerSpecification[] = [];

  // Point or Symbol layer
  if (simpleStyle['marker-symbol'] || simpleStyle['title']) {
    const iconSizeKey = simpleStyle['marker-size'];
    const customIconSize = simpleStyle['custom-marker-size'];
    const iconSize = MARKER_SIZE_MAP[iconSizeKey] ?? MARKER_SIZE_MAP.medium;

    layers.push({
      ...base,
      type: 'symbol',
      layout: {
        'icon-image': simpleStyle['marker-symbol'] ?? DEFAULT_MARKER_NAME,
        'icon-size': customIconSize ? customIconSize : iconSize,
        'icon-allow-overlap': true,
        'icon-overlap': 'always',
        'text-allow-overlap': true,
        ...(simpleStyle['title'] ? { 
          'text-field': simpleStyle['title'],
          'text-font': simpleStyle['text-font'] ?? ["Noto Sans Regular"],
          'text-size': simpleStyle['text-size'] ?? 12,
          'text-offset': simpleStyle['text-offset'] ?? [0, 1.5],
          'text-anchor': simpleStyle['text-anchor'] ?? 'top'
        } : {}),
      },
      paint: {
        ...(simpleStyle.paint || {}),
        ...(simpleStyle['title'] && { 
          'text-color': simpleStyle['text-color'] ?? DEFAULT_TEXT_COLOR,
          'text-halo-color': '#fff',
          'text-halo-width': 2
        })
      },
      filter: [
        'all',
        ...(base.filter ? [base.filter] : []),
        ['==', '$type', 'Point']
      ]
    } as maplibregl.SymbolLayerSpecification);

  } else {
    const circleSizeKey = simpleStyle['circle-radius'];
    const circleSize = CIRCLE_SIZE_MAP[circleSizeKey] ?? CIRCLE_SIZE_MAP.medium;

    layers.push({
      ...base,
      type: 'circle',
      paint: {
        'circle-radius': circleSize,
        'circle-color': simpleStyle['marker-color'] || DEFAULT_CIRCLE_COLOR,
        ...simpleStyle.paint,
      },
      filter: [
        'all',
        ...(base.filter ? [base.filter] : []),
        ['==', '$type', 'Point']
      ]
    } as maplibregl.CircleLayerSpecification);

  }

  // Line layer
  layers.push({
    ...base,
    id: `${className}-line`,
    type: 'line',
    paint: {
      'line-color': simpleStyle['line-color'] || '#0000FF',
      'line-width': simpleStyle['line-width'] || 2,
      ...simpleStyle.paint,
    },
    filter: [
      'all',
      ...(base.filter ? [base.filter] : []),
      ['==', '$type', 'LineString']
    ]
  } as maplibregl.LineLayerSpecification);

  // Polygon layer
  layers.push({
    ...base,
    id: `${className}-polygon`,
    type: 'fill',
    paint: {
      'fill-color': simpleStyle['fill-color'] || '#00FF00',
      'fill-opacity': simpleStyle['fill-opacity'] || 0.5,
      ...simpleStyle.paint,
    },
    filter: [
      'all',
      ...(base.filter ? [base.filter] : []),
      ['==', '$type', 'Polygon']
    ]
  } as maplibregl.FillLayerSpecification);

  return layers;
};

/**
 * 既存のレイヤーのlayoutやpaintプロパティを更新する
 * @param map maplibregl.Mapインスタンス
 * @param layer maplibregl.LayerSpecification
 */
export function updateLayer(map: maplibregl.Map, layer: maplibregl.LayerSpecification) {
  const existingLayer = map.getLayer(layer.id);
  if (!existingLayer) return;

  // layoutの更新
  if (layer.layout) {
    Object.keys(layer.layout).forEach(key => {
      try {
        map.setLayoutProperty(layer.id, key, (layer.layout as any)[key]);
      } catch (e) {
        // プロパティが存在しない場合は無視
      }
    });
  }
  // paintの更新
  if (layer.paint) {
    Object.keys(layer.paint).forEach(key => {
      try {
        map.setPaintProperty(layer.id, key, (layer.paint as any)[key]);
      } catch (e) {
        // プロパティが存在しない場合は無視
      }
    });
  }
}

/**
 * previousStyle.sourcesから、loadedSourceIdsに含まれるsourceのみを抽出し、nextStyle.sourcesをマージして返す
 * @param previousSources - 前のスタイルのsources
 * @param nextSources - 次のスタイルのsources
 * @param loadedSourceIds - 読み込まれたsourceのIDのセット
 * @returns マージされたsources
 */
export function mergeSourcesByLoadedIds(
  previousSources: Record<string, any>,
  nextSources: Record<string, any>,
  loadedSourceIds: Set<string>
): Record<string, any> {
  const filteredSources = Object.keys(previousSources).reduce((acc, id) => {
    if (loadedSourceIds.has(id)) {
      acc[id] = previousSources[id];
    }
    return acc;
  }, {} as Record<string, any>);
  Object.assign(filteredSources, nextSources);
  return filteredSources;
}

/**
 * previousStyle.layersから、loadedSourceIdsに含まれるsourceを持つlayerのみ抽出し、nextStyle.layersを先頭にマージして返す
 * @param previousLayers - 前のスタイルのlayers
 * @param nextLayers - 次のスタイルのlayers
 * @param loadedSourceIds - 読み込まれたsourceのIDのセット
 * @returns マージされたlayers
 */
export function mergeLayersByLoadedIds(
  previousLayers: any[],
  nextLayers: any[],
  loadedSourceIds: Set<string>
): any[] {
  const filteredPrevLayers = previousLayers.filter(
    layer => 'source' in layer && loadedSourceIds.has((layer as { source: string }).source)
  );
  return [...nextLayers, ...filteredPrevLayers];
}

/**
 * 背景地図以外の全てのソースを削除する
 */
export function removeSourcesByLoadedIds(
  sources: Record<string, maplibregl.SourceSpecification>,
  loadedSourceIds: Set<string>
) {
  return Object.fromEntries(
    Object.entries(sources).filter(
      ([id]) => !loadedSourceIds.has(id)
    )
  );
}

/**
 * 背景地図以外の全てのレイヤーを削除する
 */
export function removeLayersByLoadedIds(layers: maplibregl.LayerSpecification[], loadedSourceIds: Set<string>) {
  return layers.filter(
    layer => 'source' in layer && !loadedSourceIds.has(layer.source)
  );
}
