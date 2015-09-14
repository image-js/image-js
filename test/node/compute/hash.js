import {Image} from '../common';

describe('calculate the hash', function () {
    it('check getHash method', function () {
        let image = new Image(1,2,[230, 83, 120, 255, 100, 140, 13, 1]);
        let hash=image.getHash();
        hash.should.equal('becf045452565896bc785fe2007c6cc7ef0729c0bc5b2af77e8d391f0fb39978');
    });
    it('check getHash method for another image', function () {
        let image = new Image(1,2,[231, 83, 120, 255, 100, 140, 13, 1]);
        let hash=image.getHash();
        hash.should.equal('da1c8029ee43d0ae74241ea0f8afd3414502853c1eb5b41bfa4b2ea9f9599042');
    });


    it('check hash attribute', function () {
        let image = new Image(1,2,[230, 83, 120, 255, 100, 140, 13, 1]);
        let hash=image.hash;
        hash.should.equal('becf045452565896bc785fe2007c6cc7ef0729c0bc5b2af77e8d391f0fb39978');
    });

});

