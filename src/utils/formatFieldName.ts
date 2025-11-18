/**
 * フィールド名を表示用にフォーマットする関数
 * 配列インデックスの場合は[0]形式で表示し、通常のキーはドット区切りで表示
 * 親フィールド名内の数値キーも[0]形式に変換する
 *
 * @param key - フィールドのキー（配列の場合は数値文字列）
 * @param parent - 親フィールド名（ドット区切りの内部形式、例："xxx.0"）
 * @returns フォーマットされたフィールド名
 *
 * @example
 * formatFieldName("0", "xxx") // "xxx[0]"
 * formatFieldName("title", "xxx") // "xxx.title"
 * formatFieldName("0", "") // "[0]"
 * formatFieldName("title", "") // "title"
 * formatFieldName("0", "xxx.0") // "xxx[0][0]"
 * formatFieldName("title", "xxx.0") // "xxx[0].title"
 */
export const formatFieldName = (key: string, parent: string): string => {
  // 親フィールド名をフォーマット（数値キーを[0]形式に変換）
  const formatParent = (parentName: string): string => {
    if (!parentName) return "";
    const parts = parentName.split(".");
    const formattedParts: string[] = [];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      // 数値のキー（配列インデックス）の場合は[0]形式で表示
      if (/^\d+$/.test(part)) {
        formattedParts.push(`[${part}]`);
      } else {
        // 通常のキーの場合、前の要素が存在する場合はドットで結合
        if (formattedParts.length > 0) {
          formattedParts.push(".");
        }
        formattedParts.push(part);
      }
    }

    return formattedParts.join("");
  };

  const formattedParent = formatParent(parent);

  // 数値のキー（配列インデックス）の場合は[0]形式で表示
  if (/^\d+$/.test(key)) {
    return formattedParent ? `${formattedParent}[${key}]` : `[${key}]`;
  }
  return formattedParent ? `${formattedParent}.${key}` : key;
};
