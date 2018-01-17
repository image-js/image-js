import { Image } from 'test/common';
import 'should';

describe('convolution with separable kernel', () => {
    it('check the convolution for GREY image', () => {
        let image = new Image(4, 3,
            [
                1, 1, 1, 1,
                1, 1, 1, 1,
                1, 1, 1, 1
            ],
            { kind: 'GREY' }
        );

        const kernel = [[1, 2, 1], [1, 2, 1]];

        const result = Array.from(image.convolution(kernel, {
            algorithm: 'separable',
            border: 'periodic'
        }).data);

        result.should.eql(
            [
                9, 12, 12, 9,
                12, 16, 16, 12,
                9, 12, 12, 9
            ]
        );
    });
});
