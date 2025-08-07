/**
 * 指定のスプライトシートに含まれるアイコン名一覧を取得する
 * @param spriteSheetUrl スプライトシートのURL（例: https://geolonia.github.io/chizubouken-lab-sprite/sprite）
 * @returns Promise<string[]> アイコン名の配列
 */
export declare function getSpriteIconNames(spriteSheetUrl: string): Promise<string[]>;
/**
 * 指定のスプライトシートに指定アイコン名が存在するかどうかを確認する
 * @param spriteSheetUrl スプライトシートのURL（例: https://geolonia.github.io/chizubouken-lab-sprite/sprite）
 * @param iconName アイコン名（例: "pin"）
 * @returns Promise<boolean>
 */
export declare function existsSpriteIcon(spriteSheetUrl: string, iconName: string): Promise<boolean>;
