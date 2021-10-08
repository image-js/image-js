import { ImageKind } from '../IJS';

interface IKindDefinitions {
  [key: string]: {
    channels: number;
    alpha: boolean;
  };
}

export const kindDefinitions: IKindDefinitions = {
  [ImageKind.GREY]: {
    channels: 1,
    alpha: false,
  },
  [ImageKind.GREYA]: {
    channels: 2,
    alpha: true,
  },
  [ImageKind.RGB]: {
    channels: 3,
    alpha: false,
  },
  [ImageKind.RGBA]: {
    channels: 4,
    alpha: true,
  },
};
