import type { EagleTheme } from "@/components/EagleThemeWrapper";
import { parseMetadata } from "@/utils/exif";
import { useEffect, useState } from "react";

export function useEaglePlugin(autoSaveEnabled = false) {
  const [theme, setTheme] = useState<EagleTheme>("LIGHT");
  const [item, setItem] = useState<{ [key: string]: unknown } | null>(null);

  useEffect(() => {
    const handleThemeChange = (theme: unknown) => {
      setTheme(theme as EagleTheme);
    };

    const findExifData = async () => {
      try {
        const items = await eagle.item.getSelected();
        if (items.length !== 1) {
          setItem(null);
          return;
        }

        const selectedItem = items[0];
        if (!selectedItem.filePath) {
          setItem(null);
          return;
        }

        const data = await parseMetadata(selectedItem.filePath);
        setItem(data ?? null);

        // Check if auto-save is enabled and if annotation is set and if metadata was successfully extracted
        if (
          autoSaveEnabled &&
          data &&
          (!selectedItem.annotation || selectedItem.annotation.trim() === "")
        ) {
          try {
            // Convert metadata to text format
            const metadataText = JSON.stringify(data);

            // Save metadata to annotation
            selectedItem.annotation = metadataText;
            await selectedItem.save();

            console.log("Metadata saved to annotation");
          } catch (annotationError) {
            console.log(
              "Failed to save metadata to annotation:",
              annotationError,
            );
          }
        }
      } catch (e) {
        console.log("Failed to extract metadata:", e);
        setItem(null);
      }
    };

    eagle.onPluginCreate(async () => {
      handleThemeChange(eagle.app.theme);
      await findExifData();
    });

    eagle.onThemeChanged(handleThemeChange);
  }, [autoSaveEnabled]);

  return { theme, item };
}
