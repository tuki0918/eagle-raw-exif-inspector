import { extractNovelAIMetadata } from "@/lib/novelai";
import type { C2PAInfo } from "@/types/c2pa.d.ts";
import { parseC2PAMetadata } from "@/utils/c2pa";
import ExifReader from "exifreader";

type ImageMetadata = Record<string, unknown>;

export interface ParsedMetadata {
  metadata: ImageMetadata | null;
  c2paInfo: C2PAInfo | null;
}

async function parseNovelAIMetadata(
  filePath: string,
): Promise<ImageMetadata | null> {
  try {
    const metadata = await extractNovelAIMetadata(filePath);
    const isNovelAI = metadata && metadata.Software === "NovelAI";
    return isNovelAI ? metadata : null;
  } catch {
    return null;
  }
}

async function parseExifMetadata(
  filePath: string,
): Promise<ImageMetadata | null> {
  try {
    const tags = await ExifReader.load(filePath);
    const metadata: ImageMetadata = {};

    for (const [k, v] of Object.entries(tags)) {
      if (v && typeof v === "object" && ("description" in v || "value" in v)) {
        metadata[k] = v.description || v.value;
      } else {
        metadata[k] = v;
      }
    }

    return Object.keys(metadata).length > 0 ? metadata : null;
  } catch (error) {
    console.error("Failed to parse metadata:", error);
    return null;
  }
}

export async function parseMetadata(
  filePath: string,
): Promise<ImageMetadata | null> {
  // Try NovelAI metadata first
  const data = await parseNovelAIMetadata(filePath);
  if (data) {
    return data;
  }

  // If NovelAI metadata is not found, parse EXIF data
  return await parseExifMetadata(filePath);
}

/**
 * Parse both metadata and C2PA information from a file
 * @param filePath - The file path to parse
 * @returns Object containing both metadata and C2PA info
 */
export async function parseMetadataWithC2PA(
  filePath: string,
): Promise<ParsedMetadata> {
  // Parse regular metadata
  const metadata = await parseMetadata(filePath);

  // Parse C2PA information in parallel
  let c2paInfo: C2PAInfo | null = null;
  try {
    c2paInfo = await parseC2PAMetadata(filePath);
  } catch (error) {
    console.error("Failed to parse C2PA metadata:", error);
    c2paInfo = { hasC2PA: false };
  }

  return {
    metadata,
    c2paInfo,
  };
}
