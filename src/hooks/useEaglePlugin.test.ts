import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useEaglePlugin } from './useEaglePlugin';

// Mock the eagle global object
const mockEagle = {
  onPluginCreate: vi.fn(),
  onThemeChanged: vi.fn(),
  app: {
    theme: 'LIGHT'
  },
  item: {
    getSelected: vi.fn(),
    modifyTags: vi.fn()
  }
};

// Mock the parseMetadata function
vi.mock('../utils/exif', () => ({
  parseMetadata: vi.fn()
}));

describe('useEaglePlugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set up global eagle object
    (global as Record<string, unknown>).eagle = mockEagle;
  });

  it('should save metadata to annotation when annotation is empty', async () => {
    const { parseMetadata: parseMetadataModule } = await import('../utils/exif');
    const mockParseMetadata = parseMetadataModule as ReturnType<typeof vi.fn>;
    
    // Mock selected item with empty annotation
    const mockItem = {
      id: 'test-id',
      filePath: '/path/to/image.jpg',
      annotation: ''
    };
    
    const mockMetadata = {
      Make: 'Canon',
      Model: 'EOS R5',
      ISO: 100
    };

    // Setup mocks
    mockEagle.item.getSelected.mockResolvedValue([mockItem]);
    mockParseMetadata.mockResolvedValue(mockMetadata);
    mockEagle.item.modifyTags.mockResolvedValue({});

    const { result } = renderHook(() => useEaglePlugin());

    // Trigger the plugin creation callback
    const createCallback = mockEagle.onPluginCreate.mock.calls[0][0];
    await createCallback();

    await waitFor(() => {
      expect(result.current.item).toEqual(mockMetadata);
    });

    // Verify that modifyTags was called with the metadata as annotation
    expect(mockEagle.item.modifyTags).toHaveBeenCalledWith({
      id: 'test-id',
      annotation: JSON.stringify(mockMetadata, null, 2)
    });
  });

  it('should not save metadata to annotation when annotation already exists', async () => {
    const { parseMetadata: parseMetadataModule } = await import('../utils/exif');
    const mockParseMetadata = parseMetadataModule as ReturnType<typeof vi.fn>;
    
    // Mock selected item with existing annotation
    const mockItem = {
      id: 'test-id',
      filePath: '/path/to/image.jpg',
      annotation: 'Existing annotation'
    };
    
    const mockMetadata = {
      Make: 'Canon',
      Model: 'EOS R5'
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

    // Verify that modifyTags was NOT called since annotation already exists
    expect(mockEagle.item.modifyTags).not.toHaveBeenCalled();
  });

  it('should not save metadata when no metadata is extracted', async () => {
    const { parseMetadata: parseMetadataModule } = await import('../utils/exif');
    const mockParseMetadata = parseMetadataModule as ReturnType<typeof vi.fn>;
    
    // Mock selected item with empty annotation
    const mockItem = {
      id: 'test-id',
      filePath: '/path/to/image.jpg',
      annotation: ''
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

    // Verify that modifyTags was NOT called since no metadata was extracted
    expect(mockEagle.item.modifyTags).not.toHaveBeenCalled();
  });
});