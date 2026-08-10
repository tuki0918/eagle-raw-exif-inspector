import { syncExifMetadataToAnnotation } from "@/hooks/useExifAnnotationSync";
import {
  EXIF_ANNOTATION_START_MARKER,
  createExifAnnotationBlock,
} from "@/utils/exifAnnotation";

const createDeferred = <T>() => {
  let resolve!: (value: T | PromiseLike<T>) => void;
  const promise = new Promise<T>((promiseResolve) => {
    resolve = promiseResolve;
  });

  return { promise, resolve };
};

const stubEagleGetById = (getById: ReturnType<typeof vi.fn>) => {
  vi.stubGlobal("eagle", {
    item: { getById },
  });
};

describe("syncExifMetadataToAnnotation", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("gets a fresh item, preserves its manual annotation, and saves the EXIF block", async () => {
    const metadata = { ISO: 400, Model: "Nikon Z8" };
    const save = vi.fn<() => Promise<boolean>>().mockResolvedValue(true);
    const item = {
      id: "item-1",
      fileURL: "file:///image.nef",
      annotation: "Keep this manual annotation.",
      save,
    };
    const getById = vi.fn().mockResolvedValue(item);
    stubEagleGetById(getById);

    await expect(
      syncExifMetadataToAnnotation("item-1", metadata),
    ).resolves.toBe("saved");

    expect(getById).toHaveBeenCalledTimes(1);
    expect(getById).toHaveBeenCalledWith("item-1");
    expect(save).toHaveBeenCalledTimes(1);
    expect(item.annotation).toBe(
      `Keep this manual annotation.\n${createExifAnnotationBlock(metadata)}`,
    );
  });

  it("does not save when the owned block already contains the same metadata", async () => {
    const metadata = { ISO: 640 };
    const annotation = `Manual header\n${createExifAnnotationBlock(metadata)}\nManual footer`;
    const save = vi.fn<() => Promise<boolean>>().mockResolvedValue(true);
    const item = {
      id: "item-1",
      fileURL: "file:///image.nef",
      annotation,
      save,
    };
    const getById = vi.fn().mockResolvedValue(item);
    stubEagleGetById(getById);

    await expect(
      syncExifMetadataToAnnotation("item-1", metadata),
    ).resolves.toBe("unchanged");

    expect(save).not.toHaveBeenCalled();
    expect(item.annotation).toBe(annotation);
  });

  it("does not change or save an annotation with invalid owned markers", async () => {
    const annotation = `Manual text\n${EXIF_ANNOTATION_START_MARKER}\n{}`;
    const save = vi.fn<() => Promise<boolean>>().mockResolvedValue(true);
    const item = {
      id: "item-1",
      fileURL: "file:///image.nef",
      annotation,
      save,
    };
    const getById = vi.fn().mockResolvedValue(item);
    stubEagleGetById(getById);

    await expect(
      syncExifMetadataToAnnotation("item-1", { ISO: 800 }),
    ).resolves.toBe("invalid");

    expect(save).not.toHaveBeenCalled();
    expect(item.annotation).toBe(annotation);
  });

  it("restores the in-memory annotation when Eagle returns false from save", async () => {
    const previousAnnotation = "Manual text before save";
    const save = vi.fn<() => Promise<boolean>>().mockResolvedValue(false);
    const item = {
      id: "item-1",
      fileURL: "file:///image.nef",
      annotation: previousAnnotation,
      save,
    };
    const getById = vi.fn().mockResolvedValue(item);
    stubEagleGetById(getById);

    await expect(
      syncExifMetadataToAnnotation("item-1", { ISO: 1000 }),
    ).resolves.toBe("save-failed");

    expect(save).toHaveBeenCalledTimes(1);
    expect(item.annotation).toBe(previousAnnotation);
  });

  it("restores the in-memory annotation and propagates a rejected save", async () => {
    const previousAnnotation = "Manual text before rejection";
    const saveError = new Error("Eagle save failed");
    const save = vi.fn<() => Promise<boolean>>().mockRejectedValue(saveError);
    const item = {
      id: "item-1",
      fileURL: "file:///image.nef",
      annotation: previousAnnotation,
      save,
    };
    const getById = vi.fn().mockResolvedValue(item);
    stubEagleGetById(getById);

    await expect(
      syncExifMetadataToAnnotation("item-1", { ISO: 1250 }),
    ).rejects.toBe(saveError);

    expect(save).toHaveBeenCalledTimes(1);
    expect(item.annotation).toBe(previousAnnotation);
  });

  it("deduplicates concurrent syncs for the same item and payload", async () => {
    const saveDeferred = createDeferred<boolean>();
    const save = vi.fn(() => saveDeferred.promise);
    const item = {
      id: "item-deduplicate",
      fileURL: "file:///image.nef",
      annotation: "Manual text",
      save,
    };
    const getById = vi.fn().mockResolvedValue(item);
    stubEagleGetById(getById);

    const firstSync = syncExifMetadataToAnnotation("item-deduplicate", {
      ISO: 1600,
    });
    const secondSync = syncExifMetadataToAnnotation("item-deduplicate", {
      ISO: 1600,
    });

    await vi.waitFor(() => expect(save).toHaveBeenCalledTimes(1));
    expect(getById).toHaveBeenCalledTimes(1);

    saveDeferred.resolve(true);
    await expect(Promise.all([firstSync, secondSync])).resolves.toEqual([
      "saved",
      "saved",
    ]);
    expect(getById).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledTimes(1);
  });

  it("serializes different payloads for one item and refreshes before saving the latest block", async () => {
    const firstMetadata = { ISO: 100 };
    const latestMetadata = { ISO: 3200 };
    const firstSaveDeferred = createDeferred<boolean>();
    const firstSave = vi.fn(() => firstSaveDeferred.promise);
    const latestSave = vi.fn<() => Promise<boolean>>().mockResolvedValue(true);
    const firstItem = {
      id: "item-serialize",
      fileURL: "file:///image.nef",
      annotation: "Original manual text",
      save: firstSave,
    };
    const latestItem = {
      id: "item-serialize",
      fileURL: "file:///image.nef",
      annotation: `Latest manual text\n${createExifAnnotationBlock(firstMetadata)}`,
      save: latestSave,
    };
    const getById = vi
      .fn()
      .mockResolvedValueOnce(firstItem)
      .mockResolvedValueOnce(latestItem);
    stubEagleGetById(getById);

    const firstSync = syncExifMetadataToAnnotation(
      "item-serialize",
      firstMetadata,
    );
    await vi.waitFor(() => expect(firstSave).toHaveBeenCalledTimes(1));

    const latestSync = syncExifMetadataToAnnotation(
      "item-serialize",
      latestMetadata,
    );
    await Promise.resolve();
    expect(getById).toHaveBeenCalledTimes(1);
    expect(latestSave).not.toHaveBeenCalled();

    firstSaveDeferred.resolve(true);
    await expect(Promise.all([firstSync, latestSync])).resolves.toEqual([
      "saved",
      "saved",
    ]);

    expect(getById).toHaveBeenCalledTimes(2);
    expect(getById).toHaveBeenNthCalledWith(1, "item-serialize");
    expect(getById).toHaveBeenNthCalledWith(2, "item-serialize");
    expect(latestSave).toHaveBeenCalledTimes(1);
    expect(latestItem.annotation).toBe(
      `Latest manual text\n${createExifAnnotationBlock(latestMetadata)}`,
    );
  });
});
