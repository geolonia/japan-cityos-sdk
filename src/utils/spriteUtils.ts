
/**
 * スプライトシートのJSONデータを取得する
 * @param spriteSheetUrl スプライトシートのURL
 * @returns Promise<any|null> JSONオブジェクトまたはnull
 */
export async function getSpriteSheetJson(spriteSheetUrl: string): Promise<any|null> {
  try {
    const jsonUrl = spriteSheetUrl.endsWith('.json')
      ? spriteSheetUrl
      : spriteSheetUrl + '.json';
    const res = await fetch(jsonUrl);
    if (!res.ok) { return null; }
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * 指定のスプライトシートに含まれるアイコン名一覧を取得する
 * @param spriteSheetUrl スプライトシートのURL（例: https://geolonia.github.io/chizubouken-lab-sprite/sprite）
 * @returns Promise<string[]> アイコン名の配列
 */
export async function getSpriteIconNames(spriteSheetUrl: string): Promise<string[]> {
  const spriteJson = await getSpriteSheetJson(spriteSheetUrl);
  if (!spriteJson) return [];
  return Object.keys(spriteJson);
}

/**
 * スプライトシートの各アイコンに対応するスタイル情報一覧を返す
 * @param spriteSheetUrl スプライトシートのURL（例: https://geolonia.github.io/custom-smartmap-sprite/sprite）
 * @returns Promise<{ width: string, height: string, backgroundImage: string, backgroundPosition: string }[]>
 */
export async function getSpriteIconStyles(spriteSheetUrl: string): Promise<{
  width: string;
  height: string;
  backgroundImage: string;
  backgroundPosition: string;
}[]> {
  const spriteJson = await getSpriteSheetJson(spriteSheetUrl);
  if (!spriteJson) return [];
  const pngUrl = spriteSheetUrl.endsWith('.json')
    ? spriteSheetUrl.replace(/\.json$/, '.png')
    : spriteSheetUrl + '.png';
  return Object.values(spriteJson).map((spriteInfo: any) => ({
    width: `${spriteInfo.width}px`,
    height: `${spriteInfo.height}px`,
    backgroundImage: `url('${pngUrl}')`,
    backgroundPosition: `-${spriteInfo.x}px -${spriteInfo.y}px`
  }));
}

/**
 * 指定のスプライトシートに指定アイコン名が存在するかどうかを確認する
 * @param spriteSheetUrl スプライトシートのURL（例: https://geolonia.github.io/chizubouken-lab-sprite/sprite）
 * @param iconName アイコン名（例: "pin"）
 * @returns Promise<boolean>
 */
export async function existsSpriteIcon(spriteSheetUrl: string, iconName: string): Promise<boolean> {
  const iconNames = await getSpriteIconNames(spriteSheetUrl);
  return iconNames.includes(iconName);
}
