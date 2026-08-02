import ImageExifMetadata from "@/components/ImageExifMetadata";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ImageExifMetadata> = {
  title: "Components/ImageExifMetadata",
  component: ImageExifMetadata,
  args: {
    item: {
      Make: "ABC",
      Model: "XYZ",
      ISO: 100,
      ExposureTime: "1/200",
      FNumber: 2.8,
      DateTimeOriginal: "2024:06:01 12:34:56",
      FocalLength: 50,
      Flash: false,
      LensInfo: "50mm f/1.8",
      WhiteBalance: "Auto",
      ColorSpace: "sRGB",
      ExifVersion: "0232",
      Software: "Camera Software v1.0",
      Comment1: {
        text: "This is a comment",
      },
      Comment2: ["This is the first comment", "This is the second comment"],
    },
  },
  render: (args) => <ImageExifMetadata item={args.item} />,
};
export default meta;

type Story = StoryObj<typeof ImageExifMetadata>;

const readmeDemoItem = {
  Make: "Northstar Camera Co.",
  Model: "Aurora X2",
  ExposureTime: "1/125",
  FNumber: 2.8,
  ISOSpeedRatings: 200,
  MakerNote: {
    DriveMode: "Single",
    FocusMode: "AF-S",
    WhiteBalance: "Auto",
    MeteringMode: "Multi-segment",
    ImageStabilization: "On",
    ShutterCount: 1842,
  },
  LensModel: "NS 35mm F1.8",
  DateTimeOriginal: "2025:06:15 18:42:10",
};

const withReadmeDemoState: NonNullable<Story["decorators"]>[number] = (
  Story,
) => {
  localStorage.setItem(
    "exif-field-preferences",
    JSON.stringify({
      favorites: ["Make"],
      hidden: ["LensModel", "DateTimeOriginal"],
    }),
  );
  localStorage.setItem(
    "exif-display-settings",
    JSON.stringify({
      version: 1,
      settings: {
        autoFormatJson: true,
        collapseLongValues: true,
        favoritesFirst: true,
        showFullFieldPaths: false,
        includeFieldNameInCopy: false,
      },
    }),
  );

  return <Story />;
};

const readmeDemoStory: Story = {
  args: { item: readmeDemoItem },
  decorators: [withReadmeDemoState],
};

export const Default: Story = {};

export const ReadmeLight: Story = {
  ...readmeDemoStory,
  globals: { theme: "LIGHT" },
};
ReadmeLight.storyName = "README - Light";

export const ReadmeDark: Story = {
  ...readmeDemoStory,
  globals: { theme: "DARK" },
};
ReadmeDark.storyName = "README - Dark";

export const Light: Story = { ...Default, globals: { theme: "LIGHT" } };
Light.storyName = "Theme - Light";

export const LightGray: Story = { ...Default, globals: { theme: "LIGHTGRAY" } };
LightGray.storyName = "Theme - LightGray";

export const Gray: Story = { ...Default, globals: { theme: "GRAY" } };
Gray.storyName = "Theme - Gray";

export const Dark: Story = { ...Default, globals: { theme: "DARK" } };
Dark.storyName = "Theme - Dark";

export const Blue: Story = { ...Default, globals: { theme: "BLUE" } };
Blue.storyName = "Theme - Blue";

export const Purple: Story = { ...Default, globals: { theme: "PURPLE" } };
Purple.storyName = "Theme - Purple";

export const NotFound: Story = {
  args: {
    item: null,
  },
};

export const WithUrl: Story = {
  args: {
    item: {
      ...(meta.args?.item as object),
      Website: "https://example.com",
      Portfolio: "http://portfolio.example.com",
    },
  },
};
