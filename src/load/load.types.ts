export interface TiffImageMetadata {
  tiff: {
    fields: Map<number, unknown>;
    tags: Record<string, unknown>;
  };
  exif: Record<string, unknown>;
}

export interface PngImageMetadata {
  resolution: {
    x: number;
    y: number;
    unit: number;
  };
  // Pixels per meter
}
