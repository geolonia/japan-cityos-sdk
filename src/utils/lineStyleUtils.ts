import maplibregl from 'maplibre-gl';

/**
 * Line レイヤーのスタイルオプション
 */
export interface LineStyleOptions {
  /** 線の色 */
  color?: string;
  /** 線の幅 */
  width?: number;
  /** 線の透過度 (0-1) */
  opacity?: number;
}

/**
 * LineStyleOptions のキーと MapLibre paint プロパティ名のマッピング
 */
const STYLE_PROPERTY_MAP: Record<keyof LineStyleOptions, string> = {
  color: 'line-color',
  width: 'line-width',
  opacity: 'line-opacity',
};

/**
 * 指定した Line レイヤーの描画スタイルを変更する
 * @param map maplibregl.Map インスタンス
 * @param className レイヤーのクラス名（レイヤーIDは `${className}-line`）
 * @param style 変更するスタイルオプション
 */
export function setLineStyle(
  map: maplibregl.Map,
  className: string,
  style: LineStyleOptions
): void {
  if (style == null) return;

  const layerId = `${className}-line`;
  const layer = map.getLayer(layerId);
  if (!layer) return;

  for (const [key, paintProperty] of Object.entries(STYLE_PROPERTY_MAP)) {
    const value = style[key as keyof LineStyleOptions];
    if (value !== undefined) {
      try {
        map.setPaintProperty(layerId, paintProperty, value);
      } catch (e) {
        // プロパティが存在しない場合は無視（開発時のみログ出力）
        if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
          console.warn(`setLineStyle: Failed to set ${paintProperty} on ${layerId}`, e);
        }
      }
    }
  }
}
