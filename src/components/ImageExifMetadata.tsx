import { useExifFieldPreferences } from "@/hooks/useExifFieldPreferences";
import { useJsonFormatter } from "@/hooks/useJsonFormatter";
import FieldActionButtons from "./FieldActionButtons";
import FieldNameDisplay from "./FieldNameDisplay";
import FieldValue from "./FieldValue";
import HiddenFieldsSection from "./HiddenFieldsSection";

const ImageExifMetadata = ({
  item,
  parentFieldName = "",
}: {
  item: {
    [key: string]: unknown;
  } | null;
  parentFieldName?: string;
}) => {
  const { preferences, toggleFavorite, toggleHidden, isFavorite, isHidden } =
    useExifFieldPreferences();
  const {
    getFormatState,
    isExpanded,
    toggleFormat,
    canFormat,
    formatValue,
    expandValue,
  } = useJsonFormatter();

  if (item == null) {
    return (
      <div className="py-3 px-4 info-message rounded-md text-center">
        {i18next.t("message.notFound")}
      </div>
    );
  }

  const allEntries = Object.entries(item);

  // Sort entries: favorites first (in order added), then regular, then hidden separately
  const favoriteEntries = allEntries.filter(([key]) => {
    const fullFieldName = parentFieldName ? `${parentFieldName}.${key}` : key;
    return isFavorite(fullFieldName);
  });
  const regularEntries = allEntries.filter(([key]) => {
    const fullFieldName = parentFieldName ? `${parentFieldName}.${key}` : key;
    return !isFavorite(fullFieldName) && !isHidden(fullFieldName);
  });
  const hiddenEntries = allEntries.filter(([key]) => {
    const fullFieldName = parentFieldName ? `${parentFieldName}.${key}` : key;
    return isHidden(fullFieldName);
  });

  // Sort favorites by their order in preferences.favorites array
  const sortedFavoriteEntries = favoriteEntries.sort(([keyA], [keyB]) => {
    const fullFieldNameA = parentFieldName
      ? `${parentFieldName}.${keyA}`
      : keyA;
    const fullFieldNameB = parentFieldName
      ? `${parentFieldName}.${keyB}`
      : keyB;
    const indexA = preferences.favorites.indexOf(fullFieldNameA);
    const indexB = preferences.favorites.indexOf(fullFieldNameB);
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

        // 内部的なフィールド名（ドット区切り）
        const fullFieldName = parentFieldName
          ? `${parentFieldName}.${key}`
          : key;
        const formatState = getFormatState(fullFieldName);
        const expanded = isExpanded(fullFieldName);
        const expandedObject = expanded ? expandValue(value) : null;
        const isTopLevel = parentFieldName === "";

        return (
          <div
            key={fullFieldName}
            className={`flex flex-col${shouldAddMarginBottom ? " mb-4" : ""}`}
          >
            <div className="py-3 item-label flex items-center justify-between">
              <FieldNameDisplay
                fieldKey={key}
                parentFieldName={parentFieldName}
                isTopLevel={isTopLevel}
              />
              <FieldActionButtons
                fieldName={fullFieldName}
                isFavorite={isFavorite(fullFieldName)}
                isHidden={isHidden(fullFieldName)}
                onToggleFavorite={toggleFavorite}
                onToggleHidden={toggleHidden}
                canFormat={canFormat(value)}
                formatState={formatState}
                onToggleFormat={toggleFormat}
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

      <HiddenFieldsSection
        hiddenEntries={hiddenEntries}
        isFavorite={isFavorite}
        isHidden={isHidden}
        onToggleFavorite={toggleFavorite}
        onToggleHidden={toggleHidden}
        canFormat={canFormat}
        getFormatState={getFormatState}
        onToggleFormat={toggleFormat}
        formatValue={formatValue}
        expandValue={expandValue}
        parentFieldName={parentFieldName}
      />
    </>
  );
};

export default ImageExifMetadata;
