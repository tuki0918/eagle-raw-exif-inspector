import type { FormatState } from "@/hooks/useJsonFormatter";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import FieldActionButtons from "./FieldActionButtons";
import FieldValue from "./FieldValue";
import ImageExifMetadata from "./ImageExifMetadata";

interface HiddenFieldsSectionProps {
  hiddenEntries: [string, unknown][];
  isFavorite: (fieldName: string) => boolean;
  isHidden: (fieldName: string) => boolean;
  onToggleFavorite: (fieldName: string) => void;
  onToggleHidden: (fieldName: string) => void;
  canFormat?: (value: unknown) => boolean;
  getFormatState?: (fieldName: string) => FormatState;
  onToggleFormat?: (fieldName: string) => void;
  formatValue?: (value: unknown, fieldName: string) => unknown;
  expandValue?: (value: unknown) => Record<string, unknown> | null;
  parentFieldName?: string;
}

const HiddenFieldsSection = ({
  hiddenEntries,
  isFavorite,
  isHidden,
  onToggleFavorite,
  onToggleHidden,
  canFormat = () => false,
  getFormatState = () => "none",
  onToggleFormat,
  formatValue = (value) => value,
  expandValue = () => null,
  parentFieldName = "",
}: HiddenFieldsSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (hiddenEntries.length === 0) {
    return null;
  }

  const hiddenCount = hiddenEntries.length;
  const countText = `${hiddenCount} ${
    hiddenCount === 1
      ? i18next.t("message.hiddenFieldSingle")
      : i18next.t("message.hiddenFieldPlural")
  }`;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 py-2 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400 text-sm w-full"
        aria-expanded={isExpanded}
      >
        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <span>{countText}</span>
      </button>

      {isExpanded && (
        <div className="mt-2">
          {hiddenEntries.map(([key, value]) => {
            const fullFieldName = parentFieldName
              ? `${parentFieldName}.${key}`
              : key;
            const formatState = getFormatState(fullFieldName);
            const expanded =
              formatState === "expanded" && expandValue(value) !== null;
            const expandedObject = expanded ? expandValue(value) : null;
            const isTopLevel = parentFieldName === "";

            return (
              <div key={fullFieldName} className="flex flex-col">
                <div className="py-3 item-label flex items-center justify-between">
                  <span>{fullFieldName}</span>
                  <FieldActionButtons
                    fieldName={fullFieldName}
                    isFavorite={isFavorite(fullFieldName)}
                    isHidden={isHidden(fullFieldName)}
                    onToggleFavorite={onToggleFavorite}
                    onToggleHidden={onToggleHidden}
                    canFormat={canFormat(value)}
                    formatState={formatState}
                    onToggleFormat={onToggleFormat}
                    showFavorite={isTopLevel}
                    showHidden={isTopLevel}
                  />
                </div>
                {expanded && expandedObject ? (
                  <div className="ml-4 border-l-2 border-gray-300 dark:border-gray-600 pl-4">
                    <ImageExifMetadata
                      item={expandedObject}
                      parentFieldName={fullFieldName}
                    />
                  </div>
                ) : (
                  <FieldValue
                    fieldName={fullFieldName}
                    value={value}
                    formatValue={formatValue}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default HiddenFieldsSection;
