import maplibregl from 'maplibre-gl';
export declare const TERRAIN_SOURCE_ID = "dem";
export declare const HILLSHADE_LAYER_ID = "hillshading";
/**
 * DEMソースを追加する
 */
export declare function addTerrainSource(map: maplibregl.Map, apiKey: string): void;
/**
 * hillshadeレイヤーを追加する
 */
export declare function addHillshadeLayer(map: maplibregl.Map): void;
