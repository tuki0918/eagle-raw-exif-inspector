export const EXIF_ANNOTATION_START_MARKER = "[EXIF METADATA]";

export const EXIF_ANNOTATION_END_MARKER = "[EXIF METADATA END]";

export type MergeExifAnnotationStatus = "updated" | "unchanged" | "invalid";

export interface MergeExifAnnotationResult {
  status: MergeExifAnnotationStatus;
  annotation: string;
}

type LineEnding = "\n" | "\r\n";

interface AnnotationLine {
  start: number;
  contentEnd: number;
  content: string;
  lineEnding: "" | LineEnding;
}

interface MarkerLine {
  kind: "start" | "end";
  line: AnnotationLine;
}

const stringifyMetadata = (metadata: Record<string, unknown>): string => {
  const json = JSON.stringify(metadata, null, 2);

  if (json === undefined) {
    throw new TypeError("EXIF metadata could not be serialized as JSON");
  }

  return json;
};

const createBlock = (
  metadata: Record<string, unknown>,
  lineEnding: LineEnding,
): string => {
  const json = stringifyMetadata(metadata).replace(/\n/g, lineEnding);

  return [EXIF_ANNOTATION_START_MARKER, json, EXIF_ANNOTATION_END_MARKER].join(
    lineEnding,
  );
};

/** Creates the complete annotation block using LF line endings. */
export const createExifAnnotationBlock = (
  metadata: Record<string, unknown>,
): string => createBlock(metadata, "\n");

const readLines = (annotation: string): AnnotationLine[] => {
  const lines: AnnotationLine[] = [];
  let lineStart = 0;

  for (let index = 0; index < annotation.length; index += 1) {
    if (annotation[index] !== "\n") {
      continue;
    }

    const hasCarriageReturn =
      index > lineStart && annotation[index - 1] === "\r";
    const contentEnd = hasCarriageReturn ? index - 1 : index;

    lines.push({
      start: lineStart,
      contentEnd,
      content: annotation.slice(lineStart, contentEnd),
      lineEnding: hasCarriageReturn ? "\r\n" : "\n",
    });
    lineStart = index + 1;
  }

  lines.push({
    start: lineStart,
    contentEnd: annotation.length,
    content: annotation.slice(lineStart),
    lineEnding: "",
  });

  return lines;
};

const findMarkerLines = (annotation: string): MarkerLine[] => {
  const markers: MarkerLine[] = [];

  for (const line of readLines(annotation)) {
    if (line.content === EXIF_ANNOTATION_START_MARKER) {
      markers.push({ kind: "start", line });
    } else if (line.content === EXIF_ANNOTATION_END_MARKER) {
      markers.push({ kind: "end", line });
    }
  }

  return markers;
};

const inferLineEnding = (annotation: string): LineEnding => {
  const firstLineFeed = annotation.indexOf("\n");

  return firstLineFeed > 0 && annotation[firstLineFeed - 1] === "\r"
    ? "\r\n"
    : "\n";
};

const normalizeLineEndings = (value: string): string =>
  value.replace(/\r\n/g, "\n");

/**
 * Appends or replaces the plugin-owned EXIF block without altering surrounding
 * annotation text. Ambiguous marker layouts are rejected to protect user data.
 */
export const mergeExifAnnotation = (
  annotation: string,
  metadata: Record<string, unknown>,
): MergeExifAnnotationResult => {
  const markers = findMarkerLines(annotation);

  if (markers.length === 0) {
    const lineEnding = inferLineEnding(annotation);
    const separator =
      annotation.length > 0 && !annotation.endsWith("\n") ? lineEnding : "";

    return {
      status: "updated",
      annotation: `${annotation}${separator}${createBlock(metadata, lineEnding)}`,
    };
  }

  if (
    markers.length !== 2 ||
    markers[0].kind !== "start" ||
    markers[1].kind !== "end"
  ) {
    return { status: "invalid", annotation };
  }

  const startMarker = markers[0].line;
  const endMarker = markers[1].line;
  const existingBlock = annotation.slice(
    startMarker.start,
    endMarker.contentEnd,
  );
  const lineEnding =
    startMarker.lineEnding === ""
      ? inferLineEnding(existingBlock)
      : startMarker.lineEnding;
  const replacementBlock = createBlock(metadata, lineEnding);

  if (
    normalizeLineEndings(existingBlock) ===
    normalizeLineEndings(replacementBlock)
  ) {
    return { status: "unchanged", annotation };
  }

  return {
    status: "updated",
    annotation: `${annotation.slice(0, startMarker.start)}${replacementBlock}${annotation.slice(endMarker.contentEnd)}`,
  };
};
