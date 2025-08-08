import { useState } from "react";

export const useJsonFormatter = () => {
  const [formattedFields, setFormattedFields] = useState<Set<string>>(
    new Set(),
  );

  const isFormatted = (fieldName: string): boolean => {
    return formattedFields.has(fieldName);
  };

  const toggleFormat = (fieldName: string): void => {
    setFormattedFields((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fieldName)) {
        newSet.delete(fieldName);
      } else {
        newSet.add(fieldName);
      }
      return newSet;
    });
  };

  const canFormat = (value: unknown): boolean => {
    // オブジェクトまたは配列のみをフォーマット対象とする
    // 数値、文字列、ブール値、null、undefinedは除外
    if (
      typeof value === "object" &&
      value !== null &&
      (Array.isArray(value) ||
        (typeof value === "object" && value.constructor === Object))
    ) {
      return true;
    }

    // 文字列の場合、JSONとして解析可能かチェック
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return (
          typeof parsed === "object" &&
          parsed !== null &&
          (Array.isArray(parsed) ||
            (typeof parsed === "object" && parsed.constructor === Object))
        );
      } catch {
        return false;
      }
    }

    return false;
  };

  const formatValue = (value: unknown, fieldName: string): unknown => {
    // フォーマット可能な値（配列・オブジェクト・JSON文字列）の場合
    if (canFormat(value)) {
      let targetValue: unknown = value;

      // 文字列の場合はJSONとして解析
      if (typeof value === "string") {
        try {
          targetValue = JSON.parse(value);
        } catch {
          return value;
        }
      }

      if (isFormatted(fieldName)) {
        // フォーマット適用: インデント付きでフォーマット
        try {
          return JSON.stringify(targetValue, null, 2);
        } catch {
          return value;
        }
      } else {
        // フォーマット未適用: 1行で表示
        try {
          return JSON.stringify(targetValue);
        } catch {
          return value;
        }
      }
    }

    // フォーマット対象外の値はそのまま返す
    return value;
  };

  return {
    isFormatted,
    toggleFormat,
    canFormat,
    formatValue,
  };
};
