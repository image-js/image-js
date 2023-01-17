import { ImageColorModel } from '../../../Image';
import { getBriefDescriptors } from '../../descriptors/getBriefDescriptors';
import { drawMatches } from '../../draw/drawMatches';
import { getOrientedFastKeypoints } from '../../keypoints/getOrientedFastKeypoints';
import { Match } from '../bruteForceMatch';
import { crosscheck, getCrosscheckMatches } from '../getCrosscheckMatches';

describe('crosscheck', () => {
  it('all matches are common', () => {
    const matches1: Match[] = [
      { sourceIndex: 0, destinationIndex: 0, distance: 1 },
      { sourceIndex: 0, destinationIndex: 2, distance: 3 },
      { sourceIndex: 3, destinationIndex: 5, distance: 5 },
    ];
    const matches2: Match[] = [
      { sourceIndex: 0, destinationIndex: 0, distance: 1 },
      { sourceIndex: 0, destinationIndex: 2, distance: 3 },
      { sourceIndex: 3, destinationIndex: 5, distance: 5 },
    ];

    expect(crosscheck(matches1, matches2)).toStrictEqual(matches1);
  });

  it('all matches are common', () => {
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
      { sourceIndex: 9, destinationIndex: 3, distance: 1 },
    ]);
  });
});

describe('getCrosscheckMatches', () => {
  it('alphabet image', () => {
    const source = testUtils.load('featureMatching/alphabet.jpg');
    const grey = source.convertColor(ImageColorModel.GREY);
    const sourceKeypoints = getOrientedFastKeypoints(grey);
    const sourceDescriptors = getBriefDescriptors(grey, sourceKeypoints);

    const destination = testUtils.load('featureMatching/alphabetRotated-2.jpg');
    const grey2 = destination.convertColor(ImageColorModel.GREY);
    const destinationKeypoints = getOrientedFastKeypoints(grey2);
    const destinationDescriptors = getBriefDescriptors(
      grey2,
      destinationKeypoints,
    );

    const result = getCrosscheckMatches(
      sourceDescriptors,
      destinationDescriptors,
    );

    console.log(result.length);

    expect(result).toStrictEqual([
      { sourceIndex: 9, destinationIndex: 3, distance: 1 },
    ]);

    expect(
      drawMatches(
        source,
        destination,
        sourceKeypoints,
        destinationKeypoints,
        result,
        { showKeypoints: true, showScore: true },
      ),
    ).toMatchImageSnapshot();
  });
});
