import { OsmLayerNameType } from "../types";
import { getOSMLayerConfig } from "./osmStyles";

export const OSM_SOURCE_ID = 'osm';

export const addOsmSource = (map: maplibregl.Map) => {
    if (!map.getSource(OSM_SOURCE_ID)) {
        map.addSource(OSM_SOURCE_ID, {
            type: 'vector',
            url: 'https://tileserver.geolonia.com/v3/tiles.json?key=YOUR-API-KEY'
        });
    }
}

export const addOsmLayer = (map: maplibregl.Map, layerName: OsmLayerNameType, spriteName: string) => {
    const layerId = `osm-${layerName}`;
    if (!map.getLayer(layerId)) {
        getOSMLayerConfig(layerName, spriteName).forEach(layerConfig => {
            map.addLayer(layerConfig);
        });
    }
}

export const removeOsmLayer = (map: maplibregl.Map, layerName: OsmLayerNameType) => {
    if (map.getLayer(layerName)) {
        getOSMLayerConfig(layerName, '').forEach(layerConfig => {
            map.removeLayer(layerConfig.id);
        });
    }
}

/**
 * 任意の文字列をOsmLayerNameTypeに変換する
 * @param name 任意のレイヤー名（日本語・英語どちらも可）
 * @returns OsmLayerNameType | undefined
 */
export function toOsmLayerNameType(name: string): OsmLayerNameType | undefined {
    const map: Record<string, OsmLayerNameType> = {
        'restaurant': 'restaurant',
        'レストラン': 'restaurant',
        'railway': 'railway',
        '鉄道': 'railway',
        'mountain': 'mountain',
        '山': 'mountain',
        'airport': 'airport',
        '空港': 'airport',
        'school': 'school',
        '学校': 'school',
        'college': 'college',
        '大学': 'college',
        'convenience': 'convenience',
        'コンビニ': 'convenience',
        'bank': 'bank',
        '銀行': 'bank',
        'hospital': 'hospital',
        '病院': 'hospital',
        'cafe': 'cafe',
        'カフェ': 'cafe',
        'fast-food': 'fast-food',
        'ファストフード': 'fast-food',
        'zoo': 'zoo',
        '動物園': 'zoo',
        'parking': 'parking',
        '駐車場': 'parking',
        'castle': 'castle',
        '城': 'castle',
        'museum': 'museum',
        '博物館': 'museum'
    };
    return map[name];
}

/**
 * スタイルに該当のスプライトがなければ追加する
 * @param map maplibregl.Mapインスタンス
 * @param layerName OsmLayerNameType
 */
export const addOsmSprite = (map: maplibregl.Map, spriteName: { [key: string]: string }, spriteList: { [key: string]: string }) => {
    const style = map.getStyle();
    const spriteKey = Object.keys(spriteName)[0];
    const spriteUrl = Object.values(spriteName)[0];

    // spriteが未設定ならosmのみ追加
    if (!style || !style.sprite) {
        map.setStyle({
            ...style,
            sprite: [{ id: spriteKey, url: spriteUrl }]
        });
        return;
    }

    // spriteがオブジェクトで、指定したスプライトシートがなければ追加
    if (typeof style.sprite === "object" && style.sprite !== null) {
        const sprites: any[] = Array.isArray(style.sprite) ? style.sprite : [style.sprite];
        const hasOsm = sprites.some(s => s.url === spriteUrl);
        
        if (!hasOsm) {
            const newSprites = [...sprites, { id: spriteKey, url: spriteUrl }];
            map.setStyle({
                ...style,
                sprite: newSprites
            });
        }
        return;
    }

    // spriteがstringだった場合、defaultと渡された spriteを配列で設定
    if (typeof style.sprite === "string" && style.sprite !== spriteUrl) {
        const currentSpriteIndex = Object.values(spriteList).findIndex(url => url === style.sprite);
        const currentSpriteKey = currentSpriteIndex === -1 ? "default" : Object.keys(spriteList)[currentSpriteIndex];
        const newSprites = [{ id: currentSpriteKey, url: style.sprite }];

        // currentSpriteKeyとspriteKeyが違う場合のみ追加
        if (currentSpriteKey !== spriteKey) {
            newSprites.push({ id: spriteKey, url: spriteUrl });
        }
        
        map.setStyle({
            ...style,
            sprite: newSprites
        });
        return;
    }

    // spriteがstringだった場合、URLが同じだったら、指定のspriteシート名で更新
    if (typeof style.sprite === "string" && style.sprite === spriteUrl) {
        map.setStyle({
            ...style,
            sprite: [{ id: spriteKey, url: spriteUrl }]
        });
    }
};
