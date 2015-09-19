import {Image} from '../common';

describe('calculate the overlap with another image', function () {
    it('check identical images without shift', function () {

        let image = new Image(1,2,[0, 0, 0, 0, 255, 255, 255, 255]);
        let image2 = new Image(1,2,[0, 0, 0, 0, 255, 255, 255, 255]);
        let similarity=image.getSimilarity(image2, {average: false});
        similarity.should.eql([1,1,1]);

        similarity=image.getSimilarity(image2, {average: true});
        similarity.should.equal(1);

        similarity=image.getSimilarity(image2);
        similarity.should.eql(1);


        similarity=image.getSimilarity(image2, {average: false, channels: ['r','g']});
        similarity.should.eql([1,1]);

        similarity=image.getSimilarity(image2, {average: false, defaultAlpha: true});
        similarity.should.eql([1,1,1,1]);

    });

    it('check if sum = 0', function () {
        let image = new Image(1,2,[0, 255, 0, 0, 0, 0, 0, 0]);
        let image2 = new Image(1,2,[0, 0, 200, 255, 255, 0, 255, 255]);

        let similarity=image.getSimilarity(image2, {average: false});
        similarity.should.eql([0,0,0]);

        similarity=image.getSimilarity(image2, {average: false, channels: ['r','g']});
        similarity.should.eql([0,0]);

        similarity=image.getSimilarity(image2, {average: false, defaultAlpha: true});
        similarity.should.eql([0,0,0,0]);

    });

    it('check different images without shift', function () {

        let image = new Image(1,3,[0, 0, 0, 0, 20, 20, 20, 20, 30, 30, 30, 30]);
        let image2 = new Image(1,3,[1, 10, 20, 2, 2, 20, 30, 1, 2, 20, 0, 2]);
        let similarity=image.getSimilarity(image2, {average: false});
        similarity.should.eql([0.08, 0.8, 0.4]);

        similarity=image.getSimilarity(image2, {average: false, normalize: true});
        similarity.should.eql([0.8, 0.8, 0.4]);

        similarity=image.getSimilarity(image2, {average: false, channels: ['r','b']});
        similarity.should.eql([0.08,0.4]);

        similarity=image.getSimilarity(image2, {channels: ['r','b']});
        similarity.should.approximately(0.24,0.0002);

        similarity=image.getSimilarity(image2, {average: false, defaultAlpha: true});
        similarity.should.eql([0.08, 0.8, 0.4, 0.06]);
    });

    it('check different images with shift', function () {
        let image = new Image(3,1,[0, 0, 0, 0, 10, 10, 10, 10, 30, 30, 30, 30]);
        let image2 = new Image(3,1,[0, 0, 0, 0, 10, 10, 10, 10, 30, 30, 30, 30]);
        let similarity=image.getSimilarity(image2, {average: false});
        similarity.should.eql([1, 1, 1]);

        similarity=image.getSimilarity(image2, {average: false, normalize: true});
        similarity.should.eql([1, 1, 1]);

        similarity=image.getSimilarity(image2, {average: false, shift: [1, 0]});
        similarity.should.eql([0.25, 0.25, 0.25]);

        similarity=image.getSimilarity(image2, {average: false, shift: [-1, 0]});
        similarity.should.eql([0.25, 0.25, 0.25]);

        similarity=image.getSimilarity(image2, {average: false, shift: [0, 1]});
        similarity.should.eql([0, 0, 0]);

        similarity=image.getSimilarity(image2, {average: false, shift: [0, -1]});
        similarity.should.eql([0, 0, 0]);
    });


});

