import {Image, getSquare} from '../common';

function add(a = 1, b = 2) {
    return a + b;
}

describe('Image extensions', function () {
    Image.extendMethod('testMethod1', add);
    Image.extendMethod('testMethod2', function () {
        return this.width;
    }, true, false);
    Image.extendMethod('testMethod3', function () {
        this.clone();
    }, true);
    describe('extendMethod', function () {
        let img = getSquare();
        it('should add methods to the prototype', function () {
            img.testMethod1.should.be.a.Function();
            img.testMethod2.should.be.a.Function();
        });
        it('inplace and returnThis options', function () {
            img.testMethod1().should.equal(3);
            img.testMethod1(5).should.equal(7);
            img.testMethod2().should.equal(3);
            img.testMethod3().should.equal(img);
        });
    });

    let count = 0;
    Image.extendProperty('testProp1', function () {
        count++;
        return this.width;
    });
    Image.extendProperty('testProp2', add, 5);
    Image.extendProperty('testProp3', add, 3, 12);
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
            img.testProp1;
            count.should.equal(1);
            img.testProp1;
            count.should.equal(1);
            img.testMethod3();
            count.should.equal(1);
            img.testProp1;
            count.should.equal(2);
        });
        it('should pass parameters', function () {
            img.testProp2.should.equal(7);
            img.testProp3.should.equal(15);
        });
    });
});
