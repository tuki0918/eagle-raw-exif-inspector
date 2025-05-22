import "./App.css";
import exifr from "exifr";
import { useEffect, useState } from "react";
import ImageExifMetadata from "./components/ImageExifMetadata";

type Theme = "light" | "dark";

function App() {
  const [theme, setTheme] = useState<Theme>("light");
  const [item, setItem] = useState<{
    [key: string]: string | number | boolean;
  } | null>(null);

  useEffect(() => {
    eagle.onPluginCreate(async () => {
      const theme = eagle.app.theme;
      setTheme(lightOrDark(theme));

      const items = await eagle.item.getSelected();

      if (items.length === 1) {
        const item = items[0];
        const data = await exifr.parse(item.filePath);
        setItem(data);
      } else {
        setItem(null);
      }
    });

    eagle.onThemeChanged((theme) => {
      setTheme(lightOrDark(theme));
    });
  }, []);

  return (
    <div data-theme={theme}>
      {item ? (
        <ImageExifMetadata item={item} />
      ) : (
        <div className="py-3 px-4 text-[var(--color-text-dark-50)] bg-[var(--color-bg-dark)] dark:text-[var(--color-text-lightgray-50)] dark:bg-[var(--color-bg-lightgray)] rounded-md text-center">
          Not found.
        </div>
      )}
    </div>
  );
}

function lightOrDark(theme: string): Theme {
  switch (theme) {
    case "LIGHT":
    case "LIGHTGRAY":
      return "light";
    case "GRAY":
    case "BLUE":
    case "PURPLE":
    case "DARK":
      return "dark";
    default:
      return "light";
  }
}

export default App;
