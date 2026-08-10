import ImageExifMetadata from "@/components/ImageExifMetadata";
import { createExifAnnotationBlock } from "@/utils/exifAnnotation";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

const clipboardWriteText = vi.fn();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

Object.defineProperty(navigator, "clipboard", {
  value: { writeText: clipboardWriteText },
  configurable: true,
});

describe("ImageExifMetadata", () => {
  beforeAll(() => {
    vi.stubGlobal("i18next", { t: (key: string) => key });
  });

  beforeEach(() => {
    localStorageMock.getItem.mockReset();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockReset();
    clipboardWriteText.mockReset();
    clipboardWriteText.mockResolvedValue(undefined);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("renders metadata items correctly", () => {
    const item = {
      __STRING__: "ABC",
      __NUMBER__: 123,
      __BOOLEAN__: true,
      //   __DATE__: ...,
      __ARRAY__: [1, 2, 3],
      __OBJECT__: {
        one: 1,
        two: 2,
      },
      __NULL__: null,
      _UNDEFINED_: undefined,
    };
    render(<ImageExifMetadata item={item} />);
    expect(screen.getByText("__STRING__")).toBeInTheDocument();
    expect(screen.getByText("ABC")).toBeInTheDocument();
    expect(screen.getByText("__NUMBER__")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
    expect(screen.getByText("__BOOLEAN__")).toBeInTheDocument();
    expect(screen.getByText("true")).toBeInTheDocument();
    // expect(screen.getByText("__DATE__")).toBeInTheDocument();
    // expect(screen.getByText("...")).toBeInTheDocument();
    expect(screen.getByText("__ARRAY__")).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === "PRE" &&
          element.textContent === JSON.stringify([1, 2, 3], null, 2),
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("__OBJECT__")).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === "PRE" &&
          element.textContent === JSON.stringify({ one: 1, two: 2 }, null, 2),
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("__NULL__")).toBeInTheDocument();
    expect(screen.getByText("null")).toBeInTheDocument();
    expect(screen.getByText("_UNDEFINED_")).toBeInTheDocument();
    expect(screen.getByText("undefined")).toBeInTheDocument();
  });

  it("renders not found message when item is null", () => {
    render(<ImageExifMetadata item={null} />);
    expect(screen.getByText("message.notFound")).toBeInTheDocument();
  });

  it("separates visible and hidden fields into counted tabs", async () => {
    localStorageMock.getItem.mockImplementation((key: string) =>
      key === "exif-field-preferences"
        ? JSON.stringify({ favorites: [], hidden: ["HiddenField"] })
        : null,
    );

    render(
      <ImageExifMetadata
        item={{ VisibleField: "visible", HiddenField: "hidden" }}
      />,
    );

    const visibleTab = await screen.findByRole("tab", {
      name: "message.visibleFields (1)",
    });
    const hiddenTab = screen.getByRole("tab", {
      name: "message.hiddenFields (1)",
    });

    expect(visibleTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("VisibleField")).toBeInTheDocument();
    expect(screen.queryByText("HiddenField")).not.toBeInTheDocument();

    fireEvent.click(hiddenTab);

    expect(hiddenTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("HiddenField")).toBeInTheDocument();
    expect(screen.queryByText("VisibleField")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "message.showField" }));

    expect(
      await screen.findByRole("tab", { name: "message.visibleFields (2)" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "message.hiddenFields (0)" }),
    ).toBeInTheDocument();
    expect(screen.getByText("message.noHiddenFields")).toBeInTheDocument();
  });

  it("copies only the field value by default", async () => {
    render(<ImageExifMetadata item={{ Model: "XYZ" }} />);

    fireEvent.click(
      screen.getByRole("button", { name: "message.copyFieldValue: Model" }),
    );

    await waitFor(() => expect(clipboardWriteText).toHaveBeenCalledWith("XYZ"));
  });

  it("includes the field name when the copy setting is enabled", async () => {
    localStorageMock.getItem.mockImplementation((key: string) =>
      key === "exif-display-settings"
        ? JSON.stringify({
            version: 1,
            settings: { includeFieldNameInCopy: true },
          })
        : null,
    );

    render(<ImageExifMetadata item={{ Model: "XYZ" }} />);
    fireEvent.click(
      screen.getByRole("button", { name: "message.copyFieldValue: Model" }),
    );

    await waitFor(() =>
      expect(clipboardWriteText).toHaveBeenCalledWith("Model: XYZ"),
    );
  });

  it("shows display settings in the content area and persists changes", () => {
    render(<ImageExifMetadata item={{ Model: "XYZ" }} />);

    fireEvent.click(
      screen.getByRole("tab", { name: "message.displaySettings" }),
    );
    expect(screen.queryByText("XYZ")).not.toBeInTheDocument();
    const includeNameSwitch = screen.getByRole("switch", {
      name: "message.includeFieldNameInCopy",
    });
    const autoSaveAnnotationSwitch = screen.getByRole("switch", {
      name: "message.autoSaveMetadataToAnnotation",
    });

    expect(
      screen.getByRole("switch", { name: "message.autoFormatJson" }),
    ).toHaveAttribute("aria-checked", "true");
    expect(
      screen.getByRole("switch", { name: "message.collapseLongValues" }),
    ).toHaveAttribute("aria-checked", "true");
    expect(
      screen.getByRole("switch", { name: "message.favoritesFirst" }),
    ).toHaveAttribute("aria-checked", "true");
    expect(
      screen.getByRole("switch", { name: "message.showFullFieldPaths" }),
    ).toHaveAttribute("aria-checked", "false");
    expect(includeNameSwitch).toHaveAttribute("aria-checked", "false");
    expect(autoSaveAnnotationSwitch).toHaveAttribute("aria-checked", "false");
    fireEvent.click(includeNameSwitch);
    expect(includeNameSwitch).toHaveAttribute("aria-checked", "true");
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "exif-display-settings",
      expect.stringContaining('"includeFieldNameInCopy":true'),
    );
  });

  it("syncs the current metadata after annotation auto-save is enabled", async () => {
    const metadata = { Model: "XYZ", ISO: 200 };
    const eagleItem = {
      id: "item-1",
      fileURL: "file:///image.png",
      annotation: "Manual note",
      save: vi.fn().mockResolvedValue(true),
    };
    const getById = vi.fn().mockResolvedValue(eagleItem);
    vi.stubGlobal("eagle", { item: { getById } });

    render(<ImageExifMetadata item={metadata} itemId={eagleItem.id} />);

    expect(getById).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("tab", { name: "message.displaySettings" }),
    );
    fireEvent.click(
      screen.getByRole("switch", {
        name: "message.autoSaveMetadataToAnnotation",
      }),
    );

    await waitFor(() => expect(eagleItem.save).toHaveBeenCalledTimes(1));
    expect(getById).toHaveBeenCalledWith(eagleItem.id);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "exif-display-settings",
      expect.stringContaining('"autoSaveMetadataToAnnotation":true'),
    );
    expect(eagleItem.annotation).toBe(
      `Manual note\n${createExifAnnotationBlock(metadata)}`,
    );
  });

  it("uses the full path for nested fields when enabled", () => {
    localStorageMock.getItem.mockImplementation((key: string) =>
      key === "exif-display-settings"
        ? JSON.stringify({
            version: 1,
            settings: { showFullFieldPaths: true },
          })
        : null,
    );

    render(<ImageExifMetadata item={{ Parameters: { seed: 123 } }} />);
    fireEvent.click(screen.getByRole("button", { name: "message.expandJson" }));

    expect(screen.getByText("Parameters.seed")).toBeInTheDocument();
  });

  it("keeps the source field order when favorites-first is disabled", () => {
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === "exif-field-preferences") {
        return JSON.stringify({ favorites: ["Second"], hidden: [] });
      }
      if (key === "exif-display-settings") {
        return JSON.stringify({
          version: 1,
          settings: { favoritesFirst: false },
        });
      }
      return null;
    });

    render(<ImageExifMetadata item={{ First: 1, Second: 2 }} />);
    const firstField = screen.getByText("First");
    const secondField = screen.getByText("Second");

    expect(
      firstField.compareDocumentPosition(secondField) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("keeps JSON compact when automatic formatting is disabled", () => {
    localStorageMock.getItem.mockImplementation((key: string) =>
      key === "exif-display-settings"
        ? JSON.stringify({
            version: 1,
            settings: { autoFormatJson: false },
          })
        : null,
    );

    render(<ImageExifMetadata item={{ Parameters: { seed: 123 } }} />);

    expect(screen.getByText('{"seed":123}')).toBeInTheDocument();
  });
});
