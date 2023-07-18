type ColorModelDefinitions = Record<
  string,
  {
    channels: number;
    alpha: boolean;
  }
>;

export const colorModelDefinitions: ColorModelDefinitions = {
  grey: {
    channels: 1,
    alpha: false,
  },
  greya: {
    channels: 2,
    alpha: true,
  },
  rgb: {
    channels: 3,
    alpha: false,
  },
  rgba: {
    channels: 4,
    alpha: true,
  },
};
