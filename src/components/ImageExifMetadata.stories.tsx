import type { Meta, StoryObj } from "@storybook/react";
import ImageExifMetadata from "./ImageExifMetadata";

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
    },
  },
  render: (args) => <ImageExifMetadata item={args.item} />,
};
export default meta;

type Story = StoryObj<typeof ImageExifMetadata>;

export const Default: Story = {};
