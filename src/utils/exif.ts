import { extractNovelAIMetadata } from "@/lib/novelai";
import ExifReader from "exifreader";

type ImageMetadata = Record<string, unknown>;

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
