import type { Meta, StoryObj } from "@storybook/react";
import type { PropsWithChildren } from "react";
import ThemeWrapper, { type EagleTheme } from "./ThemeWrapper";

const meta: Meta<typeof ThemeWrapper> = {
  title: "Components/ThemeWrapper",
  component: ThemeWrapper,
};
export default meta;

type Story = StoryObj<typeof ThemeWrapper>;

const eagleThemeBgColors: Record<EagleTheme, string> = {
  LIGHT: "rgb(248, 248, 249)",
  LIGHTGRAY: "rgb(222, 223, 224)",
  GRAY: "rgb(61, 62, 66)",
  DARK: "rgb(31, 32, 35)",
  BLUE: "rgb(23, 29, 53)",
  PURPLE: "rgb(34, 27, 42)",
};

export const EagleThemeWrapper = ({
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

export const Light: Story = {
  render: () => (
    <EagleThemeWrapper theme="LIGHT">
      <ThemeWrapper theme="LIGHT">
        <div className="text-black dark:text-white">LIGHT</div>
      </ThemeWrapper>
    </EagleThemeWrapper>
  ),
};

export const LightGray: Story = {
  render: () => (
    <EagleThemeWrapper theme="LIGHTGRAY">
      <ThemeWrapper theme="LIGHTGRAY">
        <div className="text-black dark:text-white">LIGHTGRAY</div>
      </ThemeWrapper>
    </EagleThemeWrapper>
  ),
};

export const Gray: Story = {
  render: () => (
    <EagleThemeWrapper theme="GRAY">
      <ThemeWrapper theme="GRAY">
        <div className="text-black dark:text-white">GRAY</div>
      </ThemeWrapper>
    </EagleThemeWrapper>
  ),
};

export const Dark: Story = {
  render: () => (
    <EagleThemeWrapper theme="DARK">
      <ThemeWrapper theme="DARK">
        <div className="text-black dark:text-white">DARK</div>
      </ThemeWrapper>
    </EagleThemeWrapper>
  ),
};

export const Blue: Story = {
  render: () => (
    <EagleThemeWrapper theme="BLUE">
      <ThemeWrapper theme="BLUE">
        <div className="text-black dark:text-white">BLUE</div>
      </ThemeWrapper>
    </EagleThemeWrapper>
  ),
};

export const Purple: Story = {
  render: () => (
    <EagleThemeWrapper theme="PURPLE">
      <ThemeWrapper theme="PURPLE">
        <div className="text-black dark:text-white">PURPLE</div>
      </ThemeWrapper>
    </EagleThemeWrapper>
  ),
};
