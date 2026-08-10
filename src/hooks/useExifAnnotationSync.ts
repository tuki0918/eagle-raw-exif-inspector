import {
  createExifAnnotationBlock,
  mergeExifAnnotation,
} from "@/utils/exifAnnotation";
import { useEffect } from "react";

export type ExifAnnotationSyncStatus =
  | "saved"
  | "unchanged"
  | "invalid"
  | "not-found"
  | "save-failed";

interface PendingSync {
  signature: string;
  promise: Promise<ExifAnnotationSyncStatus>;
}

const pendingSyncs = new Map<string, PendingSync>();

const performSync = async (
  itemId: string,
  metadata: Record<string, unknown>,
): Promise<ExifAnnotationSyncStatus> => {
  // Refresh the item after EXIF parsing so a recent manual annotation edit is
  // merged instead of being overwritten by the older selected-item snapshot.
  const item = await eagle.item.getById(itemId);
  if (!item) return "not-found";

  const previousAnnotation =
    typeof item.annotation === "string" ? item.annotation : "";
  const merged = mergeExifAnnotation(previousAnnotation, metadata);

  if (merged.status !== "updated") return merged.status;

  item.annotation = merged.annotation;

  try {
    const saved = await item.save();
    if (saved) return "saved";

    if (item.annotation === merged.annotation) {
      item.annotation = previousAnnotation;
    }
    return "save-failed";
  } catch (error) {
    if (item.annotation === merged.annotation) {
      item.annotation = previousAnnotation;
    }
    throw error;
  }
};

export const syncExifMetadataToAnnotation = async (
  itemId: string,
  metadata: Record<string, unknown>,
): Promise<ExifAnnotationSyncStatus> => {
  const signature = createExifAnnotationBlock(metadata);
  const pending = pendingSyncs.get(itemId);

  // React Strict Mode can run effects twice. Reuse an identical in-flight save,
  // while serializing a genuinely newer metadata payload for the same item.
  if (pending?.signature === signature) return await pending.promise;

  const promise = (async () => {
    if (pending) {
      try {
        await pending.promise;
      } catch {
        // The new attempt still gets a fresh Eagle Item and can proceed safely.
      }
    }

    return await performSync(itemId, metadata);
  })();

  pendingSyncs.set(itemId, { signature, promise });

  const clearPending = () => {
    if (pendingSyncs.get(itemId)?.promise === promise) {
      pendingSyncs.delete(itemId);
    }
  };
  void promise.then(clearPending, clearPending);

  return await promise;
};

interface UseExifAnnotationSyncOptions {
  enabled: boolean;
  itemId: string | null;
  metadata: Record<string, unknown> | null;
}

export function useExifAnnotationSync({
  enabled,
  itemId,
  metadata,
}: UseExifAnnotationSyncOptions) {
  useEffect(() => {
    if (!enabled || !itemId || !metadata) return;

    void syncExifMetadataToAnnotation(itemId, metadata)
      .then((status) => {
        if (status === "invalid") {
          console.warn(
            "Skipped EXIF annotation sync because its managed markers are invalid.",
          );
        } else if (status === "save-failed") {
          console.warn("Eagle failed to save the EXIF annotation.");
        }
      })
      .catch((error: unknown) => {
        console.warn("Failed to sync EXIF metadata to annotation:", error);
      });
  }, [enabled, itemId, metadata]);
}
