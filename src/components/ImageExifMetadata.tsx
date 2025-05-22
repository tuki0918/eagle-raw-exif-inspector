const ImageExifMetadata = ({
  item,
}: {
  item: {
    [key: string]: string | number | boolean;
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
            {value}
          </div>
        </div>
      ))}
    </>
  );
};

export default ImageExifMetadata;
