import type { PropsWithChildren } from "react";

export type EagleTheme =
  | "LIGHT"
  | "LIGHTGRAY"
  | "GRAY"
  | "DARK"
  | "BLUE"
  | "PURPLE";

const eagleThemeBgColors: Record<EagleTheme, string> = {
  LIGHT: "rgb(248, 248, 249)",
  LIGHTGRAY: "rgb(222, 223, 224)",
  GRAY: "rgb(61, 62, 66)",
  DARK: "rgb(31, 32, 35)",
  BLUE: "rgb(23, 29, 53)",
  PURPLE: "rgb(34, 27, 42)",
};

const EagleThemeWrapper = ({
  theme,
  children,
}: PropsWithChildren<{ theme: EagleTheme }>) => (
  <div
    style={{
      backgroundColor: eagleThemeBgColors[theme],
      minHeight: 200,
      padding: 16,
    }}
  >
    {children}
  </div>
);

export default EagleThemeWrapper;
