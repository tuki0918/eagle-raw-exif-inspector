import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Preview, ReactRenderer } from "@storybook/react";
import React from "react";
import EagleThemeWrapper from "../src/components/EagleThemeWrapper";
import ThemeWrapper from "../src/components/ThemeWrapper";
import "../src/index.css";
import "../src/App.css";
import "./preview.css";

// Define global variables required for Eagle environment in Storybook
if (typeof globalThis !== "undefined") {
  if (typeof globalThis.eagle === "undefined") {
    globalThis.eagle = {
      onPluginCreate: () => {},
      onThemeChanged: () => {},
      app: { theme: "LIGHT" },
      item: { getSelected: async () => [] },
    };
  }
  if (typeof globalThis.i18next === "undefined") {
    globalThis.i18next = {
      t: (key: string) => key,
    };
  }
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    withThemeByDataAttribute<ReactRenderer>({
      themes: {
        LIGHT: "light",
        LIGHTGRAY: "lightgray",
        GRAY: "gray",
        DARK: "dark",
        BLUE: "blue",
        PURPLE: "purple",
      },
      defaultTheme: "LIGHT",
      attributeName: "data-theme",
    }),

    (Story, context) => (
      <EagleThemeWrapper theme={context.globals.theme || "LIGHT"}>
        <ThemeWrapper theme={context.globals.theme || "LIGHT"}>
          <Story />
        </ThemeWrapper>
      </EagleThemeWrapper>
    ),
  ],
};

export default preview;
