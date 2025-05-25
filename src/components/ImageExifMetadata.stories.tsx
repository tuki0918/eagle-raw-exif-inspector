import type { Meta, StoryObj } from "@storybook/react";
import ImageExifMetadata from "./ImageExifMetadata";
import ThemeWrapper from "./ThemeWrapper";
import { EagleThemeWrapper } from "./ThemeWrapper.stories";

const meta: Meta<typeof ImageExifMetadata> = {
  title: "Components/ImageExifMetadata",
  component: ImageExifMetadata,
};
export default meta;

type Story = StoryObj<typeof ImageExifMetadata>;

const sampleItem = {
  Make: "Canon",
  Model: "EOS 5D Mark IV",
  ISO: 100,
  ExposureTime: "1/200",
  FNumber: 2.8,
  DateTimeOriginal: "2024:06:01 12:34:56",
  FocalLength: 50,
  Flash: false,
};

export const Light: Story = {
  render: () => (
    <EagleThemeWrapper theme="LIGHT">
      <ThemeWrapper theme="LIGHT">
        <ImageExifMetadata item={sampleItem} />
      </ThemeWrapper>
    </EagleThemeWrapper>
  ),
};

export const LightGray: Story = {
  render: () => (
    <EagleThemeWrapper theme="LIGHTGRAY">
      <ThemeWrapper theme="LIGHTGRAY">
        <ImageExifMetadata item={sampleItem} />
      </ThemeWrapper>
    </EagleThemeWrapper>
  ),
};

export const Gray: Story = {
  render: () => (
    <EagleThemeWrapper theme="GRAY">
      <ThemeWrapper theme="GRAY">
        <ImageExifMetadata item={sampleItem} />
      </ThemeWrapper>
    </EagleThemeWrapper>
  ),
};

export const Dark: Story = {
  render: () => (
    <EagleThemeWrapper theme="DARK">
      <ThemeWrapper theme="DARK">
        <ImageExifMetadata item={sampleItem} />
      </ThemeWrapper>
    </EagleThemeWrapper>
  ),
};

export const Blue: Story = {
  render: () => (
    <EagleThemeWrapper theme="BLUE">
      <ThemeWrapper theme="BLUE">
        <ImageExifMetadata item={sampleItem} />
      </ThemeWrapper>
    </EagleThemeWrapper>
  ),
};

export const Purple: Story = {
  render: () => (
    <EagleThemeWrapper theme="PURPLE">
      <ThemeWrapper theme="PURPLE">
        <ImageExifMetadata item={sampleItem} />
      </ThemeWrapper>
    </EagleThemeWrapper>
  ),
};
