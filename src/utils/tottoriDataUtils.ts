import maplibregl from 'maplibre-gl';
import { fetchJson } from './fetchJson';

const TOTTORI_INDEX_URL = 'https://tottori.smartcity.geolonia.com/data/index.json';

export type TottoriDataEntry = {
  id: string;
  tileUrl: string;
  styleUrl: string;
  geojsonUrl?: string;
  description: string;
};

let _cache: TottoriDataEntry[] | null = null;
let _cachePromise: Promise<TottoriDataEntry[]> | null = null;

/**
 * 鳥取県スマートシティの index.json を取得する（キャッシュ付き）
 */
export async function fetchTottoriDataIndex(): Promise<TottoriDataEntry[]> {
  if (_cache) { return _cache; }
  if (_cachePromise) { return _cachePromise; }

  _cachePromise = (async () => {
    const data = await fetchJson(TOTTORI_INDEX_URL);
    if (!data || !Array.isArray(data)) {
      _cachePromise = null;
      return [];
    }
    _cache = data;
    return _cache;
  })();

  return _cachePromise;
}

function toSourceId(entry: TottoriDataEntry): string {
  return `tottori-${entry.id}`;
}

/**
 * tileUrl からタイル種別を判定する
 */
export function getTileType(tileUrl: string): 'raster' | 'vector' {
  const normalized = tileUrl.split('?')[0].split('#')[0].toLowerCase();
  return normalized.endsWith('.pbf') ? 'vector' : 'raster';
}

/**
 * styleUrl から style.json を取得し、tileUrl に一致するソース設定（minzoom, maxzoom, bounds）を抽出する
 */
export async function fetchTottoriStyleSourceConfig(styleUrl: string, tileUrl: string): Promise<{ minzoom?: number; maxzoom?: number; bounds?: [number, number, number, number] }> {
  try {
    const style = await fetchJson(styleUrl);
    if (!style || !style.sources) { return {}; }
    const normalizedTileUrl = tileUrl.split('?')[0].split('#')[0];
    const src = Object.values(style.sources).find((candidate: any) => {
      if (!candidate || !Array.isArray(candidate.tiles)) { return false; }
      return candidate.tiles.some((u: string) => u.split('?')[0].split('#')[0] === normalizedTileUrl);
    }) as any;
    if (!src) { return {}; }
    const config: { minzoom?: number; maxzoom?: number; bounds?: [number, number, number, number] } = {};
    if (typeof src.minzoom === 'number') { config.minzoom = src.minzoom; }
    if (typeof src.maxzoom === 'number') { config.maxzoom = src.maxzoom; }
    if (
      Array.isArray(src.bounds) &&
      src.bounds.length === 4 &&
      src.bounds.every((v: unknown) => typeof v === 'number' && Number.isFinite(v))
    ) {
      config.bounds = src.bounds as [number, number, number, number];
    }
    return config;
  } catch {
    return {};
  }
}

/**
 * 鳥取県データのソースを追加する
 */
export async function addTottoriDataSource(map: maplibregl.Map, entry: TottoriDataEntry): Promise<string | undefined> {
  const id = toSourceId(entry);
  if (map.getSource(id)) {
    return id;
  }
  const tileType = getTileType(entry.tileUrl);
  const styleConfig = await fetchTottoriStyleSourceConfig(entry.styleUrl, entry.tileUrl);
  const source: any = {
    type: tileType,
    tiles: [entry.tileUrl],
    attribution: '鳥取県スマートシティ',
  };
  if (tileType === 'raster') {
    source.tileSize = 256;
  }
  if (styleConfig.minzoom !== undefined) { source.minzoom = styleConfig.minzoom; }
  if (styleConfig.maxzoom !== undefined) { source.maxzoom = styleConfig.maxzoom; }
  if (styleConfig.bounds !== undefined) { source.bounds = styleConfig.bounds; }
  if (!map.getSource(id)) {
    map.addSource(id, source);
  }
  return id;
}

/**
 * 鳥取県データのレイヤーを追加する
 */
export function addTottoriDataLayer(map: maplibregl.Map, entry: TottoriDataEntry): void {
  const id = toSourceId(entry);
  if (!map.getLayer(id)) {
    const tileType = getTileType(entry.tileUrl);
    if (tileType === 'raster') {
      map.addLayer({
        id: id,
        type: 'raster',
        source: id,
        paint: {
          'raster-opacity': 0.7,
        },
      });
    } else {
      map.addLayer({
        id: id,
        type: 'circle',
        source: id,
        'source-layer': 'data',
        paint: {
          'circle-color': '#3388ff',
          'circle-radius': 5,
          'circle-opacity': 0.7,
        },
      });
    }
  }
}

/**
 * 鳥取県データのレイヤーとソースを削除する
 */
export function removeTottoriDataLayer(map: maplibregl.Map, entry: TottoriDataEntry): string | undefined {
  const id = toSourceId(entry);
  if (map.getLayer(id)) {
    map.removeLayer(id);
  }
  if (map.getSource(id)) {
    map.removeSource(id);
    return id;
  }
}

/**
 * テスト用: キャッシュをリセットする
 */
export function _resetCache(): void {
  _cache = null;
  _cachePromise = null;
}
