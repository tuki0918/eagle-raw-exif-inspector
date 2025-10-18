import { isFormattedJson, renderValue } from "@/utils/renderValue";

interface FieldValueProps {
  fieldName: string;
  value: unknown;
  formatValue: (value: unknown, fieldName: string) => unknown;
}

const FieldValue = ({ value, formatValue, fieldName }: FieldValueProps) => {
  const formattedValue = formatValue(value, fieldName);
  const renderedValue = renderValue(formattedValue);
  const isFormatted = isFormattedJson(renderedValue);

  return (
    <div className="py-3 px-4 item-value rounded-md max-h-[500px] overflow-y-auto">
      {isFormatted ? (
        <pre className="whitespace-pre-wrap font-mono text-sm overflow-x-auto min-h-6">
          {renderedValue}
        </pre>
      ) : (
        <div className="min-h-6">{renderedValue}</div>
      )}
    </div>
  );
};

export default FieldValue;
