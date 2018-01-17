import { getFactor, factorDimensions } from '../converter';
import 'should';

describe('Converter tests', function () {
    describe('getFactor', function () {
        it('with numbers', function () {
            getFactor(1).should.equal(1);
            getFactor(0.6).should.equal(0.6);
            getFactor(5).should.equal(5);
        });

        it('with number strings', function () {
            getFactor('1').should.equal(1);
            getFactor('0.6').should.equal(0.6);
            getFactor('5').should.equal(5);
        });

        it('with percentage strings', function () {
            getFactor('100%').should.equal(1);
            getFactor('15%').should.equal(0.15);
            getFactor('256%').should.equal(2.56);
        });
    });

    describe('factorDimensions', function () {
        it('integer result', function () {
            factorDimensions(1, 100, 100).should.eql({ width: 100, height: 100 });
            factorDimensions(2, 100, 30).should.eql({ width: 200, height: 60 });
            factorDimensions(0.5, 12, 100).should.eql({ width: 6, height: 50 });
        });
        it('non integer result', function () {
            factorDimensions(0.5, 11, 13).should.eql({ width: 6, height: 7 });
            factorDimensions('25%', 15, 25).should.eql({ width: 4, height: 6 });
            factorDimensions(1 / 3, 100, 122).should.eql({ width: 33, height: 41 });
        });
    });
});
