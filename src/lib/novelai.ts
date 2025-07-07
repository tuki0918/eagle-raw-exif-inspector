import { ungzip } from "pako";

const STEALTH_PNG_MAGIC = "stealth_pngcomp";
const RGBA_CHANNELS = 4;

function safeParseJson(jsonString: string): unknown {
  try {
    return JSON.parse(jsonString);
  } catch {
    return jsonString;
  }
}

function processCommentField<T extends Record<string, unknown>>(
  metadata: T,
): T {
  if (metadata.Comment && typeof metadata.Comment === "string") {
    return {
      ...metadata,
      Comment: safeParseJson(metadata.Comment),
    };
  }
  return metadata;
}

class LSBExtractor {
  private imageData: Uint8ClampedArray;
  private width: number;
  private height: number;
  private currentRow = 0;
  private currentCol = 0;
  private bitCount = 0;
  private bitBuffer = 0;

  constructor(imageData: Uint8ClampedArray, width: number, height: number) {
    this.imageData = imageData;
    this.width = width;
    this.height = height;
  }

  private extractNextBit(): boolean {
    if (this.currentRow >= this.height || this.currentCol >= this.width) {
      return false;
    }

    const pixelIndex = (this.currentRow * this.width + this.currentCol) * 4;
    const alphaByte = this.imageData[pixelIndex + 3];
    const bit = alphaByte & 1;

    this.bitCount++;
    this.bitBuffer <<= 1;
    this.bitBuffer |= bit;

    this.currentRow++;
    if (this.currentRow === this.height) {
      this.currentRow = 0;
      this.currentCol++;
    }

    return true;
  }

  private readByte(): number | null {
    while (this.bitCount < 8) {
      if (!this.extractNextBit()) {
        return null;
      }
    }

    const byte = this.bitBuffer & 0xff;
    this.bitCount = 0;
    this.bitBuffer = 0;
    return byte;
  }

  readBytes(byteCount: number): Uint8Array {
    const result = new Uint8Array(byteCount);
    for (let i = 0; i < byteCount; i++) {
      const byte = this.readByte();
      if (byte === null) {
        throw new Error("Unexpected end of data");
      }
      result[i] = byte;
    }
    return result;
  }

  read32BitInteger(): number {
    const bytes = this.readBytes(4);
    return (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
  }
}

async function loadImageData(
  filePath: string,
): Promise<{ data: Uint8ClampedArray; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      resolve({
        data: imageData.data,
        width: img.width,
        height: img.height,
      });
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = filePath;
  });
}

export async function extractNovelAIMetadata(
  filePath: string,
): Promise<{ [key: string]: unknown } | null> {
  try {
    const { data, width, height } = await loadImageData(filePath);

    // Check if image has alpha channel (RGBA)
    if (data.length !== width * height * RGBA_CHANNELS) {
      return null;
    }

    const reader = new LSBExtractor(data, width, height);

    // Read magic number
    const magicBytes = reader.readBytes(STEALTH_PNG_MAGIC.length);
    const actualMagic = new TextDecoder().decode(magicBytes);

    if (STEALTH_PNG_MAGIC !== actualMagic) {
      return null;
    }

    // Read data length
    const compressedDataLength = reader.read32BitInteger() / 8;

    // Read compressed JSON data
    const compressedData = reader.readBytes(compressedDataLength);

    // Decompress using gzip
    const decompressedData = ungzip(compressedData);
    const decompressedText = new TextDecoder().decode(decompressedData);

    // Parse JSON
    const parsedMetadata = JSON.parse(decompressedText);

    return processCommentField(parsedMetadata);
  } catch {
    return null;
  }
}
