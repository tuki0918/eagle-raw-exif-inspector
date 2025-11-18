import { useState } from "react";

export type FormatState = "none" | "formatted" | "expanded";

export const useJsonFormatter = () => {
  const [formatStates, setFormatStates] = useState<Map<string, FormatState>>(
    new Map(),
  );

  const getFormatState = (fieldName: string): FormatState => {
    return formatStates.get(fieldName) ?? "none";
  };

  const isFormatted = (fieldName: string): boolean => {
    const state = formatStates.get(fieldName);
    return state === "formatted" || state === "expanded";
  };

  const isExpanded = (fieldName: string): boolean => {
    return formatStates.get(fieldName) === "expanded";
  };

  const toggleFormat = (fieldName: string): void => {
    setFormatStates((prev) => {
      const newMap = new Map(prev);
      const currentState = newMap.get(fieldName) ?? "none";

      // 3状態を循環: none → formatted → expanded → none
      let nextState: FormatState;
      if (currentState === "none") {
        nextState = "formatted";
      } else if (currentState === "formatted") {
        nextState = "expanded";
      } else {
        nextState = "none";
      }

      if (nextState === "none") {
        newMap.delete(fieldName);
      } else {
        newMap.set(fieldName, nextState);
      }

      return newMap;
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
      // 空の配列または空のオブジェクトの場合はフォーマット対象外
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === "object" && value.constructor === Object) {
        return Object.keys(value).length > 0;
      }
      return true;
    }

    // 文字列の場合、JSONとして解析可能かチェック
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (
          typeof parsed === "object" &&
          parsed !== null &&
          (Array.isArray(parsed) ||
            (typeof parsed === "object" && parsed.constructor === Object))
        ) {
          // 空の配列または空のオブジェクトの場合はフォーマット対象外
          if (Array.isArray(parsed)) {
            return parsed.length > 0;
          }
          if (typeof parsed === "object" && parsed.constructor === Object) {
            return Object.keys(parsed).length > 0;
          }
          return true;
        }
        return false;
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

      const state = getFormatState(fieldName);

      if (state === "expanded") {
        // 展開状態の場合、オブジェクトをそのまま返す（展開されたフィールドが表示される）
        return targetValue;
      }
      if (state === "formatted") {
        // フォーマット適用: インデント付きでフォーマット
        try {
          return JSON.stringify(targetValue, null, 2);
        } catch {
          return value;
        }
      }
      // フォーマット未適用: 1行で表示
      try {
        return JSON.stringify(targetValue);
      } catch {
        return value;
      }
    }

    // フォーマット対象外の値はそのまま返す
    return value;
  };

  // JSONオブジェクトまたは配列を展開可能な形式に変換するヘルパー関数
  const expandValue = (value: unknown): Record<string, unknown> | null => {
    // オブジェクトの場合
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }

    // 配列の場合、インデックスをキーとしたオブジェクトに変換
    if (Array.isArray(value)) {
      const result: Record<string, unknown> = {};
      value.forEach((item, index) => {
        result[String(index)] = item;
      });
      return result;
    }

    // 文字列の場合はJSONとして解析を試みる
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          // 配列の場合、インデックスをキーとしたオブジェクトに変換
          const result: Record<string, unknown> = {};
          parsed.forEach((item, index) => {
            result[String(index)] = item;
          });
          return result;
        }
        if (typeof parsed === "object" && parsed !== null) {
          return parsed as Record<string, unknown>;
        }
      } catch {
        // JSON解析に失敗した場合はnullを返す
      }
    }

    return null;
  };

  return {
    getFormatState,
    isFormatted,
    isExpanded,
    toggleFormat,
    canFormat,
    formatValue,
    expandValue,
  };
};
