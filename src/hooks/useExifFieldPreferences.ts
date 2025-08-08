import { useCallback, useEffect, useState } from "react";

export interface ExifFieldPreferences {
  favorites: string[];
  hidden: string[];
}

const STORAGE_KEY = "exif-field-preferences";

const defaultPreferences: ExifFieldPreferences = {
  favorites: [],
  hidden: [],
};

export function useExifFieldPreferences() {
  const [preferences, setPreferences] =
    useState<ExifFieldPreferences>(defaultPreferences);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ExifFieldPreferences;
        setPreferences({
          favorites: parsed.favorites || [],
          hidden: parsed.hidden || [],
        });
      }
    } catch (error) {
      console.warn("Failed to load exif field preferences:", error);
    }
  }, []);

  // Save preferences to localStorage whenever they change
  const savePreferences = useCallback(
    (newPreferences: ExifFieldPreferences) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
        setPreferences(newPreferences);
      } catch (error) {
        console.warn("Failed to save exif field preferences:", error);
      }
    },
    [],
  );

  const toggleFavorite = useCallback(
    (fieldName: string) => {
      const newPreferences: ExifFieldPreferences = {
        favorites: preferences.favorites.includes(fieldName)
          ? preferences.favorites.filter((name: string) => name !== fieldName)
          : [...preferences.favorites, fieldName],
        hidden: preferences.hidden,
      };

      // Remove from hidden if adding to favorites
      if (newPreferences.favorites.includes(fieldName)) {
        newPreferences.hidden = preferences.hidden.filter(
          (name: string) => name !== fieldName,
        );
      }

      savePreferences(newPreferences);
    },
    [preferences, savePreferences],
  );

  const toggleHidden = useCallback(
    (fieldName: string) => {
      const newPreferences: ExifFieldPreferences = {
        hidden: preferences.hidden.includes(fieldName)
          ? preferences.hidden.filter((name: string) => name !== fieldName)
          : [...preferences.hidden, fieldName],
        favorites: preferences.favorites,
      };

      // Remove from favorites if adding to hidden
      if (newPreferences.hidden.includes(fieldName)) {
        newPreferences.favorites = preferences.favorites.filter(
          (name: string) => name !== fieldName,
        );
      }

      savePreferences(newPreferences);
    },
    [preferences, savePreferences],
  );

  const isFavorite = useCallback(
    (fieldName: string) => {
      return preferences.favorites.includes(fieldName);
    },
    [preferences.favorites],
  );

  const isHidden = useCallback(
    (fieldName: string) => {
      return preferences.hidden.includes(fieldName);
    },
    [preferences.hidden],
  );

  return {
    preferences,
    toggleFavorite,
    toggleHidden,
    isFavorite,
    isHidden,
  };
}
