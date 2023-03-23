import { TestImagePath } from '../../../../test/TestImagePath';
import { ImageColorModel } from '../../../Image';
import { getBriefDescriptors } from '../../descriptors/getBriefDescriptors';
import { getBestKeypointsInRadius } from '../../keypoints/getBestKeypointsInRadius';
import { getOrientedFastKeypoints } from '../../keypoints/getOrientedFastKeypoints';
import { Montage } from '../../visualize/Montage';
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
      { destinationIndex: 0, sourceIndex: 0, distance: 1 },
      { destinationIndex: 0, sourceIndex: 2, distance: 3 },
      { destinationIndex: 3, sourceIndex: 5, distance: 5 },
    ];

    expect(crosscheck(matches1, matches2)).toStrictEqual(matches1);
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
      { sourceIndex: 3, destinationIndex: 9, distance: 5 },
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
      { sourceIndex: 14, destinationIndex: 10, distance: 1 },
      { sourceIndex: 1, destinationIndex: 2, distance: 3 },
      { sourceIndex: 9, destinationIndex: 3, distance: 5 },
      { sourceIndex: 5, destinationIndex: 4, distance: 1 },
      { sourceIndex: 1, destinationIndex: 14, distance: 3 },
      { sourceIndex: 10, destinationIndex: 30, distance: 1 },
      { sourceIndex: 3, destinationIndex: 9, distance: 3 },
    ];

    expect(crosscheck(matches1, matches2)).toStrictEqual([
      { sourceIndex: 9, destinationIndex: 3, distance: 3 },
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
      { sourceIndex: 3, destinationIndex: 9, distance: 5 },
      { sourceIndex: 5, destinationIndex: 4, distance: 1 },
      { sourceIndex: 1, destinationIndex: 14, distance: 3 },
      { sourceIndex: 10, destinationIndex: 30, distance: 1 },
      { sourceIndex: 10, destinationIndex: 14, distance: 3 },
    ];

    expect(crosscheck(matches1, matches2)).toStrictEqual([
      { sourceIndex: 9, destinationIndex: 3, distance: 5 },
    ]);
    expect(crosscheck(matches2, matches1)).toStrictEqual([
      { sourceIndex: 3, destinationIndex: 9, distance: 5 },
    ]);
  });
});

describe('getCrosscheckMatches', () => {
  test.each([
    {
      message: 'scalene triangle',
      source: 'scaleneTriangle',
      destination: 'scaleneTriangle2',
      expected: 2,
    },
    {
      message: 'scalene triangle 90',
      source: 'scaleneTriangle',
      destination: 'scaleneTriangle90',
      expected: 2,
    },
    {
      message: 'polygon',
      source: 'polygon',
      destination: 'polygon2',
      expected: 7,
    },
    {
      message: 'polygon rotated 180°',
      source: 'polygon',
      destination: 'polygonRotated180degrees',
      expected: 6,
    },
    {
      message: 'polygon rotated 10°',
      source: 'polygon',
      destination: 'polygonRotated10degrees',
      expected: 4,
    },
  ])('various polygons, centroidPatchDiameter = 31 ($message)', (data) => {
    const patchDiameter = 31;

    // remove keypoints too close to one another
    const bestKptRadius = 10;

    const source = testUtils
      .load(`featureMatching/polygons/${data.source}.png` as TestImagePath)
      .convertColor(ImageColorModel.GREY);
    const allSourceKeypoints = getOrientedFastKeypoints(source, {
      centroidPatchDiameter: patchDiameter,
    });
    const sourceKeypoints = getBestKeypointsInRadius(
      allSourceKeypoints,
      bestKptRadius,
    );
    const sourceDescriptors = getBriefDescriptors(
      source,
      sourceKeypoints,
    ).descriptors;
    const destination = testUtils
      .load(`featureMatching/polygons/${data.destination}.png` as TestImagePath)
      .convertColor(ImageColorModel.GREY);
    const allDestinationKeypoints = getOrientedFastKeypoints(destination, {
      centroidPatchDiameter: patchDiameter,
    });
    const destinationKeypoints = getBestKeypointsInRadius(
      allDestinationKeypoints,
      bestKptRadius,
    );
    const destinationDescriptors = getBriefDescriptors(
      destination,
      destinationKeypoints,
    ).descriptors;

    const matches = getCrosscheckMatches(
      sourceDescriptors,
      destinationDescriptors,
    );

    expect(matches.length).toBe(data.expected);

    const montage = new Montage(source, destination);
    montage.drawKeypoints(sourceKeypoints);
    montage.drawKeypoints(destinationKeypoints, {
      origin: montage.destinationOrigin,
    });
    montage.drawMatches(matches, sourceKeypoints, destinationKeypoints);

    expect(montage.image).toMatchImageSnapshot();
  });
});
