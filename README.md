# Japan Maps SDK

https://geolonia.github.io/japan-cityos-sdk/index.js

地図を表示する
```
const japanMap = new geolonia.japan.Map({
    container: 'map',
    lngLat: [],
    zoom: 12,
})
```

CSVデータを読み込む
> japanMap.loadCSV(url, sourceName, simpleStyleObject)
```
const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSv5OOG_biAGX5Q2XXrBPEtfthDNmFFtwPd50wCRON4aphbQMPHUWXtvzZ7UUjOFGhmNSv3h_jE-tyu/pub?gid=2058114753&single=true&output=csv'
japanMap.loadCSV(url, '選挙時投票所一覧', {
    'marker-color': '#eba037'
});
```

GeoJsonデータを読み込む
> japanMap.loadGeojson(geojson, sourceName, simpleStyleObject)
```
japanMap.loadGeojson(geojson, 'restaurant', {
    'marker-symbol': 'marker:restaurant',
    'marker-size': 'large',
});
```

## 行政区画境界データの表示

日本の市区町村の境界データ（[Geolonia japanese-admins](https://github.com/geolonia/japanese-admins)）を地図上に表示できます。

### 基本的な使い方

```javascript
import { fetchAdminBoundary, addAdminBoundarySource, addAdminBoundaryLayer } from './index.js';

// 市区町村コード（5桁）で境界データを取得
const geojson = await fetchAdminBoundary('13101'); // 東京都千代田区

if (geojson) {
  // ソースを追加
  addAdminBoundarySource(map, '13101', geojson);

  // レイヤーを追加（デフォルトスタイル）
  addAdminBoundaryLayer(map, '13101');
}
```

### スタイルのカスタマイズ

境界の色、透明度、線の太さをカスタマイズできます。

```javascript
// カスタムスタイルで表示
addAdminBoundaryLayer(map, '13101', {
  fillColor: '#ff0000',      // 塗りつぶしの色
  fillOpacity: 0.3,          // 塗りつぶしの透明度（0〜1）
  lineColor: '#ff0000',      // 境界線の色
  lineWidth: 3,              // 境界線の太さ
  lineOpacity: 1             // 境界線の透明度（0〜1）
});
```

### レイヤーの削除

```javascript
import { removeAdminBoundaryLayer } from './index.js';

// レイヤーを削除
removeAdminBoundaryLayer(map, '13101');
```

### 市区町村コードについて

市区町村コードは5桁の数字で指定します。

- 例: `01101` - 北海道札幌市中央区
- 例: `13101` - 東京都千代田区
- 例: `27127` - 大阪府大阪市北区
- 例: `40131` - 福岡県福岡市中央区

市区町村コードは[総務省の全国地方公共団体コード](https://www.soumu.go.jp/denshijiti/code.html)に準拠しています。

### デモページ

行政区画境界表示機能の動作例は[デモページ](./admin-boundary-demo.html)で確認できます。
