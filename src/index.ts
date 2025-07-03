import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { createLayer, createSourceByType, csvToGeoJSON, mergeLayersByLoadedIds, mergeSourcesByLoadedIds, parseApiKey } from './utils';
import Papa from 'papaparse';


import style from './style.json'

declare global {
  interface Window {
    geolonia: any;
  }
}
	
class GeoloniaMap extends maplibregl.Map {

  private loadedSourceIds: Set<string> = new Set();

  constructor(params: any) {
    const defaults = {
      container: params.container ?? 'map',
      style: params.style ?? style,
      center: params.lngLat ?? [139.692, 35.689],
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
  loadData(className: string, simpleStyle: { [key: string]: any } | undefined | null) {
    const layers = createLayer(className, {
      simpleStyle: simpleStyle,
      filter: ['==', 'class', className]
    });
    layers.forEach(layer => { this.addLayer(layer, 'poi'); });
  }

  /* ****************
   * csvを読み込んでレイヤーを追加する
   * @param csv CSV文字列
   * @param className クラス名
   * @param paint layerのpaintプロパティ
   * @param layout layerのlayoutプロパティ
   * @description
   *   指定したクラス名のレイヤーを追加します。
   * ****************/
  async loadCSV (url: string, className: string, simpleStyle: { [key: string]: any } | undefined | null) {

    const res = await fetch(url);
    const csv = await res.text();
    const data = Papa.parse(csv, {header: true}).data

    const geojson = csvToGeoJSON(data);
    this.addSource(className, createSourceByType('geojson', geojson));
    const layers = createLayer(className, {
      simpleStyle: simpleStyle
    });
    layers.forEach(layer => { 
      this.addLayer(layer); 
    });

    this.loadedSourceIds.add(className);
  }

  /* ****************
   * geojsonを読み込んでレイヤーを追加する
   * @param csv CSV文字列
   * @param className クラス名
   * @param paint layerのpaintプロパティ
   * @param layout layerのlayoutプロパティ
   * @description
   *   指定したクラス名のレイヤーを追加します。
   * ****************/
  async loadGeojson (geojson: string | GeoJSON.FeatureCollection, className: string, simpleStyle: { [key: string]: any } | undefined | null) {

    this.addSource(className, createSourceByType('geojson', geojson));

    const layers = createLayer(className, {
      simpleStyle: simpleStyle
    });
    layers.forEach(layer => { this.addLayer(layer); });

    this.loadedSourceIds.add(className);
  }

  /****************
   * 背景地図のスタイルを切り替える
   * @param styleUrlOrObject スタイルのURLまたはオブジェクト
   ****************/
  setBaseMapStyle(styleUrlOrObject: string | maplibregl.StyleSpecification) {
    this.setStyle(styleUrlOrObject, {
      transformStyle: (previousStyle, nextStyle) => {
        const newSources = mergeSourcesByLoadedIds(previousStyle.sources, nextStyle.sources, this.loadedSourceIds);
        const newLayers = mergeLayersByLoadedIds(previousStyle.layers, nextStyle.layers, this.loadedSourceIds);
        return {
          ...previousStyle,
          ...nextStyle,
          sources: newSources,
          layers: newLayers
        };
      }
    });
  }

}

const currentScript = document.currentScript as HTMLScriptElement;

window.geolonia = {}
window.geolonia.apiKey = parseApiKey(currentScript);
window.geolonia.japan = maplibregl;
window.geolonia.japan.Map = GeoloniaMap;
window.geolonia.japan.Popup = maplibregl.Popup;
