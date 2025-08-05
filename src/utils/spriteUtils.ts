
/**
 * 指定のスプライトシートに含まれるアイコン名一覧を取得する
 * @param spriteSheetUrl スプライトシートのURL（例: https://geolonia.github.io/chizubouken-lab-sprite/sprite）
 * @returns Promise<string[]> アイコン名の配列
 */
export async function getSpriteIconNames(spriteSheetUrl: string): Promise<string[]> {
  try {
    const jsonUrl = spriteSheetUrl.endsWith('.json')
      ? spriteSheetUrl
      : spriteSheetUrl + '.json';

    const res = await fetch(jsonUrl);
    if (!res.ok) { return []; }
    const spriteJson = await res.json();
    return Object.keys(spriteJson);
  } catch {
    return [];
  }
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
