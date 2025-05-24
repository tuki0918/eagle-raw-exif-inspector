const ImageExifMetadata = ({
  item,
}: {
  item: {
    [key: string]: unknown;
  };
}) => {
  return (
    <>
      {Object.entries(item).map(([key, value]) => (
        <div key={key} className="flex flex-col">
          <div className="py-3 text-[var(--color-text-dark)] dark:text-[var(--color-text-lightgray)]">
            {key}
          </div>
          <div className="py-3 px-4 text-[var(--color-text-dark)] bg-[var(--color-bg-dark)] dark:text-[var(--color-text-lightgray)] dark:bg-[var(--color-bg-lightgray)] rounded-md">
            {renderValue(value)}
          </div>
        </div>
      ))}
    </>
  );
};

function renderValue(value: unknown): string {
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
  if (Array.isArray(value)) {
    return `[${value.map(renderValue).join(", ")}]`;
  }
  if (ArrayBuffer.isView(value)) {
    // TypedArray (Uint8Array など)
    return `[${Array.from(value as Uint8Array).join(", ")}]`;
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

export default ImageExifMetadata;
