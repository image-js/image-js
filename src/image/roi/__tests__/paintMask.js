import {Image, load} from 'test/common';

describe('we check paint mask', function () {
    it('should yield the right images', function () {
        return load('BW5x5.png').then(function (img) {


            let roiManager = img.getROIManager();
            let mask = img.mask({invert:true});
            roiManager.fromMask(mask);


            let painted = roiManager.paint();

            painted = roiManager.paint({
                distinctColors: true
            });

            painted = roiManager.paint({
                randomColors: true
            });

            painted = roiManager.paint({
                randomColors: true,
                alpha: 127
            });

            painted = roiManager.paint({
                randomColors: true,
                alpha: 127,
                showLabels: true
            });

           //  Array.from(painted.data).slice(0,8).should.eql([255,0,0,255,255,0,0,255]);
        });
    });
});
