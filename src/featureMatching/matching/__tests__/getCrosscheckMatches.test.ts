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
      { distance: 30, sourceIndex: 15, destinationIndex: 24 },
      { distance: 30, sourceIndex: 24, destinationIndex: 15 },
      { distance: 31, sourceIndex: 57, destinationIndex: 47 },
      { distance: 24, sourceIndex: 106, destinationIndex: 106 },
    ]);
  });
  it.each([
    {
      message: 'scalene triangle',
      source: 'scaleneTriangle',
      destination: 'scaleneTriangle2',
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
      expected: 1,
    },
    {
      message: 'polygon rotated 10°',
      source: 'polygon',
      destination: 'polygonRotated10degrees',
      expected: 3,
    },
  ])('various polygons ($message)', (data) => {
    const source = testUtils
      .load(`featureMatching/polygons/${data.source}.png` as TestImagePath)
      .convertColor(ImageColorModel.GREY);
    const sourceKeypoints = getOrientedFastKeypoints(source);
    const sourceDescriptors = getBriefDescriptors(
      source,
      sourceKeypoints,
    ).descriptors;
    const destination = testUtils
      .load(`featureMatching/polygons/${data.destination}.png` as TestImagePath)
      .convertColor(ImageColorModel.GREY);
    const destinationKeypoints = getOrientedFastKeypoints(destination);
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

test.each([
  {
    message: 'scalene triangle',
    source: 'scaleneTriangle',
    destination: 'scaleneTriangle2',
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
    expected: 3,
  },
  {
    message: 'polygon rotated 10°',
    source: 'polygon',
    destination: 'polygonRotated10degrees',
    expected: 3,
  },
])('various polygons, change kpt window size ($message)', (data) => {
  const kptWindowSize = 15;
  const bestKptRadius = 10;

  const source = testUtils
    .load(`featureMatching/polygons/${data.source}.png` as TestImagePath)
    .convertColor(ImageColorModel.GREY);
  const allSourceKeypoints = getOrientedFastKeypoints(source, {
    centroidPatchDiameter: kptWindowSize,
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
    centroidPatchDiameter: kptWindowSize,
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
