import { useCallback, useState } from "react";

export interface ExifDisplaySettings {
  autoFormatJson: boolean;
  collapseLongValues: boolean;
  favoritesFirst: boolean;
  showFullFieldPaths: boolean;
  includeFieldNameInCopy: boolean;
}

export type ExifDisplaySettingKey = keyof ExifDisplaySettings;

const STORAGE_KEY = "exif-display-settings";
const STORAGE_VERSION = 1;

export const defaultExifDisplaySettings: ExifDisplaySettings = {
  autoFormatJson: true,
  collapseLongValues: true,
  favoritesFirst: true,
  showFullFieldPaths: false,
  includeFieldNameInCopy: false,
};

const loadSettings = (): ExifDisplaySettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultExifDisplaySettings;

    const parsed = JSON.parse(stored) as {
      version?: number;
      settings?: Partial<ExifDisplaySettings>;
    };
    const storedSettings = parsed.settings ?? {};

    return Object.fromEntries(
      Object.entries(defaultExifDisplaySettings).map(([key, defaultValue]) => [
        key,
        typeof storedSettings[key as ExifDisplaySettingKey] === "boolean"
          ? storedSettings[key as ExifDisplaySettingKey]
          : defaultValue,
      ]),
    ) as unknown as ExifDisplaySettings;
  } catch (error) {
    console.warn("Failed to load EXIF display settings:", error);
    return defaultExifDisplaySettings;
  }
};

export function useExifDisplaySettings() {
  const [settings, setSettings] = useState<ExifDisplaySettings>(loadSettings);

  const updateSetting = useCallback(
    (key: ExifDisplaySettingKey, value: boolean) => {
      setSettings((currentSettings) => {
        const nextSettings = { ...currentSettings, [key]: value };

        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              version: STORAGE_VERSION,
              settings: nextSettings,
            }),
          );
        } catch (error) {
          console.warn("Failed to save EXIF display settings:", error);
        }

        return nextSettings;
      });
    },
    [],
  );

  return { settings, updateSetting };
}
