'use strict';

var fs=require('fs');

var Image = require('../..');

// we will create a stack and load all the images

var baseDir=__dirname+"/../img/cells/fluorescent/";
var files=fs.readdirSync(baseDir);
var images=[];
var toLoad=[];
for (var i=1; i<files.length; i++) {
    var image={};
    images.push(image);
    image.name=baseDir+files[i];
    toLoad.push(Image.load(image.name))
}


Promise.all(toLoad).then(function(images) {
    var stack = new Image.Stack(images);
    var cropped = stack.matchAndCrop();
    for (var i = 0; i < cropped.length; i++) {
        console.log(i, cropped[i].width, cropped[i].height)
    }


}, function(error) {
    console.log(error);
});

