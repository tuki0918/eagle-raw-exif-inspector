import FieldValue from "@/components/FieldValue";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("FieldValue", () => {
  const mockFormatValue = (value: unknown) => value;

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
});
