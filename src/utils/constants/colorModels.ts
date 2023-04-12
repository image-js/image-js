export const ImageColorModel = {
  GREY: 'GREY',
  GREYA: 'GREYA',
  RGB: 'RGB',
  RGBA: 'RGBA',
  BINARY: 'BINARY',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ImageColorModel =
  (typeof ImageColorModel)[keyof typeof ImageColorModel];

export const colorModels: Record<
  ImageColorModel,
  {
    components: number;
    alpha: boolean;
    channels: number;
  }
> = {
  GREY: {
    components: 1,
    alpha: false,
    channels: 1,
  },
  GREYA: {
    components: 1,
    alpha: true,
    channels: 2,
  },
  RGB: {
    components: 3,
    alpha: false,
    channels: 3,
  },
  RGBA: {
    components: 3,
    alpha: true,
    channels: 4,
  },
  BINARY: {
    components: 1,
    alpha: false,
    channels: 1,
  },
};
