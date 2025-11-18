import { formatFieldName, formatFieldNameShort } from "@/utils/formatFieldName";
import { useState } from "react";

interface FieldNameDisplayProps {
  fieldKey: string;
  parentFieldName: string;
  isTopLevel: boolean;
}

/**
 * フィールド名を表示するコンポーネント
 * トップレベルの場合は通常のspan、ネストされている場合はクリック可能なbuttonとして表示
 * クリックで短縮形式とフルパスを切り替え可能
 */
const FieldNameDisplay = ({
  fieldKey,
  parentFieldName,
  isTopLevel,
}: FieldNameDisplayProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayFieldName = formatFieldName(fieldKey, parentFieldName);
  const shortFieldName = formatFieldNameShort(fieldKey);

  const handleClick = () => {
    setIsExpanded((prev) => !prev);
  };

  if (isTopLevel) {
    return <span>{displayFieldName}</span>;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="cursor-pointer hover:opacity-70 transition-opacity text-left"
      style={{
        fontWeight: isExpanded ? "bold" : "normal",
      }}
    >
      {isExpanded ? displayFieldName : shortFieldName}
    </button>
  );
};

export default FieldNameDisplay;
