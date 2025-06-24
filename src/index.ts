import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { parseApiKey } from './utils';

import style from './style.json'

declare global {
  interface Window {
    geolonia: any;
  }
}

class GeoloniaMap extends maplibregl.Map {

  constructor(params: any) {
    const defaults = {
      container: 'map',
      style: style,
      center: params.lngLat ?? [134.04654783784918, 34.34283588989655],
      zoom: params.zoom ?? 12,
      transformRequest: (url: string, resourceType: string) => {
        if (!window.geolonia.apiKey) { return { url }; }
        if ((resourceType === 'Tile' || resourceType === 'Source') && url.startsWith('https://tileserver.geolonia.com')) {
          const updatedUrl = url.replace('YOUR-API-KEY', window.geolonia.apiKey);
          return { url: updatedUrl };
        }
        return { url };
      }
    }

    super({...defaults, ...params});
  }

  /* ****************
   * レイヤーを追加する
   * @param className クラス名
   * @param paint layerのpaintプロパティ
   * @param layout layerのlayoutプロパティ
   * @description
   *   指定したクラス名のレイヤーを追加します。
   * ****************/
  loadData(className: string, paint: any | undefined | null, layout: any | undefined | null) {
    const paintDefault = {
      'fill-color': '#FF0000',
      'fill-opacity': 0.2
    }

    this.addLayer({
      id: className,
      type: 'fill',
      source: 'Geolonia',
      'source-layer': 'main',
      paint: {...paintDefault, ...paint},
      "filter": [
        "all",
        [
          "==",
          "class",
          className
        ],
      ],
    }, 'poi');
  }

}

const currentScript = document.currentScript as HTMLScriptElement;

window.geolonia = {}
window.geolonia.apiKey = parseApiKey(currentScript);
window.geolonia.japan = maplibregl;
window.geolonia.japan.Map = GeoloniaMap;
window.geolonia.japan.Popup = maplibregl.Popup;
