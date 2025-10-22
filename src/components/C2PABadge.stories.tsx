import C2PABadge from "@/components/C2PABadge";
import type { C2PAInfo } from "@/types/c2pa.d.ts";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof C2PABadge> = {
  title: "Components/C2PABadge",
  component: C2PABadge,
  argTypes: {
    onDetailsClick: { action: "details clicked" },
  },
};
export default meta;

type Story = StoryObj<typeof C2PABadge>;

// Mock C2PA data with valid status
const mockC2PAInfoValid: C2PAInfo = {
  hasC2PA: true,
  manifestStore: {
    active_manifest: "manifest1",
    manifests: {
      manifest1: {
        title: "Original Image",
        format: "image/jpeg",
        instance_id: "xmp:iid:12345678-1234-1234-1234-123456789abc",
        claim_generator: "Adobe Photoshop 24.0",
        signature_info: {
          issuer: "Adobe Inc.",
          time: "2024-06-15T10:30:00Z",
          cert_serial_number: "123456789",
        },
        ingredients: [
          {
            title: "Background Layer",
            format: "image/png",
            relationship: "parentOf",
          },
          {
            title: "Overlay",
            format: "image/png",
            relationship: "componentOf",
          },
        ],
      },
    },
    validation_status: [],
  },
};

// Mock C2PA data with warning status
const mockC2PAInfoWarning: C2PAInfo = {
  hasC2PA: true,
  manifestStore: {
    active_manifest: "manifest1",
    manifests: {
      manifest1: {
        title: "Edited Image",
        format: "image/jpeg",
        claim_generator: "GIMP 2.10",
        signature_info: {
          issuer: "Generic CA",
          time: "2024-06-20T14:15:30Z",
        },
        ingredients: [],
      },
    },
    validation_status: [
      {
        code: "warning.timestamp",
        explanation: "Timestamp is not trusted",
      },
    ],
  },
};

// Mock C2PA data with error status
const mockC2PAInfoError: C2PAInfo = {
  hasC2PA: true,
  manifestStore: {
    active_manifest: "manifest1",
    manifests: {
      manifest1: {
        title: "Corrupted Image",
        format: "image/jpeg",
        claim_generator: "Unknown Generator",
        signature_info: {
          issuer: "Unknown Issuer",
          time: "2024-01-01T00:00:00Z",
        },
      },
    },
    validation_status: [
      {
        code: "error.signature_mismatch",
        explanation: "Signature verification failed",
      },
      {
        code: "error.manifest_invalid",
        explanation: "Manifest structure is invalid",
      },
    ],
  },
};

// Mock C2PA data with minimal information (unknown status)
const mockC2PAInfoMinimal: C2PAInfo = {
  hasC2PA: true,
  manifestStore: {
    active_manifest: "manifest1",
    manifests: {
      manifest1: {
        format: "image/jpeg",
      },
    },
  },
};

// No C2PA data (should not render)
const mockC2PAInfoNone: C2PAInfo = {
  hasC2PA: false,
};

export const ValidCredentials: Story = {
  args: {
    c2paInfo: mockC2PAInfoValid,
  },
};
ValidCredentials.storyName = "Valid - With Full Metadata";

export const ValidCredentialsWithDetailsButton: Story = {
  args: {
    c2paInfo: mockC2PAInfoValid,
    onDetailsClick: () => {
      console.log("Details clicked");
    },
  },
};
ValidCredentialsWithDetailsButton.storyName = "Valid - With Details Button";

export const WarningCredentials: Story = {
  args: {
    c2paInfo: mockC2PAInfoWarning,
    onDetailsClick: () => {
      console.log("Details clicked");
    },
  },
};
WarningCredentials.storyName = "Warning - Timestamp Issue";

export const ErrorCredentials: Story = {
  args: {
    c2paInfo: mockC2PAInfoError,
    onDetailsClick: () => {
      console.log("Details clicked");
    },
  },
};
ErrorCredentials.storyName = "Error - Signature Failed";

export const MinimalCredentials: Story = {
  args: {
    c2paInfo: mockC2PAInfoMinimal,
    onDetailsClick: () => {
      console.log("Details clicked");
    },
  },
};
MinimalCredentials.storyName = "Unknown Status - Minimal Data";

export const NoCredentials: Story = {
  args: {
    c2paInfo: mockC2PAInfoNone,
  },
};
NoCredentials.storyName = "No C2PA - Should Not Render";

// Theme variations for valid credentials
export const ValidLight: Story = {
  ...ValidCredentialsWithDetailsButton,
  globals: { theme: "LIGHT" },
};
ValidLight.storyName = "Theme - Light (Valid)";

export const ValidDark: Story = {
  ...ValidCredentialsWithDetailsButton,
  globals: { theme: "DARK" },
};
ValidDark.storyName = "Theme - Dark (Valid)";

export const ValidBlue: Story = {
  ...ValidCredentialsWithDetailsButton,
  globals: { theme: "BLUE" },
};
ValidBlue.storyName = "Theme - Blue (Valid)";

export const ValidPurple: Story = {
  ...ValidCredentialsWithDetailsButton,
  globals: { theme: "PURPLE" },
};
ValidPurple.storyName = "Theme - Purple (Valid)";

// Theme variations for warning status
export const WarningDark: Story = {
  ...WarningCredentials,
  globals: { theme: "DARK" },
};
WarningDark.storyName = "Theme - Dark (Warning)";

// Theme variations for error status
export const ErrorDark: Story = {
  ...ErrorCredentials,
  globals: { theme: "DARK" },
};
ErrorDark.storyName = "Theme - Dark (Error)";
