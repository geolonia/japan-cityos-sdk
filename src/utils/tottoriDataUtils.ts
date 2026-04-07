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
 * 鳥取県データのソースを追加する
 */
export function addTottoriDataSource(map: maplibregl.Map, entry: TottoriDataEntry): string | undefined {
  const id = toSourceId(entry);
  if (!map.getSource(id)) {
    const tileType = getTileType(entry.tileUrl);
    const source: any = {
      type: tileType,
      tiles: [entry.tileUrl],
      attribution: '鳥取県スマートシティ',
    };
    if (tileType === 'raster') {
      source.tileSize = 256;
    }
    map.addSource(id, source);
    return id;
  }
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
