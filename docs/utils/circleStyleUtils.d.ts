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
 * 指定した Circle レイヤーの描画スタイルを変更する
 * @param map maplibregl.Map インスタンス
 * @param className レイヤーID（className）
 * @param style 変更するスタイルオプション
 */
export declare function setCircleStyle(map: maplibregl.Map, className: string, style: CircleStyleOptions): void;
