import type { PropsWithChildren } from "react";
import type { EagleTheme } from "./EagleThemeWrapper";

export type Theme = "light" | "dark";

const ThemeWrapper = ({
  theme,
  children,
}: PropsWithChildren<{ theme: EagleTheme | string }>) => (
  <div data-theme={lightOrDark(theme)}>{children}</div>
);

export default ThemeWrapper;

function lightOrDark(theme: EagleTheme | string): Theme {
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
