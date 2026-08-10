import { useExifAnnotationSync } from "@/hooks/useExifAnnotationSync";
import {
  type ExifDisplaySettingKey,
  type ExifDisplaySettings,
  useExifDisplaySettings,
} from "@/hooks/useExifDisplaySettings";
import { useExifFieldPreferences } from "@/hooks/useExifFieldPreferences";
import { useJsonFormatter } from "@/hooks/useJsonFormatter";
import { formatFieldName, formatFieldNameShort } from "@/utils/formatFieldName";
import { renderValue } from "@/utils/renderValue";
import { useState } from "react";
import FieldActionButtons from "./FieldActionButtons";
import FieldNameDisplay from "./FieldNameDisplay";
import FieldValue from "./FieldValue";
import FieldVisibilityTabs, {
  type FieldVisibilityTab,
} from "./FieldVisibilityTabs";
import MetadataSettings from "./MetadataSettings";

interface ImageExifMetadataProps {
  item: Record<string, unknown> | null;
  itemId?: string | null;
  parentFieldName?: string;
}

interface MetadataLevelProps {
  item: Record<string, unknown>;
  parentFieldName: string;
  fieldPreferences: ReturnType<typeof useExifFieldPreferences>;
  formatter: ReturnType<typeof useJsonFormatter>;
  settings: ExifDisplaySettings;
  onSettingChange: (key: ExifDisplaySettingKey, value: boolean) => void;
}

const MetadataLevel = ({
  item,
  parentFieldName,
  fieldPreferences,
  formatter,
  settings,
  onSettingChange,
}: MetadataLevelProps) => {
  const [activeTab, setActiveTab] = useState<FieldVisibilityTab>("visible");
  const { preferences, toggleFavorite, toggleHidden, isFavorite, isHidden } =
    fieldPreferences;
  const {
    getFormatState,
    isExpanded,
    toggleFormat,
    canFormat,
    formatValue,
    expandValue,
  } = formatter;
  const allEntries = Object.entries(item);
  const isTopLevel = parentFieldName === "";

  const hiddenEntries = allEntries.filter(([key]) => {
    const fullFieldName = parentFieldName ? `${parentFieldName}.${key}` : key;
    return isHidden(fullFieldName);
  });

  let visibleEntries: [string, unknown][];
  if (settings.favoritesFirst) {
    const favoriteEntries = allEntries
      .filter(([key]) => {
        const fullFieldName = parentFieldName
          ? `${parentFieldName}.${key}`
          : key;
        return isFavorite(fullFieldName);
      })
      .sort(([keyA], [keyB]) => {
        const fullFieldNameA = parentFieldName
          ? `${parentFieldName}.${keyA}`
          : keyA;
        const fullFieldNameB = parentFieldName
          ? `${parentFieldName}.${keyB}`
          : keyB;
        return (
          preferences.favorites.indexOf(fullFieldNameA) -
          preferences.favorites.indexOf(fullFieldNameB)
        );
      });
    const regularEntries = allEntries.filter(([key]) => {
      const fullFieldName = parentFieldName ? `${parentFieldName}.${key}` : key;
      return !isFavorite(fullFieldName) && !isHidden(fullFieldName);
    });
    visibleEntries = [...favoriteEntries, ...regularEntries];
  } else {
    visibleEntries = allEntries.filter(([key]) => {
      const fullFieldName = parentFieldName ? `${parentFieldName}.${key}` : key;
      return !isHidden(fullFieldName);
    });
  }

  const renderEntries = (entries: [string, unknown][]) =>
    entries.map(([key, value]) => {
      const fullFieldName = parentFieldName ? `${parentFieldName}.${key}` : key;
      const formatState = getFormatState(fullFieldName);
      const expanded = isExpanded(fullFieldName);
      const expandedObject = expanded ? expandValue(value) : null;
      const displayFieldName =
        isTopLevel || settings.showFullFieldPaths
          ? formatFieldName(key, parentFieldName)
          : formatFieldNameShort(key);

      const copyValue = async () => {
        const renderedValue = renderValue(formatValue(value, fullFieldName));
        const text = settings.includeFieldNameInCopy
          ? `${displayFieldName}: ${renderedValue}`
          : renderedValue;
        await navigator.clipboard.writeText(text);
      };

      return (
        <div key={fullFieldName} className="flex flex-col">
          <div className="item-label flex items-center justify-between py-3">
            <FieldNameDisplay
              fieldKey={key}
              parentFieldName={parentFieldName}
              isTopLevel={isTopLevel}
              showFullPath={settings.showFullFieldPaths}
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
              onCopy={copyValue}
              fieldDisplayName={displayFieldName}
            />
          </div>
          {expanded && expandedObject ? (
            <div className="ml-4 border-l-2 border-gray-300 pl-4 dark:border-gray-600">
              <MetadataLevel
                item={expandedObject}
                parentFieldName={fullFieldName}
                fieldPreferences={fieldPreferences}
                formatter={formatter}
                settings={settings}
                onSettingChange={onSettingChange}
              />
            </div>
          ) : (
            <FieldValue
              fieldName={fullFieldName}
              value={value}
              formatValue={formatValue}
              collapseLongValues={settings.collapseLongValues}
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
        {activeTab === "settings" ? (
          <MetadataSettings settings={settings} onChange={onSettingChange} />
        ) : activeEntries.length > 0 ? (
          renderEntries(activeEntries)
        ) : (
          <div className="info-message rounded-md px-4 py-3 text-center">
            {i18next.t(emptyMessageKey)}
          </div>
        )}
      </div>
    </>
  );
};

const ImageExifMetadata = ({
  item,
  itemId = null,
  parentFieldName = "",
}: ImageExifMetadataProps) => {
  const fieldPreferences = useExifFieldPreferences();
  const { settings, updateSetting } = useExifDisplaySettings();
  const formatter = useJsonFormatter(settings.autoFormatJson);

  useExifAnnotationSync({
    enabled: settings.autoSaveMetadataToAnnotation,
    itemId,
    metadata: item,
  });

  if (item == null) {
    return (
      <div className="info-message rounded-md px-4 py-3 text-center">
        {i18next.t("message.notFound")}
      </div>
    );
  }

  return (
    <MetadataLevel
      item={item}
      parentFieldName={parentFieldName}
      fieldPreferences={fieldPreferences}
      formatter={formatter}
      settings={settings}
      onSettingChange={updateSetting}
    />
  );
};

export default ImageExifMetadata;
