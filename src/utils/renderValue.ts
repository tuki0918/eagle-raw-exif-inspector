export function renderValue(value: unknown): string {
  if (value == null) return String(value);
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value.toString();
  }
  if (value instanceof Date) {
    return value.toLocaleString();
  }
  if (ArrayBuffer.isView(value)) {
    return `[${typeof value}]`;
  }
  if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
    try {
      // 配列またはオブジェクトの場合、そのまま文字列として扱う
      // （フォーマット済みの場合はすでに文字列化されている）
      if (typeof value === "string") {
        return value;
      }
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

// フォーマットされたJSONを検出する関数
export function isFormattedJson(value: string): boolean {
  // 複数行かつJSONの形式をしているかチェック
  return (
    value.includes("\n") &&
    ((value.trim().startsWith("{") && value.trim().endsWith("}")) ||
      (value.trim().startsWith("[") && value.trim().endsWith("]")))
  );
}
