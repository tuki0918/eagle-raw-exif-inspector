import { isFormattedJson, renderValue } from "@/utils/renderValue";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

interface FieldValueProps {
  fieldName: string;
  value: unknown;
  formatValue: (value: unknown, fieldName: string) => unknown;
  collapseLongValues?: boolean;
}

const FieldValue = ({
  value,
  formatValue,
  fieldName,
  collapseLongValues = false,
}: FieldValueProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const formattedValue = formatValue(value, fieldName);
  const renderedValue = renderValue(formattedValue);
  const isFormatted = isFormattedJson(renderedValue);
  const isLongValue =
    renderedValue.length > 240 || renderedValue.split("\n").length > 6;
  const isCollapsed = collapseLongValues && isLongValue && !isExpanded;
  const isUrl =
    typeof renderedValue === "string" && /^https?:\/\//.test(renderedValue);

  return (
    <div className="item-value rounded-md px-4 py-3">
      <div
        className={
          isCollapsed
            ? "max-h-24 overflow-hidden"
            : "max-h-[500px] overflow-y-auto"
        }
      >
        {isFormatted ? (
          <pre className="min-h-6 overflow-x-auto whitespace-pre-wrap font-mono text-sm">
            {renderedValue}
          </pre>
        ) : (
          <div className="flex min-h-6 items-center justify-between gap-2">
            <span className="break-all">{renderedValue}</span>
            {isUrl ? (
              <a
                href={renderedValue}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-md p-1.5 text-blue-500 transition-colors hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30"
                title="Open in new window"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={16} />
              </a>
            ) : null}
          </div>
        )}
      </div>
      {collapseLongValues && isLongValue ? (
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((current) => !current)}
            className="rounded px-1.5 py-0.5 text-xs font-medium text-blue-500 transition-colors hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30"
          >
            {i18next.t(isExpanded ? "message.showLess" : "message.showMore")}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default FieldValue;
