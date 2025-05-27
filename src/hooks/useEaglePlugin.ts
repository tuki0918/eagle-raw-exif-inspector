import type { EagleTheme } from "@/components/EagleThemeWrapper";
import exifr from "exifr";
import { useEffect, useState } from "react";

export function useEaglePlugin() {
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
        const item = items[0] as { filePath: string };
        const data = await exifr.parse(item.filePath);
        setItem(data ?? null);
      } catch {
        setItem(null);
      }
    };

    eagle.onPluginCreate(async () => {
      handleThemeChange(eagle.app.theme);
      await findExifData();
    });

    eagle.onThemeChanged(handleThemeChange);
  }, []);

  return { theme, item };
}
