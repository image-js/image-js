import {Image, load} from 'test/common';

describe('we check paint mask', function () {

    let image = new Image(5, 5, {kind: 'GREY'});
    image.data = [
        0, 0, 0, 0, 0,
        0, 1, 1, 1, 0,
        0, 1, 1, 1, 0,
        0, 1, 1, 1, 0,
        0, 0, 0, 0, 0
    ];
    let mask = image.mask({threshold: 1, algorithm:'threshold'});
    let roiManager = image.getROIManager();
    roiManager.fromMask(mask, {positive: true, negative: false});

    it('should yield the right painted images for box', function () {
        roiManager.resetPainted();
        let painted = roiManager.paint({kind: 'box', positive: true, negative: false});
        Array.from(painted.getChannel(0).data).should.eql(
            [
                0, 0, 0, 0, 0,
                0, 255, 255, 255, 0,
                0, 255, 1, 255, 0,
                0, 255, 255, 255, 0,
                0, 0, 0, 0, 0
            ]
        );
    });

    it('should yield the right painted images for filled', function () {
        roiManager.resetPainted();
        let painted = roiManager.paint({kind: 'filled', positive: true, negative: false});
        Array.from(painted.getChannel(0).data).should.eql(
            [
                0, 0, 0, 0, 0,
                0, 255, 255, 255, 0,
                0, 255, 255, 255, 0,
                0, 255, 255, 255, 0,
                0, 0, 0, 0, 0
            ]
        );
    });

    it('should yield the right painted images for contour', function () {
        roiManager.resetPainted();
        let painted = roiManager.paint({kind: 'contour', positive: true, negative: false});
        Array.from(painted.getChannel(0).data).should.eql(
            [
                0, 0, 0, 0, 0,
                0, 255, 255, 255, 0,
                0, 255, 1, 255, 0,
                0, 255, 255, 255, 0,
                0, 0, 0, 0, 0
            ]
        );
    });

    it('should yield the right painted images for center', function () {
        roiManager.resetPainted();
        let painted = roiManager.paint({kind: 'center', positive: true, negative: false});
        Array.from(painted.getChannel(0).data).should.eql(
            [
                0, 0, 0, 0, 0,
                0, 1, 255, 1, 0,
                0, 255, 255, 255, 0,
                0, 1, 255, 1, 0,
                0, 0, 0, 0, 0
            ]
        );
    });

    it('should yield the right painted images for normal', function () {
        roiManager.resetPainted();
        let painted = roiManager.paint({positive: true, negative: false});
        Array.from(painted.getChannel(0).data).should.eql(
            [
                0, 0, 0, 0, 0,
                0, 255, 255, 255, 0,
                0, 255, 255, 255, 0,
                0, 255, 255, 255, 0,
                0, 0, 0, 0, 0
            ]
        );

    });
});
