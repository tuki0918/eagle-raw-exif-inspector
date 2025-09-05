import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useEaglePlugin } from "./useEaglePlugin";

// Mock the eagle global object
const mockEagle = {
  onPluginCreate: vi.fn(),
  onThemeChanged: vi.fn(),
  app: {
    theme: "LIGHT",
  },
  item: {
    getSelected: vi.fn(),
  },
};

// Mock the parseMetadata function
vi.mock("../utils/exif", () => ({
  parseMetadata: vi.fn(),
}));

describe("useEaglePlugin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set up global eagle object
    (global as Record<string, unknown>).eagle = mockEagle;
  });

  it("should save metadata to annotation when annotation is empty", async () => {
    const { parseMetadata: parseMetadataModule } = await import(
      "../utils/exif"
    );
    const mockParseMetadata = parseMetadataModule as ReturnType<typeof vi.fn>;

    // Mock selected item with empty annotation and save method
    const mockSave = vi.fn().mockResolvedValue({});
    const mockItem = {
      id: "test-id",
      filePath: "/path/to/image.jpg",
      annotation: "",
      save: mockSave,
    };

    const mockMetadata = {
      Make: "Canon",
      Model: "EOS R5",
      ISO: 100,
    };

    // Setup mocks
    mockEagle.item.getSelected.mockResolvedValue([mockItem]);
    mockParseMetadata.mockResolvedValue(mockMetadata);

    const { result } = renderHook(() => useEaglePlugin());

    // Trigger the plugin creation callback
    const createCallback = mockEagle.onPluginCreate.mock.calls[0][0];
    await createCallback();

    await waitFor(() => {
      expect(result.current.item).toEqual(mockMetadata);
    });

    // Verify that annotation was set and save was called
    expect(mockItem.annotation).toBe(JSON.stringify(mockMetadata, null, 2));
    expect(mockSave).toHaveBeenCalled();
  });

  it("should not save metadata to annotation when annotation already exists", async () => {
    const { parseMetadata: parseMetadataModule } = await import(
      "../utils/exif"
    );
    const mockParseMetadata = parseMetadataModule as ReturnType<typeof vi.fn>;

    // Mock selected item with existing annotation and save method
    const mockSave = vi.fn().mockResolvedValue({});
    const mockItem = {
      id: "test-id",
      filePath: "/path/to/image.jpg",
      annotation: "Existing annotation",
      save: mockSave,
    };

    const mockMetadata = {
      Make: "Canon",
      Model: "EOS R5",
    };

    // Setup mocks
    mockEagle.item.getSelected.mockResolvedValue([mockItem]);
    mockParseMetadata.mockResolvedValue(mockMetadata);

    const { result } = renderHook(() => useEaglePlugin());

    // Trigger the plugin creation callback
    const createCallback = mockEagle.onPluginCreate.mock.calls[0][0];
    await createCallback();

    await waitFor(() => {
      expect(result.current.item).toEqual(mockMetadata);
    });

    // Verify that save was NOT called since annotation already exists
    expect(mockSave).not.toHaveBeenCalled();
    // Verify annotation was not changed
    expect(mockItem.annotation).toBe("Existing annotation");
  });

  it("should not save metadata when no metadata is extracted", async () => {
    const { parseMetadata: parseMetadataModule } = await import(
      "../utils/exif"
    );
    const mockParseMetadata = parseMetadataModule as ReturnType<typeof vi.fn>;

    // Mock selected item with empty annotation and save method
    const mockSave = vi.fn().mockResolvedValue({});
    const mockItem = {
      id: "test-id",
      filePath: "/path/to/image.jpg",
      annotation: "",
      save: mockSave,
    };

    // Setup mocks - no metadata extracted
    mockEagle.item.getSelected.mockResolvedValue([mockItem]);
    mockParseMetadata.mockResolvedValue(null);

    const { result } = renderHook(() => useEaglePlugin());

    // Trigger the plugin creation callback
    const createCallback = mockEagle.onPluginCreate.mock.calls[0][0];
    await createCallback();

    await waitFor(() => {
      expect(result.current.item).toBeNull();
    });

    // Verify that save was NOT called since no metadata was extracted
    expect(mockSave).not.toHaveBeenCalled();
  });
});
