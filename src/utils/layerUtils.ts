import { createLayersByGeometryTypes } from './createLayer';
import { hasLayer, updateLayer } from './mapUtils';

/**
 * geometryTypes・className・simpleStyleからレイヤーを作成し、マップに追加または更新する
 * @param map maplibregl.Mapインスタンス
 * @param className レイヤーID
 * @param geometryTypes geometryTypeの配列
 * @param simpleStyle スタイル情報（任意）
 */
export function addOrUpdateLayers(
    map: maplibregl.Map,
    className: string,
    geometryTypes: string[],
    simpleStyle?: { [key: string]: any }
) {
    const layers = createLayersByGeometryTypes(className, geometryTypes, simpleStyle);
    const hasLayerFlg = hasLayer(map, className);
    layers.forEach(layer => {
        if (hasLayerFlg) {
            updateLayer(map, layer);
        } else {
            map.addLayer(layer);
        }
    });
}
