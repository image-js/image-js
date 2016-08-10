import {Image} from '../common';


describe('Find local extrema', function () {
    it('maximum for a GREY image', function () {

        let image = new Image(10,10,
            [
                1,1,1,1,1,1,1,1,1,1,
                1,1,1,1,1,1,1,1,1,1,
                1,1,1,4,1,1,1,1,1,1,
                1,1,1,1,1,1,1,1,1,1,
                1,1,1,1,1,1,1,1,1,1,
                1,1,1,1,1,1,1,1,1,1,
                1,1,1,1,1,1,1,1,1,1,
                1,1,1,1,1,1,4,1,1,1,
                1,1,1,1,1,1,1,1,1,1,
                1,1,1,1,1,1,1,1,1,1

            ],
            {kind: 'GREY'}
        );
        image.getLocalExtrema().should.eql([{x:3, y:2}, {x:6, y:7}]);
    });
    it('minimum for a GREY image', function () {

        let image = new Image(10,10,
            [
                5,5,5,5,5,5,5,5,5,5,
                5,5,5,5,5,5,5,5,5,5,
                5,5,5,2,5,5,5,5,5,5,
                5,5,5,5,5,5,5,5,5,5,
                5,5,5,5,5,5,5,5,5,5,
                5,5,5,5,5,5,5,5,5,5,
                5,5,5,5,5,5,5,5,5,5,
                5,5,5,5,5,5,2,5,5,5,
                5,5,5,5,5,5,5,5,5,5,
                5,5,5,5,5,5,5,5,5,5

            ],
            {kind: 'GREY'}
        );

        image.getLocalExtrema({algorithm:'min'}).should.eql([{x:3, y:2}, {x:6, y:7}]);
    });
    it('maximum for a GREY image with merge', function () {
        let image = new Image(10,10,
            [
                1,1,1,1,1,1,1,1,1,1,
                1,1,1,1,1,1,1,1,1,1,
                1,1,4,1,4,1,1,1,1,1,
                1,1,1,1,1,1,1,1,1,1,
                1,1,1,1,1,1,1,1,1,1,
                1,1,1,1,1,1,1,1,1,1,
                1,1,1,1,1,1,1,1,1,1,
                1,1,1,1,1,1,2,1,1,1,
                1,1,1,1,1,1,1,1,1,1,
                1,1,1,1,1,1,1,1,1,1
            ],
            {kind: 'GREY'}
        );
        image.getLocalExtrema(
            {removeClosePoints:3, region:1}
        ).should.eql([{x:3, y:2}, {x:6, y:7}]);
    });
});
