import medianFromHistogram from '../../../src/utility/medianFromHistogram';

describe('check medianFromHistogram', function () {

    it('should get the right value for odd total', function () {
        medianFromHistogram([0,0,3,0,0]).should.equal(2);
        medianFromHistogram([0,1,1,1,0]).should.equal(2);
        medianFromHistogram([1,1,1,0,0]).should.equal(1);
        medianFromHistogram([1,0,0,0,0]).should.equal(0);
        medianFromHistogram([0,0,0,0,1]).should.equal(4);
        medianFromHistogram([0,0,3,0]).should.equal(2);
        medianFromHistogram([0,1,1,1]).should.equal(2);
        medianFromHistogram([1,1,1,0]).should.equal(1);
        medianFromHistogram([1,0,0,0]).should.equal(0);
        medianFromHistogram([0,0,0,1]).should.equal(3);
        medianFromHistogram([0,0,0,0.1]).should.equal(3);
        medianFromHistogram([0.1,0.1,0.1,0,0]).should.equal(1);
    });

    it('should get the right value for even total', function () {

        medianFromHistogram([0,0,4,0,0]).should.equal(2);
        medianFromHistogram([0,1,2,1,0]).should.equal(2);
        medianFromHistogram([1,2,1,0,0]).should.equal(1);
        medianFromHistogram([0,0,0,0,4]).should.equal(4);
        medianFromHistogram([0,0,1,1,0]).should.equal(2.5);
        medianFromHistogram([4,0,0,0,0]).should.equal(0);
        (typeof medianFromHistogram([0,0,0,0,0])).should.equal('undefined');

        medianFromHistogram([1,0,0,0,1]).should.equal(2);

    });
});


