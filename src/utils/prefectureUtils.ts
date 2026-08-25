/**
 * 都道府県座標ユーティリティ
 *
 * scratch (chizubouken-lab-scratch) の prefecture-anchor.js および
 * draw-prefecture-line.js から移植。
 */

import { normalize } from '@geolonia/normalize-japanese-addresses';

/** アンカー種別: 中心座標 */
export const PREFECTURE_ANCHOR_CENTER = 'center';

/** アンカー種別: 県庁所在地 */
export const PREFECTURE_ANCHOR_CAPITAL = 'capital';

/** アンカー種別 */
export type PrefectureAnchor = typeof PREFECTURE_ANCHOR_CENTER | typeof PREFECTURE_ANCHOR_CAPITAL;

/**
 * 都道府県 → 県庁所在地（東京都は都庁所在地の新宿区）。
 * 都道府県名からの機械的な導出では「北海道→札幌市」「愛知県→名古屋市」の
 * ように一致しない県が多いため、明示的に持つ。
 */
const PREFECTURE_CAPITALS: Record<string, string> = {
  '北海道': '札幌市',
  '青森県': '青森市',
  '岩手県': '盛岡市',
  '宮城県': '仙台市',
  '秋田県': '秋田市',
  '山形県': '山形市',
  '福島県': '福島市',
  '茨城県': '水戸市',
  '栃木県': '宇都宮市',
  '群馬県': '前橋市',
  '埼玉県': 'さいたま市',
  '千葉県': '千葉市',
  '東京都': '新宿区',
  '神奈川県': '横浜市',
  '新潟県': '新潟市',
  '富山県': '富山市',
  '石川県': '金沢市',
  '福井県': '福井市',
  '山梨県': '甲府市',
  '長野県': '長野市',
  '岐阜県': '岐阜市',
  '静岡県': '静岡市',
  '愛知県': '名古屋市',
  '三重県': '津市',
  '滋賀県': '大津市',
  '京都府': '京都市',
  '大阪府': '大阪市',
  '兵庫県': '神戸市',
  '奈良県': '奈良市',
  '和歌山県': '和歌山市',
  '鳥取県': '鳥取市',
  '島根県': '松江市',
  '岡山県': '岡山市',
  '広島県': '広島市',
  '山口県': '山口市',
  '徳島県': '徳島市',
  '香川県': '高松市',
  '愛媛県': '松山市',
  '高知県': '高知市',
  '福岡県': '福岡市',
  '佐賀県': '佐賀市',
  '長崎県': '長崎市',
  '熊本県': '熊本市',
  '大分県': '大分市',
  '宮崎県': '宮崎市',
  '鹿児島県': '鹿児島市',
  '沖縄県': '那覇市',
};

/**
 * 都道府県名からアンカー座標（中心 or 県庁所在地）を取得する。
 * @param prefName 都道府県名（例: "東京都", "北海道"）
 * @param anchor アンカー種別（"center" または "capital"、デフォルト: "center"）
 * @returns 座標 [lng, lat]、取得できない場合は null
 */
export const getPrefectureAnchor = async (
  prefName: string,
  anchor: PrefectureAnchor = PREFECTURE_ANCHOR_CENTER,
): Promise<[number, number] | null> => {
  try {
    // @geolonia/normalize-japanese-addresses を使用して都道府県情報を取得
    const result = await normalize(prefName);

    if (!result || !result.pref) {
      console.warn(`都道府県 "${prefName}" が見つかりません`);
      return null;
    }

    // アンカー種別に応じて座標を取得
    if (anchor === PREFECTURE_ANCHOR_CAPITAL) {
      const capitalName = PREFECTURE_CAPITALS[result.pref];
      if (capitalName) {
        const capitalResult = await normalize(`${result.pref}${capitalName}`);

        if (capitalResult && capitalResult.point && capitalResult.point.lat && capitalResult.point.lng) {
          return [capitalResult.point.lng, capitalResult.point.lat];
        }
      } else {
        console.warn(`都道府県 "${result.pref}" の県庁所在地が不明です`);
      }
    }

    // 中心座標（デフォルト）または県庁所在地が取得できなかった場合
    if (result.point && result.point.lat && result.point.lng) {
      return [result.point.lng, result.point.lat];
    }

    console.warn(`都道府県 "${prefName}" の座標を取得できません`);
    return null;
  } catch (error) {
    console.error(`都道府県座標の取得に失敗: ${prefName}`, error);
    return null;
  }
};

/**
 * 2地点座標から LineString GeoJSON FeatureCollection を生成する。
 * @param from 始点座標 [lng, lat]
 * @param to 終点座標 [lng, lat]
 * @param properties 追加するプロパティ（オプション）
 * @returns LineString GeoJSON FeatureCollection
 */
export const buildPrefectureLineFeature = (
  from: [number, number],
  to: [number, number],
  properties: Record<string, any> = {},
): GeoJSON.FeatureCollection<GeoJSON.LineString> => {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [from, to],
        },
        properties,
      },
    ],
  };
};

/**
 * 安定なレイヤー識別子を生成する。
 * 再実行時に同じレイヤー名が生成されるため、上書き更新が可能。
 * @param prefFrom 始点都道府県名
 * @param pointFrom 始点アンカー種別
 * @param prefTo 終点都道府県名
 * @param pointTo 終点アンカー種別
 * @returns レイヤー識別子（例: "line-東京-center-大阪-capital"）
 */
export const buildPrefectureLineLayerName = (
  prefFrom: string,
  pointFrom: PrefectureAnchor,
  prefTo: string,
  pointTo: PrefectureAnchor,
): string => {
  // 末尾の「都・府・県」のみを取り除く（「北海道」は道までが名称）
  const normalizePrefix = (name: string) => {
    return name.replace(/(都|府|県)$/u, '').toLowerCase();
  };

  const from = normalizePrefix(prefFrom);
  const to = normalizePrefix(prefTo);

  return `line-${from}-${pointFrom}-${to}-${pointTo}`;
};

/**
 * 2つの都道府県間の LineString を生成する（便利関数）。
 * @param prefFrom 始点都道府県名
 * @param anchorFrom 始点アンカー種別（デフォルト: "center"）
 * @param prefTo 終点都道府県名
 * @param anchorTo 終点アンカー種別（デフォルト: "center"）
 * @returns LineString GeoJSON FeatureCollection、座標取得失敗時は null
 */
export const buildPrefectureLine = async (
  prefFrom: string,
  anchorFrom: PrefectureAnchor = PREFECTURE_ANCHOR_CENTER,
  prefTo: string,
  anchorTo: PrefectureAnchor = PREFECTURE_ANCHOR_CENTER,
): Promise<{
  geojson: GeoJSON.FeatureCollection<GeoJSON.LineString>;
  layerName: string;
} | null> => {
  const from = await getPrefectureAnchor(prefFrom, anchorFrom);
  const to = await getPrefectureAnchor(prefTo, anchorTo);

  if (!from || !to) {
    return null;
  }

  const geojson = buildPrefectureLineFeature(from, to, {
    prefFrom,
    anchorFrom,
    prefTo,
    anchorTo,
  });

  const layerName = buildPrefectureLineLayerName(prefFrom, anchorFrom, prefTo, anchorTo);

  return { geojson, layerName };
};
