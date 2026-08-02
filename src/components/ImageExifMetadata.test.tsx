import ImageExifMetadata from "@/components/ImageExifMetadata";
import { fireEvent, render, screen } from "@testing-library/react";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

describe("ImageExifMetadata", () => {
  beforeAll(() => {
    vi.stubGlobal("i18next", { t: (key: string) => key });
  });

  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
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
    expect(screen.getByText("[1,2,3]")).toBeInTheDocument();
    expect(screen.getByText("__OBJECT__")).toBeInTheDocument();
    expect(screen.getByText('{"one":1,"two":2}')).toBeInTheDocument();
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
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify({ favorites: [], hidden: ["HiddenField"] }),
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
});
