import { isFormattedJson, renderValue } from "@/utils/renderValue";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import FieldActionButtons from "./FieldActionButtons";

interface HiddenFieldsSectionProps {
  hiddenEntries: [string, unknown][];
  isFavorite: (fieldName: string) => boolean;
  isHidden: (fieldName: string) => boolean;
  onToggleFavorite: (fieldName: string) => void;
  onToggleHidden: (fieldName: string) => void;
  canFormat?: (value: unknown) => boolean;
  isFormatted?: (fieldName: string) => boolean;
  onToggleFormat?: (fieldName: string) => void;
  formatValue?: (value: unknown, fieldName: string) => unknown;
}

const HiddenFieldsSection = ({
  hiddenEntries,
  isFavorite,
  isHidden,
  onToggleFavorite,
  onToggleHidden,
  canFormat = () => false,
  isFormatted = () => false,
  onToggleFormat,
  formatValue = (value) => value,
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
          {hiddenEntries.map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <div className="py-3 item-label flex items-center justify-between">
                <span>{key}</span>
                <FieldActionButtons
                  fieldName={key}
                  isFavorite={isFavorite(key)}
                  isHidden={isHidden(key)}
                  onToggleFavorite={onToggleFavorite}
                  onToggleHidden={onToggleHidden}
                  canFormat={canFormat(value)}
                  isFormatted={isFormatted(key)}
                  onToggleFormat={onToggleFormat}
                />
              </div>
              <div className="py-3 px-4 item-value rounded-md">
                {(() => {
                  const formattedValue = formatValue(value, key);
                  const renderedValue = renderValue(formattedValue);
                  const isFormatted = isFormattedJson(renderedValue);

                  return isFormatted ? (
                    <pre className="whitespace-pre-wrap font-mono text-sm overflow-x-auto">
                      {renderedValue}
                    </pre>
                  ) : (
                    renderedValue
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default HiddenFieldsSection;
