export interface ImageMetadata {
  tiff: {
    fields: Map<number, unknown>;
    tags: Record<string, unknown>;
  };
  exif: Record<string, unknown>;
}

export interface Resolution {
  xValue: number;
  yValue: number;
  unit: Unit;
}

export type Unit = 'inch' | 'centimeter' | 'meter' | 'unknown';
