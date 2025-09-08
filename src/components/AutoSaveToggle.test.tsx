import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AutoSaveToggle } from "./AutoSaveToggle";

// Mock the useAutoSavePreference hook
vi.mock("../hooks/useAutoSavePreference", () => ({
  useAutoSavePreference: vi.fn(),
}));

describe("AutoSaveToggle", () => {
  const mockSetAutoSaveEnabled = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render toggle with correct initial state when enabled", async () => {
    const { useAutoSavePreference } = await import("../hooks/useAutoSavePreference");
    vi.mocked(useAutoSavePreference).mockReturnValue({
      autoSaveEnabled: true,
      setAutoSaveEnabled: mockSetAutoSaveEnabled,
    });

    render(<AutoSaveToggle />);

    expect(screen.getByText("Auto-save metadata to annotations")).toBeInTheDocument();
    expect(screen.getByText("Automatically save EXIF metadata to Eagle item annotations when empty")).toBeInTheDocument();
    
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("should render toggle with correct initial state when disabled", async () => {
    const { useAutoSavePreference } = await import("../hooks/useAutoSavePreference");
    vi.mocked(useAutoSavePreference).mockReturnValue({
      autoSaveEnabled: false,
      setAutoSaveEnabled: mockSetAutoSaveEnabled,
    });

    render(<AutoSaveToggle />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("should call setAutoSaveEnabled when toggle is clicked", async () => {
    const { useAutoSavePreference } = await import("../hooks/useAutoSavePreference");
    vi.mocked(useAutoSavePreference).mockReturnValue({
      autoSaveEnabled: false,
      setAutoSaveEnabled: mockSetAutoSaveEnabled,
    });

    render(<AutoSaveToggle />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(mockSetAutoSaveEnabled).toHaveBeenCalledWith(true);
  });
});