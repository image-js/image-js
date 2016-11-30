import {getSquare} from 'test/common';

describe('toDataURL and toBase64', function () {
    it('toDataURL', function () {
        const image = getSquare();
        const dataURL = image.toDataURL();
        dataURL.should.be.a.String();
        dataURL.should.startWith('data:image/png;base64,');
    });

    it('toBase64', function () {
        const image = getSquare();
        const dataURL = image.toDataURL();
        const base64 = image.toBase64();
        base64.should.be.a.String();
        base64.should.equal(dataURL.substring(dataURL.indexOf(',') + 1));
    });
});
