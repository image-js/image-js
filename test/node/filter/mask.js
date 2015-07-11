'use strict';

import {IJ} from '../common';

describe('acreate a mask on a greyA image', function () {
    it('should create a mask for a threshold of 127', function () {
        let image = new IJ(4,1,[255, 255, 0, 255, 255, 0, 0, 0], {
            kind: 'GREYA'
        });

        var mask=image.mask();

        mask.channels.should.equal(1);
        mask.bitDepth.should.equal(1);
        mask.width.should.equal(4);
        mask.height.should.equal(1);

        var data=mask.data;
        data.should.instanceOf(Uint8Array);
        data.length.should.equal(1);

        data[0].should.equal(128);

    });
});

