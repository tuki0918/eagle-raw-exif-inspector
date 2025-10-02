import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PreferencesSection from "./PreferencesSection";

vi.mock("../hooks/useAutoSavePreference");

describe("PreferencesSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render collapsed by default", async () => {
    const { useAutoSavePreference } = await import(
      "../hooks/useAutoSavePreference"
    );
    vi.mocked(useAutoSavePreference).mockReturnValue({
      autoSaveEnabled: false,
      setAutoSaveEnabled: vi.fn(),
    });

    render(<PreferencesSection />);

    expect(screen.getByText("Preferences")).toBeInTheDocument();
    expect(
      screen.queryByText("Auto-save metadata to annotations"),
    ).not.toBeInTheDocument();
  });

  it("should expand when clicked", async () => {
    const { useAutoSavePreference } = await import(
      "../hooks/useAutoSavePreference"
    );
    vi.mocked(useAutoSavePreference).mockReturnValue({
      autoSaveEnabled: false,
      setAutoSaveEnabled: vi.fn(),
    });

    render(<PreferencesSection />);

    const button = screen.getByRole("button", { name: /Preferences/i });
    fireEvent.click(button);

    expect(
      screen.getByText("Auto-save metadata to annotations"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Automatically save EXIF metadata to Eagle item annotations when empty",
      ),
    ).toBeInTheDocument();
  });

  it("should show toggle with correct state when expanded", async () => {
    const { useAutoSavePreference } = await import(
      "../hooks/useAutoSavePreference"
    );
    vi.mocked(useAutoSavePreference).mockReturnValue({
      autoSaveEnabled: true,
      setAutoSaveEnabled: vi.fn(),
    });

    render(<PreferencesSection />);

    const button = screen.getByRole("button", { name: /Preferences/i });
    fireEvent.click(button);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("should call setAutoSaveEnabled when toggle is clicked", async () => {
    const mockSetAutoSaveEnabled = vi.fn();
    const { useAutoSavePreference } = await import(
      "../hooks/useAutoSavePreference"
    );
    vi.mocked(useAutoSavePreference).mockReturnValue({
      autoSaveEnabled: false,
      setAutoSaveEnabled: mockSetAutoSaveEnabled,
    });

    render(<PreferencesSection />);

    const button = screen.getByRole("button", { name: /Preferences/i });
    fireEvent.click(button);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(mockSetAutoSaveEnabled).toHaveBeenCalledWith(true);
  });
});
