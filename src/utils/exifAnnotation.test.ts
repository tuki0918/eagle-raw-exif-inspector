import {
  EXIF_ANNOTATION_END_MARKER,
  EXIF_ANNOTATION_START_MARKER,
  createExifAnnotationBlock,
  mergeExifAnnotation,
} from "@/utils/exifAnnotation";

describe("createExifAnnotationBlock", () => {
  it("uses short human-readable markers", () => {
    expect(EXIF_ANNOTATION_START_MARKER).toBe("[EXIF METADATA]");
    expect(EXIF_ANNOTATION_END_MARKER).toBe("[EXIF METADATA END]");
  });

  it("creates an owned block containing pretty-printed JSON", () => {
    expect(createExifAnnotationBlock({})).toBe(
      `${EXIF_ANNOTATION_START_MARKER}\n{}\n${EXIF_ANNOTATION_END_MARKER}`,
    );

    expect(
      createExifAnnotationBlock({ camera: "Nikon Z8", exposure: 0.005 }),
    ).toBe(
      [
        EXIF_ANNOTATION_START_MARKER,
        "{",
        '  "camera": "Nikon Z8",',
        '  "exposure": 0.005',
        "}",
        EXIF_ANNOTATION_END_MARKER,
      ].join("\n"),
    );
  });

  it("serializes Unicode and nested metadata", () => {
    const metadata = {
      camera: "富士フイルム",
      location: { city: "東京", coordinates: [35.6762, 139.6503] },
      keywords: ["夜景", "🌙"],
    };

    expect(createExifAnnotationBlock(metadata)).toBe(
      `${EXIF_ANNOTATION_START_MARKER}\n${JSON.stringify(metadata, null, 2)}\n${EXIF_ANNOTATION_END_MARKER}`,
    );
  });
});

describe("mergeExifAnnotation", () => {
  it("writes a block into an empty annotation", () => {
    const metadata = { ISO: 400 };

    expect(mergeExifAnnotation("", metadata)).toEqual({
      status: "updated",
      annotation: createExifAnnotationBlock(metadata),
    });
  });

  it("appends without trimming existing manual text", () => {
    const annotation = "  Keep my manual annotation.  ";
    const metadata = { lens: "35mm" };

    expect(mergeExifAnnotation(annotation, metadata)).toEqual({
      status: "updated",
      annotation: `${annotation}\n${createExifAnnotationBlock(metadata)}`,
    });
  });

  it("replaces only the existing owned block", () => {
    const prefix = "Manual header\n\n";
    const suffix = "\n\nManual footer  ";
    const annotation = `${prefix}${createExifAnnotationBlock({ ISO: 100 })}${suffix}`;
    const metadata = { ISO: 800, aperture: 1.8 };

    expect(mergeExifAnnotation(annotation, metadata)).toEqual({
      status: "updated",
      annotation: `${prefix}${createExifAnnotationBlock(metadata)}${suffix}`,
    });
  });

  it("does not update an identical block", () => {
    const metadata = { make: "Canon", model: "R5" };
    const annotation = `Manual\n${createExifAnnotationBlock(metadata)}\nFooter`;

    expect(mergeExifAnnotation(annotation, metadata)).toEqual({
      status: "unchanged",
      annotation,
    });
  });

  it.each([
    ["start marker only", `Manual\n${EXIF_ANNOTATION_START_MARKER}\n{}`],
    ["end marker only", `Manual\n${EXIF_ANNOTATION_END_MARKER}`],
    [
      "reversed markers",
      `${EXIF_ANNOTATION_END_MARKER}\n{}\n${EXIF_ANNOTATION_START_MARKER}`,
    ],
    [
      "nested markers",
      [
        EXIF_ANNOTATION_START_MARKER,
        EXIF_ANNOTATION_START_MARKER,
        "{}",
        EXIF_ANNOTATION_END_MARKER,
        EXIF_ANNOTATION_END_MARKER,
      ].join("\n"),
    ],
    [
      "multiple blocks",
      `${createExifAnnotationBlock({ first: true })}\n${createExifAnnotationBlock({ second: true })}`,
    ],
  ])("returns invalid and preserves annotation for %s", (_name, annotation) => {
    expect(mergeExifAnnotation(annotation, { ISO: 200 })).toEqual({
      status: "invalid",
      annotation,
    });
  });

  it("recognizes CRLF marker lines and preserves CRLF on replacement", () => {
    const oldBlock = createExifAnnotationBlock({ ISO: 100 }).replace(
      /\n/g,
      "\r\n",
    );
    const newBlock = createExifAnnotationBlock({ ISO: 200 }).replace(
      /\n/g,
      "\r\n",
    );
    const annotation = `Before\r\n${oldBlock}\r\nAfter`;

    expect(mergeExifAnnotation(annotation, { ISO: 200 })).toEqual({
      status: "updated",
      annotation: `Before\r\n${newBlock}\r\nAfter`,
    });
  });

  it("treats an identical CRLF block as unchanged", () => {
    const metadata = { ISO: 640 };
    const annotation = createExifAnnotationBlock(metadata).replace(
      /\n/g,
      "\r\n",
    );

    expect(mergeExifAnnotation(annotation, metadata)).toEqual({
      status: "unchanged",
      annotation,
    });
  });

  it("does not mistake marker strings inside JSON payload for marker lines", () => {
    const metadata = {
      startMarker: EXIF_ANNOTATION_START_MARKER,
      multiline: `${EXIF_ANNOTATION_START_MARKER}\n${EXIF_ANNOTATION_END_MARKER}`,
      endMarker: EXIF_ANNOTATION_END_MARKER,
    };
    const annotation = createExifAnnotationBlock(metadata);

    expect(mergeExifAnnotation(annotation, metadata)).toEqual({
      status: "unchanged",
      annotation,
    });
  });

  it("recognizes markers only when they occupy an entire line", () => {
    const annotation = [
      `prefix ${EXIF_ANNOTATION_START_MARKER}`,
      ` ${EXIF_ANNOTATION_END_MARKER}`,
    ].join("\n");
    const metadata = { ISO: 125 };

    expect(mergeExifAnnotation(annotation, metadata)).toEqual({
      status: "updated",
      annotation: `${annotation}\n${createExifAnnotationBlock(metadata)}`,
    });
  });

  it("preserves trailing newlines when appending and does not add one after the block", () => {
    const annotation = "Manual text\n\n";
    const metadata = { ISO: 320 };
    const result = mergeExifAnnotation(annotation, metadata);

    expect(result).toEqual({
      status: "updated",
      annotation: `${annotation}${createExifAnnotationBlock(metadata)}`,
    });
    expect(result.annotation.endsWith("\n")).toBe(false);
  });

  it("preserves a trailing newline after an unchanged block", () => {
    const metadata = { ISO: 500 };
    const annotation = `${createExifAnnotationBlock(metadata)}\n`;

    expect(mergeExifAnnotation(annotation, metadata)).toEqual({
      status: "unchanged",
      annotation,
    });
  });
});
