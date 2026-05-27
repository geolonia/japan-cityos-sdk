# データソース

Japan Maps SDK が提供する公共データソースの一覧と詳細。

---

## OSM POI（OpenStreetMap 地物）

OpenStreetMap のベクタータイルから特定の POI カテゴリを表示する。

### 利用方法

```javascript
// POI レイヤーを表示
map.loadOsmPoi('restaurant', 'chizubouken-lab');

// POI レイヤーを非表示
map.removeOsmPoi('restaurant');

// 利用可能な種別一覧を取得
const layers = geolonia.japan.Map.getOsmPoiLayers();
```

### 対応 POI 種別

| 英語名 | 日本語名 | 説明 |
|--------|----------|------|
| `restaurant` | レストラン | 飲食店 |
| `cafe` | カフェ | カフェ・喫茶店 |
| `fast-food` | ファストフード | ファストフード店 |
| `convenience` | コンビニ | コンビニエンスストア |
| `bank` | 銀行 | 銀行・ATM |
| `hospital` | 病院 | 病院・診療所 |
| `school` | 学校 | 小中高等学校 |
| `college` | 大学 | 大学・専門学校 |
| `railway` | 鉄道駅 | 鉄道路線・駅 |
| `airport` | 空港 | 空港 |
| `mountain` | 山 | 山・峰 |
| `zoo` | 動物園 | 動物園 |
| `parking` | 駐車場 | 駐車場 |
| `castle` | 城 | 城・城跡 |
| `museum` | 博物館 | 博物館・美術館 |
| `park` | 公園 | 公園 |

### スプライトシート

POI アイコンの表示には以下のスプライトシートが利用可能。

| キー | 用途 |
|------|------|
| `chizubouken-lab` | 地図ぼうけんラボ用アイコンセット |
| `mapfan` | MapFan DB 用アイコンセット |
| `smartmap` | スマートマップ用アイコンセット |
| `basic` | Geolonia Basic スタイルのアイコン |

---

## ハザードマップ

国土交通省等が提供する防災関連のラスタータイルデータ。

### 利用方法

```javascript
// ハザードマップを表示
map.loadHazardMapData('flood');

// ハザードマップを非表示
map.removeHazardMapData('flood');

// 利用可能なハザードマップ一覧を取得
const hazardMaps = geolonia.japan.Map.getHazardMapData();
```

### 対応ハザードマップ種別

洪水浸水想定、高潮浸水想定、津波浸水想定、土砂災害警戒区域、雪崩危険区域など 12 種類。詳細は `getHazardMapData()` の戻り値で確認可能。

---

## 国土数値情報（NLNI）

国土交通省が提供する国土数値情報のベクタータイルデータ。

### 利用方法

```javascript
// NLNI データを表示
map.loadNLNIData('school');

// NLNI データを非表示
map.removeNLNIData('school');

// 利用可能なデータ一覧を取得
const nlniData = geolonia.japan.Map.getNLNIData();
```

### 対応データ種別

| 種別 | 説明 |
|------|------|
| 小学校区 | 小学校の学区境界 |
| 中学校区 | 中学校の学区境界 |
| 学校 | 学校の位置情報 |
| 医療機関 | 病院・診療所の位置情報 |
| 人口推計 | メッシュ別人口推計 |
| 駅乗降客数 | 鉄道駅の乗降客数 |
| 市区町村役場 | 市区町村役場の位置情報 |
| 盛土地図 | 盛土箇所の分布 |

---

## 鳥取県スマートシティデータ

鳥取県スマートシティプロジェクトが提供する各種地理空間データ。ラスタータイルとベクタータイルの両形式に対応。

### 利用方法

```javascript
// データ一覧を取得
const tottoriData = await geolonia.japan.Map.getTottoriData();

// データを表示
map.loadTottoriData('data-id');

// データを非表示
map.removeTottoriData('data-id');
```

データの一覧は外部の `index.json` から動的に取得される。各エントリは以下の情報を持つ:

```typescript
type TottoriDataEntry = {
  id: string;          // データ ID
  tileUrl: string;     // タイル URL
  styleUrl: string;    // スタイル URL
  geojsonUrl?: string; // GeoJSON URL（任意）
  description: string; // 説明
};
```

---

## 行政区域データ

日本の都道府県・市区町村の行政区域境界 GeoJSON データ。

### 利用方法

```javascript
import {
  fetchPrefectureGeojson,
  fetchMunicipalityGeojson,
} from './utils/japaneseAdminsUtils';

// 都道府県 GeoJSON（2桁の都道府県コード）
const pref = await fetchPrefectureGeojson('13'); // 東京都

// 市区町村 GeoJSON（5桁の行政区域コード）
const city = await fetchMunicipalityGeojson('13101'); // 千代田区
```

---

## 背景地図スタイル

### 利用方法

```javascript
// スタイルを切り替え
map.setBaseMapStyle(geolonia.japan.Map.baseMapStyleUrl['basic']);

// 利用可能なスタイル一覧
const styles = geolonia.japan.Map.getBaseMapStyles();
```

### 利用可能なスタイル

| キー | 説明 |
|------|------|
| `basic` | Geolonia 標準スタイル |
| `hakuchizu` | 白地図 |
| `hakuchizu-nolabel` | 白地図（ラベルなし） |
| `hakuchizu-notext` | 白地図（テキストなし） |

デモページではさらに標準、国土地理院スマートマップ、衛星写真、ゲーム風スタイルを選択可能。
