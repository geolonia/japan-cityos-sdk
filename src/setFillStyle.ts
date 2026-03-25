import maplibregl from 'maplibre-gl';

/**
 * Fill レイヤーのスタイルオプション
 */
export interface FillStyleOptions {
  /** 塗りつぶし色 */
  color?: string;
  /** 塗りつぶし透明度 (0-1) */
  opacity?: number;
  /** アウトライン色 */
  outlineColor?: string;
}

/**
 * 指定した className の Fill レイヤーのスタイルを変更する
 * @param map maplibregl.Map インスタンス
 * @param className レイヤーのクラス名（レイヤーIDは `${className}-polygon`）
 * @param style 変更するスタイルオプション
 */
export function setFillStyle(
  map: maplibregl.Map,
  className: string,
  style: FillStyleOptions
): void {
  const layerId = `${className}-polygon`;
  const layer = map.getLayer(layerId);
  if (!layer) return;

  if (style.color !== undefined) {
    map.setPaintProperty(layerId, 'fill-color', style.color);
  }
  if (style.opacity !== undefined) {
    map.setPaintProperty(layerId, 'fill-opacity', style.opacity);
  }
  if (style.outlineColor !== undefined) {
    map.setPaintProperty(layerId, 'fill-outline-color', style.outlineColor);
  }
}
