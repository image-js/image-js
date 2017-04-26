import {load} from 'test/common';

describe.skip('check matchAndCrop on real images', function () {
    it('should return an array of 2 images cropped and moved using matchToPrevious', function () {

        let toLoad = [];
        toLoad.push(load('cells/fluorescent2/C11-3-0000.png'));
        toLoad.push(load('cells/fluorescent2/C11-3-1800.png'));
        toLoad.push(load('cells/fluorescent2/C11-3-3600.png'));
        toLoad.push(load('cells/fluorescent2/C11-3-5400.png'));
        toLoad.push(load('cells/fluorescent2/C11-3-7200.png'));
        toLoad.push(load('cells/fluorescent2/C11-3-9000.png'));

        return Promise.all(toLoad).then(function (images) {

            for (let i = 0; i < images.length; i++) {
                images[i] = images[i].gaussianFilter({radius: 5});

                let median = images[i].median;
                images[i] = images[i].subtract(median);

            }


       //     images = new Stack(images);
         //       console.log("Number of loaded images: " + images.length);

       //     let results = images.matchAndCrop({ignoreBorder: [0, 0]});
    //            results.should.be.instanceOf(Stack).and.have.lengthOf(2);
                //getHash(results[1]).should.equal(getHash(results[2]));
                //
                //let result = results[0];
                //result.width.should.equal(4);
                //result.height.should.equal(3);
                //Array.from(result.data).should.eql(
                //    [
                //        1, 2, 2, 2,
                //        1, 2, 4, 3,
                //        1, 2, 3, 3
                //    ]
                //);


        //    let result = images[0].getBestMatch(images[1]);
             //   console.log(result);
        });

    });
});

