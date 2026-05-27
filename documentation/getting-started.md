# Getting Started

## CDN での利用

HTML に以下の script タグを追加する。`YOUR-API-KEY` は [Geolonia](https://geolonia.com/) で発行した API キーに置き換える。

```html
<script src="https://geolonia.github.io/japan-cityos-sdk/index.js?api-key=YOUR-API-KEY"></script>
```

## 地図の作成

```html
<div id="map" style="width: 100%; height: 400px;"></div>

<script>
const map = new geolonia.japan.Map({
  container: 'map',
  lngLat: [139.6917, 35.6895],
  zoom: 12,
});
</script>
```

### コンストラクタオプション

| パラメータ | 型 | 説明 |
|-----------|------|------|
| `container` | `string` | 地図を描画する要素の ID（省略時は `'map'`） |
| `lngLat` | `[number, number]` | 初期表示の中心座標 `[経度, 緯度]` |
| `zoom` | `number` | 初期ズームレベル |
| `hash` | `boolean` | URL ハッシュに座標・ズームを同期するか |
| `style` | `string` | 背景地図スタイルの URL |

## CSV データの読み込み

CSV ファイルから地図上にマーカーを表示する。CSV には緯度・経度カラムが必要（`lat`/`lng`、`latitude`/`longitude` などを自動検出）。

```javascript
const url = 'https://example.com/data.csv';
map.loadCSV(url, 'layer-name', {
  'marker-color': '#eba037',
});
```

## GeoJSON データの読み込み

```javascript
map.loadGeojson(geojsonData, 'layer-name', {
  'marker-symbol': 'chizubouken-lab:cafe',
  'marker-size': 'large',
  'title': ['get', 'name'],
});
```

## データの削除

```javascript
map.removeGeojsonLayer('layer-name');
```

## グローバル API

CDN 経由で読み込んだ場合、以下のグローバルオブジェクトが使用可能。

```javascript
window.geolonia.japan.Map       // GeoloniaMap クラス
window.geolonia.japan.Popup     // maplibregl.Popup
window.geolonia.japan.Marker    // maplibregl.Marker
window.geolonia.japan.geometry  // 地理座標計算ユーティリティ
window.geolonia.API_KEY         // script タグから取得した API キー
```

## デモページ

[https://geolonia.github.io/japan-cityos-sdk/](https://geolonia.github.io/japan-cityos-sdk/)

デモページでは以下の機能を試すことができる:

- 背景地図の切り替え
- 都道府県・市区町村の選択による地図移動
- OSM POI レイヤーの表示
- ハザードマップの重畳表示
- 国土数値情報データの表示
- 3D 地形表示
- 標高取得
- レイヤースタイルの動的変更
