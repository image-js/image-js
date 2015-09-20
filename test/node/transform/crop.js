import {Image, getHash} from '../common';

describe('check the crop transform', function () {
    it('check the right extract for GREY image', function () {

        let image=new Image(5, 5,
            [
                0, 0, 0, 0, 0,
                0, 1, 1, 1, 1,
                0, 1, 2, 2, 2,
                0, 1, 2, 4, 3,
                0, 1, 2, 3, 3
            ],
            {kind: 'GREY'}
        );

        let result=image.crop({
            x:0,
            y:0
        });

        getHash(result).should.equal(getHash(image));

        result=image.crop({
            x:2,
            y:2
        });
        Array.from(result.data).should.eql([2,2,2,2,4,3,2,3,3]);

        result=image.crop({
            x:0,
            y:0,
            height: 2,
            width: 2
        });
        Array.from(result.data).should.eql([0,0,0,1]);


        result=image.crop({
            x:2,
            y:2,
            height: 2,
            width: 2
        });
        Array.from(result.data).should.eql([2,2,2,4]);

        result=image.crop({
            x:1,
            y:3,
            height: 1,
            width: 4
        });
        Array.from(result.data).should.eql([1,2,4,3]);

    });


});

