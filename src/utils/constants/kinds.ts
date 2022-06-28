import { ImageColorModel } from '../../IJS';

interface ColorModelDefinitions {
  [key: string]: {
    channels: number;
    alpha: boolean;
  };
}

export const colorModelDefinitions: ColorModelDefinitions = {
  [ImageColorModel.GREY]: {
    channels: 1,
    alpha: false,
  },
  [ImageColorModel.GREYA]: {
    channels: 2,
    alpha: true,
  },
  [ImageColorModel.RGB]: {
    channels: 3,
    alpha: false,
  },
  [ImageColorModel.RGBA]: {
    channels: 4,
    alpha: true,
  },
};
