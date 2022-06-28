export enum ImageColorModel {
  GREY = 'GREY',
  GREYA = 'GREYA',
  RGB = 'RGB',
  RGBA = 'RGBA',
  BINARY = 'BINARY',
}

export const colorModels: {
  [key in ImageColorModel]: {
    components: number;
    alpha: boolean;
    channels: number;
  };
} = {
  [ImageColorModel.GREY]: {
    components: 1,
    alpha: false,
    channels: 1,
  },
  [ImageColorModel.GREYA]: {
    components: 1,
    alpha: true,
    channels: 2,
  },
  [ImageColorModel.RGB]: {
    components: 3,
    alpha: false,
    channels: 3,
  },
  [ImageColorModel.RGBA]: {
    components: 3,
    alpha: true,
    channels: 4,
  },
  [ImageColorModel.BINARY]: {
    components: 1,
    alpha: false,
    channels: 1,
  },
};
