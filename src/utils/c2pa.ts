import { createC2pa } from "@contentauth/c2pa-web";
import type {
  C2PAInfo,
  C2PAMetadata,
  ManifestStore,
} from "@/types/c2pa.d.ts";

// Singleton instance for c2pa
let c2paInstance: Awaited<ReturnType<typeof createC2pa>> | null = null;
let isInitializing = false;
let initPromise: Promise<Awaited<ReturnType<typeof createC2pa>>> | null = null;

/**
 * Get or initialize C2PA instance (singleton pattern)
 */
async function getC2paInstance() {
  if (c2paInstance) {
    return c2paInstance;
  }

  // If already initializing, wait for that promise
  if (isInitializing && initPromise) {
    return initPromise;
  }

  isInitializing = true;

  try {
    // Use inline version for simplicity (includes WASM as base64)
    // For production, consider using separate WASM file for better performance
    initPromise = (async () => {
      const { createC2pa: createC2paInline } = await import(
        "@contentauth/c2pa-web/inline"
      );
      return await createC2paInline();
    })();

    c2paInstance = await initPromise;
    return c2paInstance;
  } catch (error) {
    console.error("Failed to initialize C2PA:", error);
    throw error;
  } finally {
    isInitializing = false;
  }
}

/**
 * Parse C2PA metadata from a file path
 * @param filePath - The file path or URL to check for C2PA data
 * @returns C2PAInfo object with hasC2PA flag and optional manifest store
 */
export async function parseC2PAMetadata(
  filePath: string,
): Promise<C2PAInfo> {
  try {
    const c2pa = await getC2paInstance();

    // Fetch the file
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const mimeType = blob.type || "application/octet-stream";

    // Create a reader from the blob
    const reader = await c2pa.reader.fromBlob(mimeType, blob);

    if (!reader) {
      return { hasC2PA: false, error: "Failed to create C2PA reader" };
    }

    try {
      // Get the manifest store
      const manifestStore = await reader.manifestStore();

      if (!manifestStore || Object.keys(manifestStore).length === 0) {
        return { hasC2PA: false };
      }

      return {
        hasC2PA: true,
        manifestStore: manifestStore as ManifestStore,
      };
    } finally {
      // Always free the reader to prevent memory leaks
      await reader.free();
    }
  } catch (error) {
    console.error("Failed to parse C2PA metadata:", error);
    return {
      hasC2PA: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Extract simplified C2PA metadata for UI display
 * @param c2paInfo - The C2PAInfo object from parseC2PAMetadata
 * @returns Simplified metadata object for display
 */
export function extractC2PAMetadata(c2paInfo: C2PAInfo): C2PAMetadata | null {
  if (!c2paInfo.hasC2PA || !c2paInfo.manifestStore) {
    return null;
  }

  const { manifestStore } = c2paInfo;
  const activeManifestLabel = manifestStore.active_manifest;

  if (!activeManifestLabel || !manifestStore.manifests) {
    return null;
  }

  const activeManifest = manifestStore.manifests[activeManifestLabel];

  if (!activeManifest) {
    return null;
  }

  // Extract key information
  const metadata: C2PAMetadata = {
    title: activeManifest.title,
    claimGenerator: activeManifest.claim_generator,
    signatureIssuer: activeManifest.signature_info?.issuer,
    signatureTime: activeManifest.signature_info?.time,
    hasIngredients: Boolean(
      activeManifest.ingredients && activeManifest.ingredients.length > 0,
    ),
    ingredientCount: activeManifest.ingredients?.length || 0,
  };

  // Determine validation status
  if (manifestStore.validation_status && manifestStore.validation_status.length > 0) {
    const hasErrors = manifestStore.validation_status.some((status) =>
      status.code?.toLowerCase().includes("error"),
    );
    const hasWarnings = manifestStore.validation_status.some((status) =>
      status.code?.toLowerCase().includes("warning"),
    );

    if (hasErrors) {
      metadata.validationStatus = "error";
    } else if (hasWarnings) {
      metadata.validationStatus = "warning";
    } else {
      metadata.validationStatus = "valid";
    }
  } else {
    metadata.validationStatus = "valid";
  }

  return metadata;
}

/**
 * Check if a file has C2PA data (lightweight check)
 * @param filePath - The file path or URL to check
 * @returns Boolean indicating if C2PA data exists
 */
export async function hasC2PAData(filePath: string): Promise<boolean> {
  const info = await parseC2PAMetadata(filePath);
  return info.hasC2PA;
}
