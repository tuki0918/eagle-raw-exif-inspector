import { useEffect, useState } from "react";

const AUTO_SAVE_PREFERENCE_KEY = "eagle-exif-auto-save-enabled";

export function useAutoSavePreference() {
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(() => {
    // Default to false to avoid search pollution concerns
    try {
      const stored = localStorage.getItem(AUTO_SAVE_PREFERENCE_KEY);
      return stored ? JSON.parse(stored) : false;
    } catch {
      // Handle invalid JSON gracefully by returning default
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      AUTO_SAVE_PREFERENCE_KEY,
      JSON.stringify(autoSaveEnabled),
    );
  }, [autoSaveEnabled]);

  return {
    autoSaveEnabled,
    setAutoSaveEnabled,
  };
}
