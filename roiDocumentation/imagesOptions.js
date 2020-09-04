import { colors } from './colors';

const imagesOptions = {
  roi: {
    image: `
        000000000
        000020000
        000212000
        002111200
        000211200
        000022000
        000002000
        000000000
    `,
    title: 'Region of interest',
    textLines: [
      'Surface: 16',
      'External: 10',
      {
        value: 'eqpc: 4.51',
        style: {
          fill: colors[2],
        },
      },
      {
        value: 'ped: 3.18',
        style: {
          fill: colors[3],
        },
      },
    ],
    leftTextMargin: 20,
    circles: [
      {
        value: 3.18,
        style: {
          stroke: colors[2],
        },
      },
      {
        value: 4.51,
        style: {
          stroke: colors[3],
        },
      },
    ],
  },
  mbr: {
    image: `
        000000000
        000010000
        000111000
        001111100
        000111100
        000011000
        000001000
        000000000
      `,
    title: 'Minimum bonding rectangle',
    textLines: [
      'Width: 5.66',
      'Height: 4.24',
      'Surface: 24',
      'Perimeter: 19.80',
    ],
    polygon: [
      [8.5, 4.5],
      [4.5, 0.5],
      [1.5, 3.5],
      [5.5, 7.5],
    ],
    leftTextMargin: 20,
  },
  hull: {
    image: `
        00000
        01110
        01100
        01000
        00000
    `,
    title: 'Convex hull',
    textLines: ['Surface: 7', 'Perimeter: 10.82'],
    polygon: [
      [1, 1],
      [1, 4],
      [2, 4],
      [4, 2],
      [4, 1],
    ],
  },
  feret: {
    image: `
        00000
        01110
        01100
        01000
        00000
    `,
    title: 'Feret diameters',
    textLines: [
      { value: 'min: 2.82', style: { fill: colors[2] } },
      { value: 'max: 4.24', style: { fill: colors[3] } },
      'aspectRatio: 0.6667',
    ],
    lines: [
      {
        value: [
          [1, 1],
          [3, 3],
        ],
        style: { stroke: colors[2] },
      },
      {
        value: [
          [1, 4],
          [4, 1],
        ],
        style: { stroke: colors[3] },
      },
    ],
  },
  perimeter: {
    image: `
        000000000
        000110000
        000111000
        001111100
        000111100
        000011100
        000001100
        000000000
      `,
    title: 'Internal perimeter',
    textLines: ['Perimeter: 16.14'],
    polygon: [
      [4, 1],
      [3, 2],
      [3, 3],
      [2.2, 3.5],
      [3, 4],
      [4, 5],
      [6, 7],
      [7, 6],
      [7, 4],
    ],
    leftTextMargin: 20,
  },
  perimeter2: {
    image: `
        000000000
        000110000
        000111000
        001111100
        000111100
        000011100
        000001100
        000000000
      `,
    title: 'External perimeter',
    polygon: [
      [3, 1],
      [2, 3],
      [2, 4],
      [5, 7],
      [7, 7],
      [7, 3],
      [5, 1],
    ],
  },
  concave: {
    image: `
        000000000
        001111100
        001110000
        001111100
        000011100
        000001100
        000111000
        000000000
    `,
    title: 'External perimeter concave',
    polygon: [
      [2, 1],
      [2, 4],
      [4, 5],
      [5, 5.5],
      [3, 6],
      [3, 7],
      [6, 7],
      [7, 6],
      [7, 3],
      [5, 2.5],
      [7, 2],
      [7, 1],
    ],
  },
  concave2: {
    image: `
        000000000
        001111100
        001110000
        001110100
        000011100
        000001100
        000111000
        000000000
    `,
    title: 'External perimeter concave',
    polygon: [
      [2, 1],
      [2, 4],
      [4, 5],
      [5, 5.5],
      [3, 6],
      [3, 7],
      [6, 7],
      [7, 6],
      [7, 3],
      [6, 3],
      [5.5, 4],
      [5, 3],
      [7, 2],
      [7, 1],
    ],
  },
  square: {
    image: `
        0000000000000
        0111111111110
        0111111111110
        0111111111110
        0111111111110
        0111111111110
        0111111111110
        0111111111110
        0111111111110
        0111111111110
        0111111111110
        0111111111110
        0000000000000
    `,
    title: 'Square',
  },
  circle: {
    image: `
      0000011100000
      0001111111000
      0111111111110
      0111111111110
      0111111111110
      1111111111111
      1111111111111
      1111111111111
      0111111111110
      0111111111110
      0111111111110
      0001111111000
      0000011100000
    `,
    title: 'Circle',
  },
};

function getPixels(string) {
  return string
    .split(/\r?\n/)
    .map((string) => string.trim())
    .filter((value) => value)
    .map((string) => string.split('').map((string) => parseInt(string)));
}

export function getImagesOptions() {
  for (let key in imagesOptions) {
    const options = imagesOptions[key];
    options.textLines = options.textLines || [];
    options.lines = options.lines || [];
    options.polygon = options.polygon || [];
    options.circles = options.circles || [];
    options.leftTextMargin = options.leftTextMargin || 100;
    options.pixels = getPixels(options.image);
  }
  return imagesOptions;
}
