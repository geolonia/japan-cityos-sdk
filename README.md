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
