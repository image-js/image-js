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

        (function () {
            image.add('abc');
        }).should.throw(/should be either a/);

        (function () {
            image.add([1,2,3]);
        }).should.throw(/the data size is different/);

        let image2 = new Image(1,2,[1,2,3,4,5,6,7,8]);
        // by default alpha is untouched
        image2.add([1,2,3,4,5,6,7,8]).data.should.eql([2,4,6,4,10,12,14,8]);
    });
});

describe('subtract', function () {
    it('should subtract a fix value to all channels of RGBA image, we dont touch alpha', function () {

        let image = new Image(1,2,[230, 83, 120, 255, 100, 140, 13, 240]);

        let newImage = [130, 0, 20, 255, 0, 40, 0, 240];

        image.subtract(100);
        image.data.should.eql(newImage);

        (function () {
            image.subtract(-10);
        }).should.throw(/the value must be greater/);
    });
});
