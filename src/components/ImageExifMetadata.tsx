import { useExifFieldPreferences } from "@/hooks/useExifFieldPreferences";
import { renderValue } from "@/utils/renderValue";
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
      {visibleEntries.map(([key, value]) => (
        <div key={key} className="flex flex-col">
          <div className="py-3 item-label flex items-center justify-between">
            <span>{key}</span>
            <FieldActionButtons
              fieldName={key}
              isFavorite={isFavorite(key)}
              isHidden={isHidden(key)}
              onToggleFavorite={toggleFavorite}
              onToggleHidden={toggleHidden}
            />
          </div>
          <div className="py-3 px-4 item-value rounded-md">
            {renderValue(value)}
          </div>
        </div>
      ))}

      <HiddenFieldsSection
        hiddenEntries={hiddenEntries}
        isFavorite={isFavorite}
        isHidden={isHidden}
        onToggleFavorite={toggleFavorite}
        onToggleHidden={toggleHidden}
      />
    </>
  );
};

export default ImageExifMetadata;
