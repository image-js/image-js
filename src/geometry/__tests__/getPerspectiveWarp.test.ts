import { describe, expect, it } from 'vitest';

import { Image } from '../../Image.js';
import { getPerspectiveWarp, order4Points } from '../getPerspectiveWarp.js';

describe('4 points sorting', () => {
  it('basic sorting test', () => {
    const points = [
      { column: 0, row: 100 },
      { column: 0, row: 0 },
      { column: 100, row: 1 },
      { column: 100, row: 100 },
    ];

    const result = order4Points(points);

    expect(result).toStrictEqual([
      { column: 0, row: 0 },
      { column: 100, row: 1 },
      { column: 100, row: 100 },
      { column: 0, row: 100 },
    ]);
  });

  it('inclined square', () => {
    const points = [
      { column: 45, row: 0 },
      { column: 0, row: 45 },
      { column: 45, row: 90 },
      { column: 90, row: 45 },
    ];

    const result = order4Points(points);

    expect(result).toStrictEqual([
      { column: 0, row: 45 },
      { column: 90, row: 45 },
      { column: 45, row: 0 },
      { column: 45, row: 90 },
    ]);
  });

  it('basic sorting test 2', () => {
    const points = [
      { column: 155, row: 195 },
      { column: 154, row: 611 },
      { column: 858.5, row: 700 },
      { column: 911.5, row: 786 },
    ];

    const result = order4Points(points);

    expect(result).toStrictEqual([
      { column: 155, row: 195 },

      { column: 858.5, row: 700 },
      { column: 911.5, row: 786 },
      { column: 154, row: 611 },
    ]);
  });
});

describe('warping tests', () => {
  it('resize without rotation', () => {
    const image = new Image(3, 3, {
      data: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]),
      colorModel: 'GREY',
    });
    const points = [
      { column: 0, row: 0 },
      { column: 2, row: 0 },
      { column: 1, row: 2 },
      { column: 0, row: 2 },
    ];
    const matrix = getPerspectiveWarp(points);
    const result = image.transform(matrix.matrix, { inverse: true });

    expect(result.width).not.toBeLessThan(2);
    expect(result.height).not.toBeLessThan(2);
    expect(result.width).not.toBeGreaterThan(3);
    expect(result.height).not.toBeGreaterThan(3);
  });

  it('resize without rotation 2', () => {
    const image = new Image(4, 4, {
      data: new Uint8Array([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      ]),
      colorModel: 'GREY',
    });

    const points = [
      { column: 0, row: 0 },
      { column: 3, row: 0 },
      { column: 2, row: 1 },
      { column: 0, row: 1 },
    ];
    const matrix = getPerspectiveWarp(points);
    const result = image.transform(matrix.matrix, { inverse: true });

    expect(result.width).not.toBeLessThan(3);
    expect(result.height).not.toBeLessThan(1);
    expect(result.width).not.toBeGreaterThan(4);
    expect(result.height).not.toBeGreaterThan(4);
  });
});

describe('openCV comparison', () => {
  it('nearest interpolation plants', () => {
    const image = testUtils.load('opencv/plants.png');
    const openCvResult = testUtils.load(
      'opencv/test_perspective_warp_plants_nearest.png',
    );

    const points = [
      { column: 858.5, row: 9 },
      { column: 911.5, row: 786 },
      { column: 154.5, row: 611 },
      { column: 166.5, row: 195 },
    ];
    const matrix = getPerspectiveWarp(points, {
      width: 1080,
      height: 810,
    });
    const result = image.transform(matrix.matrix, {
      inverse: true,
      interpolationType: 'nearest',
    });
    const croppedPieceOpenCv = openCvResult.crop({
      origin: { column: 45, row: 0 },
      width: 100,
      height: 100,
    });

    const croppedPiece = result.crop({
      origin: { column: 45, row: 0 },
      width: 100,
      height: 100,
    });

    expect(result.width).toStrictEqual(openCvResult.width);
    expect(result.height).toStrictEqual(openCvResult.height);
    expect(croppedPiece).toStrictEqual(croppedPieceOpenCv);
  });

  it('nearest interpolation card', () => {
    const image = testUtils.load('opencv/card.png');
    const openCvResult = testUtils.load(
      'opencv/test_perspective_warp_card_nearest.png',
    );
    const points = [
      { column: 55, row: 140 },
      { column: 680, row: 38 },
      { column: 840, row: 340 },
      { column: 145, row: 460 },
    ];
    const matrix = getPerspectiveWarp(points, {
      width: 700,
      height: 400,
    });
    const result = image.transform(matrix.matrix, {
      inverse: true,
      interpolationType: 'nearest',
      width: 700,
      height: 400,
    });
    const croppedPieceOpenCv = openCvResult.crop({
      origin: { column: 45, row: 0 },
      width: 5,
      height: 5,
    });

    const croppedPiece = result.crop({
      origin: { column: 45, row: 0 },
      width: 5,
      height: 5,
    });

    expect(result.width).toStrictEqual(openCvResult.width);
    expect(result.height).toStrictEqual(openCvResult.height);
    expect(croppedPiece).toStrictEqual(croppedPieceOpenCv);
  });

  it('nearest interpolation poker card', () => {
    const image = testUtils.load('opencv/poker_cards.png');
    const openCvResult = testUtils.load(
      'opencv/test_perspective_warp_poker_cards_nearest.png',
    );

    const points = [
      { column: 1100, row: 660 },
      { column: 680, row: 660 },
      { column: 660, row: 290 },
      { column: 970, row: 290 },
    ];
    const matrix = getPerspectiveWarp(points);
    const result = image.transform(matrix.matrix, {
      inverse: true,
      interpolationType: 'nearest',
      height: matrix.height,
      width: matrix.width,
    });

    const cropped = result.crop({
      origin: { column: 10, row: 10 },
      width: 100,
      height: 100,
    });
    const croppedCV = openCvResult.crop({
      origin: { column: 10, row: 10 },
      width: 100,
      height: 100,
    });

    expect(result.width).toStrictEqual(openCvResult.width);
    expect(result.height).toStrictEqual(openCvResult.height);
    expect(cropped).toStrictEqual(croppedCV);
  });
});

describe('error testing', () => {
  it("should throw if there aren't 4 points", () => {
    expect(() => {
      getPerspectiveWarp([{ column: 1, row: 1 }]);
    }).toThrow(
      'The array pts must have four elements, which are the four corners. Currently, pts have 1 elements',
    );
  });

  it('should throw if either only width or only height are defined', () => {
    expect(() => {
      getPerspectiveWarp(
        [
          { column: 1, row: 1 },
          { column: 2, row: 1 },
          { column: 2, row: 2 },
          { column: 1, row: 2 },
        ],
        { width: 10 },
      );
    }).toThrow(
      'Invalid dimensions: `height` is missing. Either provide both width and height, or omit both to auto-calculate dimensions.',
    );
  });
});
