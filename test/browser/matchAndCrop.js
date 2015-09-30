console.clear();
setAsync();

var stack=new IJS.Stack();

var imagesData=get('imagesData');
var results=[];


var toLoad=[];
for (var i=0; i<imagesData.length; i++) {
    var result={id: "image "+i};
    results.push(result);
    result.image=imagesData[i].content;
    toLoad.push(IJS.load(imagesData[i].content.value))
}

Promise.all(toLoad).then(function(images) {
    for (var i=0; i<images.length; i++) {
        processImage(images[i], i);
    }
    console.log(stack);

    var cropped=stack.matchAndCrop();

    set('results',results);
    done();
});

function processImage(image, i) {
    var grey=image.grey();
    var mask=grey.mask({algorithm: 0.1});
    var roiManager=image.getROIManager();
    roiManager.putMask(mask);
    results[i].grey={type:'png', value:grey.toDataURL()};
    results[i].mask={type:'png', value:mask.toDataURL()};
    // we take the biggest ROI and we crop based on the center of it the
    // original image
    var rois=roiManager.getROI('default',{
        negative: false, minSurface: 1000
    });
    var x=rois[0].meanX>>0;
    var y=rois[0].meanY>>0;
    var crop=image.crop({x:x-450, y:y-450, width:900, height:900});
    results[i].crop={type:'png', value:crop.toDataURL()};

    // we will create a stack
    stack.push(crop)

}

