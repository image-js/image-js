import {Image} from '../common';


describe('fin local', function () {
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
        image.getLocalExtrema().should.eql([{id:1, x:3, y:2}, {id:2, x:6, y:7}]);
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

        image.getLocalExtrema({algorithm:'min'}).should.eql([{id:1, x:3, y:2}, {id:2, x:6, y:7}]);
    });
});
