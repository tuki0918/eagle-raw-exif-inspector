/**
 * フィールド名を表示用にフォーマットする関数
 * 配列インデックスの場合は[0]形式で表示し、通常のキーはドット区切りで表示
 *
 * @param key - フィールドのキー（配列の場合は数値文字列）
 * @param parent - 親フィールド名（空文字列の場合はルートレベル）
 * @returns フォーマットされたフィールド名
 *
 * @example
 * formatFieldName("0", "xxx") // "xxx[0]"
 * formatFieldName("title", "xxx") // "xxx.title"
 * formatFieldName("0", "") // "[0]"
 * formatFieldName("title", "") // "title"
 */
export const formatFieldName = (key: string, parent: string): string => {
  // 数値のキー（配列インデックス）の場合は[0]形式で表示
  if (/^\d+$/.test(key)) {
    return parent ? `${parent}[${key}]` : `[${key}]`;
  }
  return parent ? `${parent}.${key}` : key;
};
