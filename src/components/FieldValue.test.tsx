import FieldValue from "@/components/FieldValue";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("FieldValue", () => {
  const mockFormatValue = (value: unknown) => value;

  beforeAll(() => {
    vi.stubGlobal("i18next", { t: (key: string) => key });
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("renders text without link for non-URL values", () => {
    render(
      <FieldValue
        fieldName="test"
        value="Hello World"
        formatValue={mockFormatValue}
      />,
    );
    expect(screen.getByText("Hello World")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders link button for URL values", () => {
    const url = "https://example.com";
    render(
      <FieldValue fieldName="test" value={url} formatValue={mockFormatValue} />,
    );
    expect(screen.getByText(url)).toBeInTheDocument();
    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", url);
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders http URL correctly", () => {
    const url = "http://example.com";
    render(
      <FieldValue fieldName="test" value={url} formatValue={mockFormatValue} />,
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", url);
  });

  it("collapses and expands long values when enabled", () => {
    render(
      <FieldValue
        fieldName="long"
        value={"x".repeat(300)}
        formatValue={mockFormatValue}
        collapseLongValues
      />,
    );

    const showMoreButton = screen.getByRole("button", {
      name: "message.showMore",
    });
    expect(showMoreButton).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(showMoreButton);

    expect(
      screen.getByRole("button", { name: "message.showLess" }),
    ).toHaveAttribute("aria-expanded", "true");
  });
});
