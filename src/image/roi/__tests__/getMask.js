import { Image } from 'test/common';
import 'should';

describe('Roi#getMask', function () {
    it('should yield the right mask', function () {
        let image = new Image(5, 5, { kind: 'GREY' });

        let points = [[1, 1], [3, 2], [4, 4], [5, 0]];

        let roiManager = image.getRoiManager();
        roiManager.fromPoints(points, { kind: 'smallCross' });

        Array.from(roiManager.getData()).should.eql([
            0, 1, 0, 0, 4,
            1, 1, 1, 2, 0,
            0, 1, 2, 2, 2,
            0, 0, 0, 2, 3,
            0, 0, 0, 3, 3
        ]);

        let mask = roiManager.getMask({ minSurface: 5, maxSurface: 5 });

        // only 2 Roi will be selected !

        // should be
        // 01000
        // 11110
        // 01111
        // 00010
        // 00000

        Array.from(mask.data).should.eql([0b01000111, 0b10011110, 0b00100000, 0]);
    });

    it('should yield the right mask, position and resize', function () {
        const data = [
            0, 0, 0, 0, 0,
            0, 1, 1, 1, 0,
            0, 1, 1, 1, 0,
            0, 1, 1, 1, 0,
            0, 0, 0, 0, 0
        ];
        let image = new Image(5, 5, data, { kind: 'GREY' });

        let mask = image.mask({ threshold: 1, algorithm: 'threshold' });

        Array.from(mask.data).should.eql([3, 156, 224, 0]);


        let roiManager = image.getRoiManager();
        roiManager.fromMask(mask, { positive: true, negative: false });

        let rois = roiManager.getRois().sort((a, b) => a.surface - b.surface);
        rois[0].surface.should.equal(9);
        rois[1].surface.should.equal(16);
        rois[0].getMask().position.should.eql([1, 1]);
        rois[1].getMask().position.should.eql([0, 0]);

        rois[0].getMask().parent.size.should.equal(25); // the mask image
        rois[0].getMask().parent.parent.size.should.equal(25); // the grey image
        (rois[0].getMask().parent.parent.parent === null).should.be.true();  // no parent to grey image


        let roi0Mask = rois[0].getMask({ scale: 0.34 });
        roi0Mask.position.should.eql([2, 2]);
        roi0Mask.parent.size.should.equal(25); // the mask image
        roi0Mask.parent.parent.size.should.equal(25); // the grey image
        (roi0Mask.parent.parent.parent === null).should.be.true();  // no parent to grey image

        let roi1Mask = rois[1].getMask({ scale: 0.2 });
        roi1Mask.position.should.eql([2, 2]);

        let painted = roiManager.paint({ color: 'red', scale: 0.34, positive: true, negative: false });
        Array.from(painted.getChannel(0).data).should.eql(
            [
                0, 0, 0, 0, 0,
                0, 1, 1, 1, 0,
                0, 1, 255, 1, 0,
                0, 1, 1, 1, 0,
                0, 0, 0, 0, 0
            ]
        );
    });

    it('should work with convex hull', () => {
        const data = [
            0, 0, 0, 0, 0, 0,
            0, 1, 1, 1, 0, 0,
            0, 1, 0, 0, 0, 0,
            0, 1, 0, 0, 0, 0,
            0, 1, 1, 1, 1, 1,
            0, 0, 0, 0, 0, 0
        ];
        let image = new Image(6, 6, data, { kind: 'GREY' });

        let mask = image.mask({ threshold: 1, algorithm: 'threshold' });
        let roiManager = image.getRoiManager();
        roiManager.fromMask(mask, { positive: true, negative: false });
        const rois = roiManager.getRois();
        rois.length.should.equal(2);

        const roi = rois[0];
        const hullMask = roi.hullMask;
        Array.from(hullMask.data).should.eql([0b11100111, 0b00111101, 0b11110000]);
    });
});

