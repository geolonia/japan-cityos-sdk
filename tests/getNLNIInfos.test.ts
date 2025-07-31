import { getNLNIInfos } from '../src/utils/nationalLandNumericalInformationUtils';

describe('getNLNIInfos', () => {
  it('指定したキーの出典文言（日本語）を返す', () => {
    const keys = [
      "小学校区",
      "中学校区"
    ];
    const result = getNLNIInfos(keys);
    expect(result.length).toBe(2);
    expect(result[0]).toMatch(/^出典：国土交通省国土数値情報ダウンロードサイト/);
    expect(result[0]).toContain('https://nlftp.mlit.go.jp/ksj/gml/datalist/');
    expect(result[1]).toMatch(/^出典：国土交通省国土数値情報ダウンロードサイト/);
  });

  it('存在しないキーは無視される', () => {
    const keys = [
      "小学校区",
      "存在しないキー"
    ];
    const result = getNLNIInfos(keys);
    expect(result.length).toBe(1);
    expect(result[0]).toContain('出典：国土交通省国土数値情報ダウンロードサイト（https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A27-2023.html）');
  });

  it('空配列を渡すと空配列が返る', () => {
    expect(getNLNIInfos([])).toEqual([]);
  });
});
