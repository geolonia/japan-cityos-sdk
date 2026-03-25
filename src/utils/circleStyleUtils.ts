import maplibregl from 'maplibre-gl';

/**
 * Circle レイヤーのスタイルオプション
 */
export interface CircleStyleOptions {
  /** 塗りつぶし色 */
  color?: string;
  /** 半径 */
  radius?: number;
  /** 線色 */
  strokeColor?: string;
  /** 線太さ */
  strokeWidth?: number;
  /** 塗りつぶし透明度 */
  opacity?: number;
}

/**
 * CircleStyleOptions のキーと MapLibre paint プロパティ名のマッピング
 */
const STYLE_PROPERTY_MAP: Record<keyof CircleStyleOptions, string> = {
  color: 'circle-color',
  radius: 'circle-radius',
  strokeColor: 'circle-stroke-color',
  strokeWidth: 'circle-stroke-width',
  opacity: 'circle-opacity',
};

/**
 * 指定した Circle レイヤーの描画スタイルを変更する
 * @param map maplibregl.Map インスタンス
 * @param className レイヤーID（className）
 * @param style 変更するスタイルオプション
 */
export function setCircleStyle(
  map: maplibregl.Map,
  className: string,
  style: CircleStyleOptions
): void {
  const layer = map.getLayer(className);
  if (!layer) return;

  for (const [key, paintProperty] of Object.entries(STYLE_PROPERTY_MAP)) {
    const value = style[key as keyof CircleStyleOptions];
    if (value !== undefined) {
      try {
        map.setPaintProperty(className, paintProperty, value);
      } catch (e) {
        // プロパティが存在しない場合は無視
      }
    }
  }
}
