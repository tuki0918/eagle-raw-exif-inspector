import type { EagleTheme } from "@/components/EagleThemeWrapper";
import type { PropsWithChildren } from "react";

export type Theme = "light" | "dark";

const ThemeWrapper = ({
  theme,
  children,
}: PropsWithChildren<{ theme: EagleTheme }>) => (
  <div data-theme={lightOrDark(theme)}>{children}</div>
);

export default ThemeWrapper;

function lightOrDark(theme: EagleTheme): Theme {
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
