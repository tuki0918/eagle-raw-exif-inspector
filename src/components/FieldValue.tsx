import { isFormattedJson, renderValue } from "@/utils/renderValue";
import { ExternalLink } from "lucide-react";

interface FieldValueProps {
  fieldName: string;
  value: unknown;
  formatValue: (value: unknown, fieldName: string) => unknown;
}

const FieldValue = ({ value, formatValue, fieldName }: FieldValueProps) => {
  const formattedValue = formatValue(value, fieldName);
  const renderedValue = renderValue(formattedValue);
  const isFormatted = isFormattedJson(renderedValue);
  const isUrl =
    typeof renderedValue === "string" && /^https?:\/\//.test(renderedValue);

  return (
    <div className="py-3 px-4 item-value rounded-md max-h-[500px] overflow-y-auto">
      {isFormatted ? (
        <pre className="whitespace-pre-wrap font-mono text-sm overflow-x-auto min-h-6">
          {renderedValue}
        </pre>
      ) : (
        <div className="min-h-6 flex items-center justify-between gap-2">
          <span className="break-all">{renderedValue}</span>
          {isUrl && (
            <a
              href={renderedValue}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-blue-500 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-md transition-colors shrink-0"
              title="Open in new window"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default FieldValue;
