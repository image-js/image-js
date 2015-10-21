import {Image} from '../common';

describe.only('we check ROI.getMask', function () {
    it('should yield the right mask', function () {
        let image = new Image(5, 5, {kind: 'GREY'});

        let points = [[1,3,4,5],[1,2,4,0]];

        let roiManager=image.getROIManager();
        roiManager.generateROIFromPoints(points, {kind: 'smallCross'});
        Array.from(roiManager.getPixels()).should.eql([
            0, 1, 0, 0, 4,
            1, 1, 1, 2, 0,
            0, 1, 2, 2, 2,
            0, 0, 0, 2, 3,
            0, 0, 0, 3, 3
        ]);

        var mask=roiManager.getMask({minSurface:5, maxSurface:5});

        // should be
        // 01000
        // 11100
        // 01000
        // 00000
        // 00000

        Array.from(mask.data).should.eql([0b01000111,0b00010000,0,0])
        console.log(mask.data);




    });

});


