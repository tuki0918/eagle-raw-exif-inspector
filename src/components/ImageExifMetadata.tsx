import { useExifFieldPreferences } from "@/hooks/useExifFieldPreferences";
import { useJsonFormatter } from "@/hooks/useJsonFormatter";
import { useState } from "react";
import FieldActionButtons from "./FieldActionButtons";
import FieldNameDisplay from "./FieldNameDisplay";
import FieldValue from "./FieldValue";
import FieldVisibilityTabs, {
  type FieldVisibilityTab,
} from "./FieldVisibilityTabs";

const ImageExifMetadata = ({
  item,
  parentFieldName = "",
}: {
  item: {
    [key: string]: unknown;
  } | null;
  parentFieldName?: string;
}) => {
  const [activeTab, setActiveTab] = useState<FieldVisibilityTab>("visible");
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
  const isTopLevel = parentFieldName === "";

  const renderEntries = (entries: [string, unknown][]) =>
    entries.map(([key, value]) => {
      // 内部的なフィールド名（ドット区切り）
      const fullFieldName = parentFieldName ? `${parentFieldName}.${key}` : key;
      const formatState = getFormatState(fullFieldName);
      const expanded = isExpanded(fullFieldName);
      const expandedObject = expanded ? expandValue(value) : null;

      return (
        <div key={fullFieldName} className="flex flex-col">
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
    });

  if (!isTopLevel) {
    return <>{renderEntries(visibleEntries)}</>;
  }

  const activeEntries =
    activeTab === "visible" ? visibleEntries : hiddenEntries;
  const emptyMessageKey =
    activeTab === "visible"
      ? "message.noVisibleFields"
      : "message.noHiddenFields";

  return (
    <>
      <FieldVisibilityTabs
        activeTab={activeTab}
        visibleCount={visibleEntries.length}
        hiddenCount={hiddenEntries.length}
        onChange={setActiveTab}
      />
      <div
        id={`${activeTab}-fields-panel`}
        role="tabpanel"
        aria-labelledby={`${activeTab}-fields-tab`}
      >
        {activeEntries.length > 0 ? (
          renderEntries(activeEntries)
        ) : (
          <div className="py-3 px-4 info-message rounded-md text-center">
            {i18next.t(emptyMessageKey)}
          </div>
        )}
      </div>
    </>
  );
};

export default ImageExifMetadata;
