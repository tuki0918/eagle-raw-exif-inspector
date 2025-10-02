import type { Meta, StoryObj } from "@storybook/react";
import PreferencesSection from "./PreferencesSection";

const meta = {
  title: "Components/PreferencesSection",
  component: PreferencesSection,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PreferencesSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAutoSaveEnabled: Story = {
  beforeEach: () => {
    localStorage.setItem("eagle-exif-auto-save-enabled", "true");
  },
};

export const WithAutoSaveDisabled: Story = {
  beforeEach: () => {
    localStorage.setItem("eagle-exif-auto-save-enabled", "false");
  },
};
