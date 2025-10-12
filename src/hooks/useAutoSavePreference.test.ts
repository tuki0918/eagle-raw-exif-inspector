import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAutoSavePreference } from "./useAutoSavePreference";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("useAutoSavePreference", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should default to false when no stored preference exists", () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useAutoSavePreference());

    expect(result.current.autoSaveEnabled).toBe(false);
    expect(localStorageMock.getItem).toHaveBeenCalledWith(
      "eagle-exif-auto-save-enabled",
    );
  });

  it("should load stored preference when it exists", () => {
    localStorageMock.getItem.mockReturnValue("true");

    const { result } = renderHook(() => useAutoSavePreference());

    expect(result.current.autoSaveEnabled).toBe(true);
  });

  it("should save preference to localStorage when changed", () => {
    localStorageMock.getItem.mockReturnValue("false");

    const { result } = renderHook(() => useAutoSavePreference());

    act(() => {
      result.current.setAutoSaveEnabled(true);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "eagle-exif-auto-save-enabled",
      "true",
    );
    expect(result.current.autoSaveEnabled).toBe(true);
  });

  it("should handle invalid JSON in localStorage gracefully", () => {
    localStorageMock.getItem.mockReturnValue("invalid-json");

    // This should not throw an error, but fall back to default
    expect(() => renderHook(() => useAutoSavePreference())).not.toThrow();
  });
});
