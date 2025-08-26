import { OsmLayerNameType } from "../types";
export declare const OSM_SOURCE_ID = "osm";
export declare const addOsmSource: (map: maplibregl.Map) => string;
export declare const addOsmLayer: (map: maplibregl.Map, layerName: OsmLayerNameType, spriteName: string) => string[];
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
export declare const addOsmSprite: (map: maplibregl.Map, spriteName: {
    [key: string]: string;
}, spriteList: {
    [key: string]: string;
}) => void;
/**
 * 指定レイヤーのicon-imageプロパティだけを更新する
 * @param map GeoloniaMapインスタンス
 * @param layerId OsmLayerNameType（またはレイヤーID）
 * @param spriteKey スプライトシート名（prefixとして使う）
 */
export declare function updateSpriteSheet(map: maplibregl.Map, layerId: string, spriteKey: string): void;
/**
 * japaneseMapのkey（日本語名）のみを配列で返す
 */
export declare function getJapaneseOsmLayerNames(): string[];
