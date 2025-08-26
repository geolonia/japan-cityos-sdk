import { OsmLayerNameType } from "../types";
import { getOSMLayerConfig } from "./osmStyles";

export const OSM_SOURCE_ID = 'osm';

export const addOsmSource = (map: maplibregl.Map) => {
    if (!map.getSource(OSM_SOURCE_ID)) {
        map.addSource(OSM_SOURCE_ID, {
            type: 'vector',
            url: 'https://tileserver.geolonia.com/v3/tiles.json?key=YOUR-API-KEY'
        });
        return OSM_SOURCE_ID;
    }
}

export const addOsmLayer = (map: maplibregl.Map, layerName: OsmLayerNameType, spriteName: string): string[] => {
    const layers = getOSMLayerConfig(layerName, spriteName);
    const layerNames: string[] = [];
    layers.forEach(layer => {
        if (!map.getLayer(layer.id)) {
            map.addLayer(layer);
            layerNames.push(layer.id);
        }
    });
    return layerNames;
}

export const removeOsmLayer = (map: maplibregl.Map, layerName: OsmLayerNameType) => {
    const layers = getOSMLayerConfig(layerName, '');
    layers.forEach(layer => {
        if (map.getLayer(layer.id)) {
            map.removeLayer(layer.id);
        }
    });
}

// 日本語キーのみのマップ
const japaneseMap: Record<string, OsmLayerNameType> = {
    'レストラン': 'restaurant',
    '鉄道': 'railway',
    '山': 'mountain',
    '空港': 'airport',
    '学校': 'school',
    '大学': 'college',
    'コンビニ': 'convenience',
    '銀行': 'bank',
    '病院': 'hospital',
    'カフェ': 'cafe',
    'ファストフード': 'fast-food',
    '動物園': 'zoo',
    '駐車場': 'parking',
    '城': 'castle',
    '博物館': 'museum'
};

/**
 * 任意の文字列をOsmLayerNameTypeに変換する
 * @param name 任意のレイヤー名（日本語・英語どちらも可）
 * @returns OsmLayerNameType | undefined
 */
export function toOsmLayerNameType(name: string): OsmLayerNameType | undefined {
    // 日本語キーならそのまま返す
    if (japaneseMap[name]) {
        return japaneseMap[name];
    }
    // 英語が来た場合はvalueと比較
    const found = Object.entries(japaneseMap).find(([jp, en]) => en === name);
    if (found) {
        return found[1];
    }
    return undefined;
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

/**
 * 指定レイヤーのicon-imageプロパティだけを更新する
 * @param map GeoloniaMapインスタンス
 * @param layerId OsmLayerNameType（またはレイヤーID）
 * @param spriteKey スプライトシート名（prefixとして使う）
 */
export function updateSpriteSheet(map: maplibregl.Map, layerId: string, spriteKey: string) {
  // レイヤーIDに一致するレイヤーを取得
  const layers = map.getStyle().layers;
  layers.forEach(layer => {
    if (layer.id === `osm-${layerId}` || layer.id === layerId) {
      // icon-imageがexpressionの場合
      if (
        layer.layout &&
        typeof layer.layout === "object" &&
        "icon-image" in layer.layout &&
        layer.layout["icon-image"] !== undefined
      ) {
        const iconImage = (layer.layout as {["icon-image"]?: unknown})["icon-image"];
        // ["concat", oldSpriteKey, ":", iconName] の場合
        if (Array.isArray(iconImage) && iconImage[0] === "concat") {
          // spriteKeyを新しいものに置き換え
          iconImage[1] = spriteKey;
          map.setLayoutProperty(layer.id, 'icon-image', iconImage);
        }
        // 文字列の場合（"oldSpriteKey:iconName"）
        if (typeof iconImage === "string") {
          const parts = iconImage.split(':');
          if (parts.length === 2) {
            map.setLayoutProperty(layer.id, 'icon-image', `${spriteKey}:${parts[1]}`);
          }
        }
      }
    }
  });
}

/**
 * japaneseMapのkey（日本語名）のみを配列で返す
 */
export function getJapaneseOsmLayerNames(): string[] {
    return Object.keys(japaneseMap);
}
