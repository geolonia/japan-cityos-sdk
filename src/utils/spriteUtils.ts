
/**
 * 指定のスプライトシートに指定アイコン名が存在するかどうかを確認する
 * @param spriteSheetUrl スプライトシートのURL（例: https://geolonia.github.io/chizubouken-lab-sprite/sprite）
 * @param iconName アイコン名（例: "pin"）
 * @returns Promise<boolean>
 */
export async function existsSpriteIcon(spriteSheetUrl: string, iconName: string): Promise<boolean> {
  try {
    // スプライトJSONのURLを生成（@2x対応も考慮）
    const jsonUrl = spriteSheetUrl.endsWith('.json')
      ? spriteSheetUrl
      : spriteSheetUrl + '.json';

    const res = await fetch(jsonUrl);
    if (!res.ok) { return false; }
    const spriteJson = await res.json();
    // アイコン名が存在するかチェック
    return Object.prototype.hasOwnProperty.call(spriteJson, iconName);
  } catch {
    return false;
  }
}
