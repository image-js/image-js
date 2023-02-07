import { ImageColorModel } from '../../../Image';
import { getBriefDescriptors } from '../../descriptors/getBriefDescriptors';
import { getOrientedFastKeypoints } from '../../keypoints/getOrientedFastKeypoints';
import { Match } from '../bruteForceMatch';
import { crosscheck, getCrosscheckMatches } from '../getCrosscheckMatches';

describe('crosscheck', () => {
  it('all matches are common', () => {
    const matches: Match[] = [
      { sourceIndex: 0, destinationIndex: 0, distance: 1 },
      { sourceIndex: 0, destinationIndex: 2, distance: 3 },
      { sourceIndex: 3, destinationIndex: 5, distance: 5 },
    ];

    expect(crosscheck(matches, matches)).toStrictEqual(matches);
  });

  it('no matches in common', () => {
    const matches1: Match[] = [
      { sourceIndex: 0, destinationIndex: 0, distance: 1 },
      { sourceIndex: 0, destinationIndex: 2, distance: 3 },
      { sourceIndex: 3, destinationIndex: 5, distance: 5 },
    ];
    const matches2: Match[] = [
      { sourceIndex: 1, destinationIndex: 0, distance: 1 },
      { sourceIndex: 1, destinationIndex: 2, distance: 3 },
      { sourceIndex: 2, destinationIndex: 5, distance: 5 },
    ];

    expect(crosscheck(matches1, matches2)).toStrictEqual([]);
  });

  it('matches not sorted', () => {
    const matches1: Match[] = [
      { sourceIndex: 9, destinationIndex: 3, distance: 1 },
      { sourceIndex: 0, destinationIndex: 14, distance: 3 },
      { sourceIndex: 7, destinationIndex: 3, distance: 5 },
    ];
    const matches2: Match[] = [
      { sourceIndex: 9, destinationIndex: 4, distance: 1 },
      { sourceIndex: 1, destinationIndex: 2, distance: 3 },
      { sourceIndex: 9, destinationIndex: 3, distance: 5 },
    ];

    expect(crosscheck(matches1, matches2)).toStrictEqual([
      { sourceIndex: 9, destinationIndex: 3, distance: 5 },
    ]);
  });

  it('matches have different lengths', () => {
    const matches1: Match[] = [
      { sourceIndex: 9, destinationIndex: 3, distance: 1 },
      { sourceIndex: 10, destinationIndex: 14, distance: 3 },
      { sourceIndex: 7, destinationIndex: 3, distance: 5 },
    ];
    const matches2: Match[] = [
      { sourceIndex: 9, destinationIndex: 4, distance: 1 },
      { sourceIndex: 1, destinationIndex: 2, distance: 3 },
      { sourceIndex: 9, destinationIndex: 3, distance: 5 },
      { sourceIndex: 5, destinationIndex: 4, distance: 1 },
      { sourceIndex: 1, destinationIndex: 14, distance: 3 },
      { sourceIndex: 10, destinationIndex: 30, distance: 1 },
      { sourceIndex: 10, destinationIndex: 14, distance: 3 },
    ];

    expect(crosscheck(matches1, matches2)).toStrictEqual([
      { sourceIndex: 9, destinationIndex: 3, distance: 5 },
      { sourceIndex: 10, destinationIndex: 14, distance: 3 },
    ]);
  });

  it('should be symmetrical', () => {
    const matches1: Match[] = [
      { sourceIndex: 9, destinationIndex: 3, distance: 1 },
      { sourceIndex: 0, destinationIndex: 14, distance: 3 },
      { sourceIndex: 7, destinationIndex: 3, distance: 5 },
    ];
    const matches2: Match[] = [
      { sourceIndex: 9, destinationIndex: 3, distance: 5 },
      { sourceIndex: 5, destinationIndex: 4, distance: 1 },
      { sourceIndex: 1, destinationIndex: 14, distance: 3 },
      { sourceIndex: 10, destinationIndex: 30, distance: 1 },
      { sourceIndex: 10, destinationIndex: 14, distance: 3 },
    ];

    expect(crosscheck(matches1, matches2)).toStrictEqual(
      crosscheck(matches2, matches1),
    );
  });
});

describe('getCrosscheckMatches', () => {
  it('alphabet image', () => {
    const source = testUtils.load('featureMatching/alphabet.jpg');
    const grey = source.convertColor(ImageColorModel.GREY);
    const sourceKeypoints = getOrientedFastKeypoints(grey);
    const sourceDescriptors = getBriefDescriptors(
      grey,
      sourceKeypoints,
    ).descriptors;

    const destination = testUtils.load('featureMatching/alphabetRotated-2.jpg');
    const grey2 = destination.convertColor(ImageColorModel.GREY);
    const destinationKeypoints = getOrientedFastKeypoints(grey2);
    const destinationDescriptors = getBriefDescriptors(
      grey2,
      destinationKeypoints,
    ).descriptors;

    const crosscheckMatches = getCrosscheckMatches(
      sourceDescriptors,
      destinationDescriptors,
    );

    expect(crosscheckMatches).toStrictEqual([
      { distance: 21, sourceIndex: 15, destinationIndex: 24 },
      { distance: 21, sourceIndex: 24, destinationIndex: 15 },
      { distance: 36, sourceIndex: 39, destinationIndex: 16 },
      { distance: 24, sourceIndex: 65, destinationIndex: 80 },
    ]);
  });
});
