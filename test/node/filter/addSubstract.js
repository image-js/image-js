import {Image} from '../common';

describe('add', function () {
    it('should add a fix value to all channels of RGBA image, we dont touch alpha', function () {

        let image = new Image(1,2,[230, 83, 120, 255, 100, 140, 13, 240]);

        let newImage = [255, 183, 220, 255, 200, 240, 113, 240];

        image.add(100);
        image.data.should.eql(newImage);

        (function () {
            image.add(-10);
        }).should.throw(/the value must be greater/);
    });
});

describe('substract', function () {
    it('should substract a fix value to all channels of RGBA image, we dont touch alpha', function () {

        let image = new Image(1,2,[230, 83, 120, 255, 100, 140, 13, 240]);

        let newImage = [130, 0, 20, 255, 0, 40, 0, 240];

        image.substract(100);
        image.data.should.eql(newImage);

        (function () {
            image.substract(-10);
        }).should.throw(/the value must be greater/);
    });
});