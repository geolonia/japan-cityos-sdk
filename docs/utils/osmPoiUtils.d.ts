import { OsmLayerNameType } from "../types";
export declare const OSM_SOURCE_ID = "osm";
export declare const addOsmSource: (map: maplibregl.Map) => void;
export declare const addOsmLayer: (map: maplibregl.Map, layerName: OsmLayerNameType) => void;
export declare const removeOsmLayer: (map: maplibregl.Map, layerName: OsmLayerNameType) => void;
/**
 * 任意の文字列をOsmLayerNameTypeに変換する
 * @param name 任意のレイヤー名（日本語・英語どちらも可）
 * @returns OsmLayerNameType | undefined
 */
export declare function toOsmLayerNameType(name: string): OsmLayerNameType | undefined;
/**
 * スタイルに該当のスプライトがなければ追加する
 * @param map maplibregl.Mapインスタンス
 * @param layerName OsmLayerNameType
 */
export declare const addOsmSprite: (map: maplibregl.Map, layerName: OsmLayerNameType) => void;
