import type { EagleTheme } from "@/components/EagleThemeWrapper";
import type { C2PAInfo } from "@/types/c2pa.d.ts";
import { parseMetadataWithC2PA } from "@/utils/exif";
import { useEffect, useState } from "react";

export function useEaglePlugin() {
  const [theme, setTheme] = useState<EagleTheme>("LIGHT");
  const [item, setItem] = useState<{ [key: string]: unknown } | null>(null);
  const [c2paInfo, setC2paInfo] = useState<C2PAInfo | null>(null);

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

        const item = items[0] as { fileURL: string };
        if (!item.fileURL) {
          setItem(null);
          setC2paInfo(null);
          return;
        }

        const { metadata, c2paInfo } = await parseMetadataWithC2PA(item.fileURL);
        setItem(metadata ?? null);
        setC2paInfo(c2paInfo ?? null);
      } catch (e) {
        console.log("Failed to extract metadata:", e);
        setItem(null);
        setC2paInfo(null);
      }
    };

    eagle.onPluginCreate(async () => {
      handleThemeChange(eagle.app.theme);
      await findExifData();
    });

    eagle.onThemeChanged(handleThemeChange);
  }, []);

  return { theme, item, c2paInfo };
}
