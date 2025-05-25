import type { Preview } from "@storybook/react";
import React from "react";
import EagleThemeWrapper from "../src/components/EagleThemeWrapper";
import ThemeWrapper from "../src/components/ThemeWrapper";
import "../src/index.css";
import "../src/App.css";

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
    (Story, context) => (
      <EagleThemeWrapper theme={context.globals.theme || "LIGHT"}>
        <ThemeWrapper theme={context.globals.theme || "LIGHT"}>
          <Story />
        </ThemeWrapper>
      </EagleThemeWrapper>
    ),
  ],
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Eagle Theme",
      defaultValue: "LIGHT",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "LIGHT", title: "Light" },
          { value: "LIGHTGRAY", title: "LightGray" },
          { value: "GRAY", title: "Gray" },
          { value: "DARK", title: "Dark" },
          { value: "BLUE", title: "Blue" },
          { value: "PURPLE", title: "Purple" },
        ],
      },
    },
  },
};

export default preview;
