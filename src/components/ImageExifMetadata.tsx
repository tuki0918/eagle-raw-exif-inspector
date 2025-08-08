import { useExifFieldPreferences } from "@/hooks/useExifFieldPreferences";
import { useJsonFormatter } from "@/hooks/useJsonFormatter";
import { isFormattedJson, renderValue } from "@/utils/renderValue";
import FieldActionButtons from "./FieldActionButtons";
import HiddenFieldsSection from "./HiddenFieldsSection";

const ImageExifMetadata = ({
  item,
}: {
  item: {
    [key: string]: unknown;
  } | null;
}) => {
  const { preferences, toggleFavorite, toggleHidden, isFavorite, isHidden } =
    useExifFieldPreferences();
  const { isFormatted, toggleFormat, canFormat, formatValue } =
    useJsonFormatter();

  if (item == null) {
    return (
      <div className="py-3 px-4 info-message rounded-md text-center">
        {i18next.t("message.notFound")}
      </div>
    );
  }

  const allEntries = Object.entries(item);

  // Sort entries: favorites first (in order added), then regular, then hidden separately
  const favoriteEntries = allEntries.filter(([key]) => isFavorite(key));
  const regularEntries = allEntries.filter(
    ([key]) => !isFavorite(key) && !isHidden(key),
  );
  const hiddenEntries = allEntries.filter(([key]) => isHidden(key));

  // Sort favorites by their order in preferences.favorites array
  const sortedFavoriteEntries = favoriteEntries.sort(([keyA], [keyB]) => {
    const indexA = preferences.favorites.indexOf(keyA);
    const indexB = preferences.favorites.indexOf(keyB);
    return indexA - indexB;
  });

  const visibleEntries = [...sortedFavoriteEntries, ...regularEntries];

  return (
    <>
      {visibleEntries.map(([key, value], index) => {
        const isLastVisibleEntry = index === visibleEntries.length - 1;
        const hasVisibleEntries = visibleEntries.length > 0;
        const hasHiddenEntries = hiddenEntries.length > 0;
        const shouldAddMarginBottom =
          isLastVisibleEntry && hasVisibleEntries && hasHiddenEntries;

        return (
          <div
            key={key}
            className={`flex flex-col${shouldAddMarginBottom ? " mb-4" : ""}`}
          >
            <div className="py-3 item-label flex items-center justify-between">
              <span>{key}</span>
              <FieldActionButtons
                fieldName={key}
                isFavorite={isFavorite(key)}
                isHidden={isHidden(key)}
                onToggleFavorite={toggleFavorite}
                onToggleHidden={toggleHidden}
                canFormat={canFormat(value)}
                isFormatted={isFormatted(key)}
                onToggleFormat={toggleFormat}
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
        );
      })}

      <HiddenFieldsSection
        hiddenEntries={hiddenEntries}
        isFavorite={isFavorite}
        isHidden={isHidden}
        onToggleFavorite={toggleFavorite}
        onToggleHidden={toggleHidden}
        canFormat={canFormat}
        isFormatted={isFormatted}
        onToggleFormat={toggleFormat}
        formatValue={formatValue}
      />
    </>
  );
};

export default ImageExifMetadata;
