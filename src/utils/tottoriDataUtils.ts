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

/**
 * 鳥取県スマートシティの index.json を取得する（キャッシュ付き）
 */
export async function fetchTottoriDataIndex(): Promise<TottoriDataEntry[]> {
  if (_cache) { return _cache; }
  const data = await fetchJson(TOTTORI_INDEX_URL);
  if (!data || !Array.isArray(data)) { return []; }
  _cache = data;
  return _cache;
}

function toSourceId(entry: TottoriDataEntry): string {
  return `tottori-${entry.id}`;
}

/**
 * 鳥取県データのソースを追加する
 */
export function addTottoriDataSource(map: maplibregl.Map, entry: TottoriDataEntry): string | undefined {
  const id = toSourceId(entry);
  if (!map.getSource(id)) {
    map.addSource(id, {
      type: 'raster',
      tiles: [entry.tileUrl],
      tileSize: 256,
      attribution: '鳥取県スマートシティ',
    });
    return id;
  }
}

/**
 * 鳥取県データのレイヤーを追加する
 */
export function addTottoriDataLayer(map: maplibregl.Map, entry: TottoriDataEntry): void {
  const id = toSourceId(entry);
  if (!map.getLayer(id)) {
    map.addLayer({
      id: id,
      type: 'raster',
      source: id,
      paint: {
        'raster-opacity': 0.7,
      },
    });
  }
}

/**
 * 鳥取県データのレイヤーを削除する
 */
export function removeTottoriDataLayer(map: maplibregl.Map, entry: TottoriDataEntry): void {
  const id = toSourceId(entry);
  if (map.getLayer(id)) {
    map.removeLayer(id);
  }
}

/**
 * テスト用: キャッシュをリセットする
 */
export function _resetCache(): void {
  _cache = null;
}
