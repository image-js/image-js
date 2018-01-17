import { Image, getSquare } from 'test/common';
import 'should';

function sub(a = 1, b = 2) {
    return a - b;
}

describe('Image extensions', function () {
    Image.extendMethod('testMethod1', sub);
    Image.extendMethod('testMethod2', function () {
        return this.width;
    }, { inPlace: true, returnThis: false });
    Image.extendMethod('testMethod3', function () {
        this.clone();
    }, { inPlace: true });
    Image.extendMethod('testMethod4', sub, { partialArgs: [6] });
    describe('extendMethod', function () {
        let img = getSquare();
        it('should add methods to the prototype', function () {
            img.testMethod1.should.be.a.Function();
            img.testMethod2.should.be.a.Function();
            Image.prototype.testMethod1.should.equal(img.testMethod1);
        });
        it('inplace and returnThis options', function () {
            img.testMethod1().should.equal(-1);
            img.testMethod1(5).should.equal(3);
            img.testMethod2().should.equal(3);
            img.testMethod3().should.equal(img);
        });
        it('partial arguments', function () {
            img.testMethod4().should.equal(4);
            img.testMethod4(3).should.equal(3);
        });
    });

    let count = 0;
    Image.extendProperty('testProp1', function () {
        count++;
        return this.width;
    });
    Image.extendProperty('testProp2', sub, { partialArgs: [5] });
    Image.extendProperty('testProp3', sub, { partialArgs: [18, 3] });
    describe('extendProperty', function () {
        let img;
        beforeEach(function () {
            count = 0;
            img = getSquare();
        });
        it('should compute the property on first access', function () {
            img.testProp1.should.equal(3);
            count.should.equal(1);
            img.testProp1.should.equal(3);
            img.testProp1.should.equal(3);
            count.should.equal(1);
        });
        it('should reset after an inplace filter', function () {
            img.testProp1.should.equal(3);
            count.should.equal(1);
            img.testProp1.should.equal(3);
            count.should.equal(1);
            img.testMethod3();
            count.should.equal(1);
            img.testProp1.should.equal(3);
            count.should.equal(2);
        });
        it('should pass parameters', function () {
            img.testProp2.should.equal(3);
            img.testProp3.should.equal(15);
        });
    });
});
