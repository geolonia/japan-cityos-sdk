/**
 * 背景地図スタイルURL一覧
 */
export const baseMapStyleUrl: {[key: string]: string} = {
  'basic': 'https://basic-v1-background-only.pages.dev/style.json',
  'hakuchizu': 'https://geoloniamaps.github.io/hakuchizu-mapstyle/style.json',
  'hakuchizu-nolabel': 'https://geoloniamaps.github.io/hakuchizu-mapstyle/style-nolabel.json',
  'hakuchizu-notext': 'https://geoloniamaps.github.io/hakuchizu-mapstyle/style-notext.json',
};

/**
 * 利用可能な背景地図スタイルのキー一覧を取得する
 */
export function getBaseMapStyleKeys(): string[] {
  return Object.keys(baseMapStyleUrl);
}
