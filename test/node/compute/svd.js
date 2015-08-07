import {Image} from '../common';

describe('calculate svd', function () {
    it('check the result', function () {

        let img=new Image(8,2,[255,0],{
            kind: 'BINARY'
        });

        let svd=img.getSVD();

        svd.V[0].should.eql([-1, -0]);
        svd.V[1].should.eql([-0, -1]);

    });
});

