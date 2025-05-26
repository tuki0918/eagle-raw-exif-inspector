import { renderValue } from "@/utils/renderValue";

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
          <div className="py-3 item-label">{key}</div>
          <div className="py-3 px-4 item-value rounded-md">
            {renderValue(value)}
          </div>
        </div>
      ))}
    </>
  );
};

export default ImageExifMetadata;
