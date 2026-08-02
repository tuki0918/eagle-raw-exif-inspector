import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Preview, ReactRenderer } from "@storybook/react";
import React from "react";
import EagleThemeWrapper from "../src/components/EagleThemeWrapper";
import ThemeWrapper from "../src/components/ThemeWrapper";
import "../src/index.css";
import "../src/App.css";
import "./preview.css";

const englishMessages: Record<string, string> = {
  notFound: "No data found.",
  copy: "Copy",
  copied: "Copied",
  copyFailed: "Failed to copy.",
  addFavorite: "Add to favorites",
  removeFavorite: "Remove from favorites",
  hideField: "Hide field",
  showField: "Show field",
  visibleFields: "Visible",
  hiddenFields: "Hidden",
  fieldVisibility: "Field visibility",
  noVisibleFields: "No visible fields.",
  noHiddenFields: "No hidden fields.",
  formatJson: "Pretty print JSON",
  expandJson: "Expand JSON",
  unformatJson: "Compact JSON",
  displaySettings: "Settings",
  autoFormatJson: "Format JSON automatically",
  collapseLongValues: "Collapse long values",
  favoritesFirst: "Show favorites first",
  showFullFieldPaths: "Show full paths for nested fields",
  includeFieldNameInCopy: "Include field name when copying",
  copyFieldValue: "Copy field value",
  showMore: "Show more",
  showLess: "Show less",
};

// Define global variables required for Eagle environment in Storybook
if (typeof globalThis !== "undefined") {
  if (typeof globalThis.eagle === "undefined") {
    globalThis.eagle = {
      onPluginCreate: () => {},
      onThemeChanged: () => {},
      app: { theme: "LIGHT", isDarkColors: () => false },
      item: { getSelected: async () => [] },
    };
  }
  if (typeof globalThis.i18next === "undefined") {
    globalThis.i18next = {
      t: (key: string) =>
        key.startsWith("message.")
          ? (englishMessages[key.slice("message.".length)] ?? key)
          : key,
    };
  }

  // Mock localStorage for Storybook
  if (typeof globalThis.localStorage === "undefined") {
    const localStorageMock = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    };
    Object.defineProperty(globalThis, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
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
