import "@/App.css";
import type { EagleTheme } from "@/components/EagleThemeWrapper";
import ImageExifMetadata from "@/components/ImageExifMetadata";
import ThemeWrapper from "@/components/ThemeWrapper";
import exifr from "exifr";
import { useEffect, useState } from "react";

function App() {
  const [theme, setTheme] = useState<EagleTheme>("LIGHT");
  const [item, setItem] = useState<{
    [key: string]: unknown;
  } | null>(null);

  useEffect(() => {
    eagle.onPluginCreate(async () => {
      const theme = eagle.app.theme;
      setTheme(theme as EagleTheme);

      const items = await eagle.item.getSelected();
      if (items.length !== 1) {
        setItem(null);
        return;
      }
      const item = items[0] as { filePath: string };
      const data = await exifr.parse(item.filePath);
      if (data == null) {
        setItem(null);
        return;
      }
      setItem(data);
    });

    eagle.onThemeChanged((theme) => {
      setTheme(theme as EagleTheme);
    });
  }, []);

  return (
    <ThemeWrapper theme={theme}>
      <ImageExifMetadata item={item} />
    </ThemeWrapper>
  );
}

export default App;
