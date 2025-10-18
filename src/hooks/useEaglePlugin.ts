import type { EagleTheme } from "@/components/EagleThemeWrapper";
import { parseMetadata } from "@/utils/exif";
import { useEffect, useState } from "react";

export function useEaglePlugin() {
  const [theme, setTheme] = useState<EagleTheme>("LIGHT");
  const [item, setItem] = useState<{ [key: string]: unknown } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleThemeChange = (theme: unknown) => {
      setTheme(theme as EagleTheme);
    };

    const findExifData = async () => {
      setIsLoading(true);
      try {
        const items = await eagle.item.getSelected();
        if (items.length !== 1) {
          setItem(null);
          return;
        }

        const item = items[0] as { fileURL: string };
        if (!item.fileURL) {
          setItem(null);
          return;
        }

        const data = await parseMetadata(item.fileURL);
        setItem(data ?? null);
      } catch (e) {
        console.log("Failed to extract metadata:", e);
        setItem(null);
      } finally {
        setIsLoading(false);
      }
    };

    eagle.onPluginCreate(async () => {
      handleThemeChange(eagle.app.theme);
      await findExifData();
    });

    eagle.onThemeChanged(handleThemeChange);
  }, []);

  return { theme, item, isLoading };
}
