import "./App.css";
import exifr from "exifr";
import { useEffect, useState } from "react";
import type { EagleTheme } from "@/components/EagleThemeWrapper";
import ImageExifMetadata from "@/components/ImageExifMetadata";
import ThemeWrapper from "@/components/ThemeWrapper";

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
      const item = items[0];
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
      {item ? (
        <ImageExifMetadata item={item} />
      ) : (
        <div className="py-3 px-4 text-[var(--color-text-dark-50)] bg-[var(--color-bg-dark)] dark:text-[var(--color-text-lightgray-50)] dark:bg-[var(--color-bg-lightgray)] rounded-md text-center">
          {i18next.t("message.notFound")}
        </div>
      )}
    </ThemeWrapper>
  );
}

export default App;
