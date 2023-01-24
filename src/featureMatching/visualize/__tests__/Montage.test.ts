import { ImageColorModel, Image } from '../../../Image';
import { getBriefDescriptors } from '../../descriptors/getBriefDescriptors';
import { FastKeypoint } from '../../keypoints/getFastKeypoints';
import { getOrientedFastKeypoints } from '../../keypoints/getOrientedFastKeypoints';
import { bruteForceOneMatch, Match } from '../../matching/bruteForceMatch';
import { Montage, MontageDispositions } from '../Montage';

const source = testUtils.load('featureMatching/alphabet.jpg');
const grey = source.convertColor(ImageColorModel.GREY);
const sourceKeypoints = getOrientedFastKeypoints(grey);

describe('constructor', () => {
  it(' scale = 3', () => {
    const source = testUtils.load('featureMatching/alphabet.jpg');
    const montage = new Montage(source, source, { scale: 3 });
    expect(montage.height).toBe(3 * source.height);
  });
  it('disposition vertical', () => {
    const source = testUtils.load('featureMatching/alphabet.jpg');
    const montage = new Montage(source, source, {
      disposition: MontageDispositions.VERTICAL,
    });
    expect(montage.image).toMatchImageSnapshot();
  });
});

describe('drawKeypoints', () => {
  it('default options', () => {
    const montage = new Montage(source, source);
    montage.drawKeypoints(sourceKeypoints);

    expect(montage.image).toMatchImageSnapshot();
  });
  it('scale = 2', () => {
    const montage = new Montage(source, source, { scale: 2 });
    montage.drawKeypoints(sourceKeypoints);

    expect(montage.image).toMatchImageSnapshot();
  });
  it('disposition vertical', () => {
    const montage = new Montage(source, source, {
      disposition: MontageDispositions.VERTICAL,
    });
    montage.drawKeypoints(sourceKeypoints, {
      origin: montage.destinationOrigin,
    });

    expect(montage.image).toMatchImageSnapshot();
  });
});

describe('drawMatches', () => {
  it('simple test', () => {
    const image = new Image(100, 50, { colorModel: ImageColorModel.GREY });
    const keypoint: FastKeypoint[] = [
      { origin: { column: 20, row: 10 }, score: 0 },
    ];
    const matches: Match[] = [
      { sourceIndex: 0, destinationIndex: 0, distance: 0 },
    ];

    const montage = new Montage(image, image, {
      disposition: MontageDispositions.VERTICAL,
    });
    montage.drawMatches(matches, keypoint, keypoint);

    expect(montage.image).toMatchImageSnapshot();
  });
  it('scale = 1.5', () => {
    const descriptors = getBriefDescriptors(grey, sourceKeypoints);

    console.log(sourceKeypoints.length, descriptors.length);

    const matches = bruteForceOneMatch(descriptors, descriptors);

    const montage = new Montage(source, source, { scale: 1.5 });
    montage.drawMatches(matches, sourceKeypoints, sourceKeypoints);

    expect(montage.image).toMatchImageSnapshot();
    expect(montage.height).toBe(1.5 * source.height);
  });
  it('disposition vertical', () => {
    const descriptors = getBriefDescriptors(grey, sourceKeypoints);
    const matches = bruteForceOneMatch(descriptors, descriptors);

    const montage = new Montage(source, source, {
      scale: 1.5,
      disposition: MontageDispositions.VERTICAL,
    });
    montage.drawMatches(matches, sourceKeypoints, sourceKeypoints);

    expect(montage.width).toBe(1.5 * source.width);
    expect(montage.image).toMatchImageSnapshot();
  });
});
