import maplibregl from 'maplibre-gl';
export type TottoriDataEntry = {
    id: string;
    tileUrl: string;
    styleUrl: string;
    geojsonUrl?: string;
    description: string;
};
/**
 * 鳥取県スマートシティの index.json を取得する（キャッシュ付き）
 */
export declare function fetchTottoriDataIndex(): Promise<TottoriDataEntry[]>;
/**
 * tileUrl からタイル種別を判定する
 */
export declare function getTileType(tileUrl: string): 'raster' | 'vector';
/**
 * 鳥取県データのソースを追加する
 */
export declare function addTottoriDataSource(map: maplibregl.Map, entry: TottoriDataEntry): string | undefined;
/**
 * 鳥取県データのレイヤーを追加する
 */
export declare function addTottoriDataLayer(map: maplibregl.Map, entry: TottoriDataEntry): void;
/**
 * 鳥取県データのレイヤーとソースを削除する
 */
export declare function removeTottoriDataLayer(map: maplibregl.Map, entry: TottoriDataEntry): string | undefined;
/**
 * テスト用: キャッシュをリセットする
 */
export declare function _resetCache(): void;
