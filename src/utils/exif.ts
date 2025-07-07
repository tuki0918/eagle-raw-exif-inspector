import { extractNovelAIMetadata } from "@/lib/novelai";
import exifr from "exifr";

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
    const data = await exifr.parse(filePath);
    return data ?? null;
  } catch {
    return null;
  }
}

export async function parseMetadata(
  filePath: string,
): Promise<ImageMetadata | null> {
  // Try NovelAI metadata first
  const novelAIData = await parseNovelAIMetadata(filePath);
  if (novelAIData) {
    return novelAIData;
  }

  // If NovelAI metadata is not found, parse EXIF data
  const exifData = await parseExifMetadata(filePath);
  return exifData ?? null;
}
