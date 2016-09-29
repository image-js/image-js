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
    let mask = image.mask({threshold: 1, algorithm: 'threshold'});
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

describe('we check paint mask and draw label', function () {

    let image = new Image(100, 100, {kind: 'GREY'});
    image.setPixelXY(10,50,[1]);
    image.setPixelXY(50,50,[1]);
    image.setPixelXY(80,50,[1]);

    let mask = image.mask({threshold: 1, algorithm:'threshold'});
    let roiManager = image.getROIManager();
    roiManager.fromMask(mask, {positive: true, negative: false});

    it('should yield the right painted images with label', function () {
        roiManager.resetPainted();
        let painted = roiManager.paint({
            positive: true,
            negative: false,
            labelProperty: 'id',
            labelFont : '1pt Helvetica'
        });

       painted.toDataURL().should.equal(
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAC20lEQVR4nO3Xv2sTYRzH8XeaiigooYqtcSgqSOkgWheLFBFEXLoL/gFSEERQaMHFv0CdxNGthTo4CaUuBSdFLCIodXEp/kDEwaVYvw53YHJ2yKV5ko/x84KHlEty34P3XR9SAQKTMdDrC7BmDiLGQcQ4iBgHEeMgYhxEjIOIcRAxDiLGQcQ4iBgHEeMgYhxEjIOIcRAxDiLGQcQ4iBgHEeMgYhxEjIOIcRAxDiLGQcQ4iBgHEeMgYhxEjIOIcRAxDiLGQcQ4iBgHEbONIDVguGMX0ll1YALY18WZFeAoMA7s3taZor21GLDQ5ndTrZGApwHRsF4GHE4890TA24aZGwEPAna0c74yHx4MGAu4FbApGORxwMeAiwHDAdMBXwJWAiqJZg4ErAU8DzgbMBpwPeBXwFzqILNB092nFGQo4GfA1cLxm/m1jiaaezo//2Th+ErAk9LnK7mH3AWG8vWu3FeT2w+8Ap4Vjn/LX3clmvsVmAVWG45VgYP5e+W1eWe8EXtCtlq1gNWA9wHVLsybDJgJWAr4EDCe+gn5l5wnu2sPAZeBzS7MPAPcAM4BG2RPbXl99oSMBDyKbFOdD6j34BrqAS8CPgXs/J+fkJNkT8UYMAVcAtYTz7wAzBSOrQP3gQPAkVJn66MgVWAeeA2c4u/NPZUJ4B6wp3C8RnbTl7shBjtzUQqmgGPAQ2B6i/eXgO8J5i4Ct4E7+etnsv1rDlhua2af7CHXgqbfSMV1POHsKwE/CvOWI/txWu5clfyPlqpVWvlgj/Tq+v7M3Uv27yuANdrdu1oOYt3RR5t6f3AQMQ4ixkHEOIgYBxHjIGIcRIyDiHEQMQ4ixkHEOIgYBxHjIGIcRIyDiHEQMQ4ixkHEOIgYBxHjIGIcRIyDiHEQMQ4ixkHEOIgYBxHjIGIcRIyDiHEQMQ4ixkHEOIgYBxHjIGIcRIyDiHEQMQ4ixkHEOIgYBxHjIGIcRMxvRx231nDWncYAAAAASUVORK5CYII='
       );
    });

    it('should yield the right painted images with surface', function () {
        roiManager.resetPainted();
        let painted = roiManager.paint({
            positive: true,
            negative: false,
            labelProperty: 'surface',
            labelColor: 'red',
            labelFont : '1pt Helvetica'
        });

        painted.toDataURL().should.equal(
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAABhElEQVR4nO3bMUrEUBRA0afMAsTGLbgdKzdiaW/rQtyQO7GRsXAaOzPzh9ziHEgXeA8uP4RAbmbmOGTc7r0AfwkSI0iMIDGCxAgSI0iMIDGCxAgSI0iMIDGCxAgSI0iMIDGCxAgSI0iMIDGCxAgSI0iMIDGCxAgSI0iMIDGCxAgSI0iMIDGCxAgSI0iMIDGCxJwd5G5mHhYustpe+10692bO/C36Y2a+Z+b5guHXtNd+l87ddEIOM/M4M68z83TmwGvaa7+Vcw9bbn6ZmbcLB17TXvutnLvphLzPzP3p+ly0wEp77bdy7qYT8nW6Zn6fkzV77bdyrtfeGEFiBIkRJEaQGEFi/v3p5Hi6uWqv/VbPPftbFtfhkRUjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLE/ABZBCGElyhoAgAAAABJRU5ErkJggg=='
        );
    });

});
