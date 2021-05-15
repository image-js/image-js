console.clear();

var stack = new IJS.Stack();
var baseName = 'moon/crop/BloodMoonTest-';
var images = [];
var toLoad = [];
for (var i = 1; i <= 8; i++) {
  var image = {};
  images.push(image);
  image.name = baseName + i + '.png';
  toLoad.push(load(image.name));
}
Promise.all(toLoad).then(
  function (images) {
    for (var i = 0; i < images.length; i++) {
      processImage(images[i], i);
    }
    var cropped = stack.matchAndCrop();
    for (var i = 0; i < cropped.length; i++) {
      (function (cropped, i) {
        window.setTimeout(function (self) {
          setRight(cropped[i]);
        }, 1000 * i);
      })(cropped, i);
    }
  },
  function (error) {
    console.log(error);
  },
);

function processImage(image, i) {
  var grey = image.grey();
  var mask = grey.mask({ algorithm: 0.1 });
  var roiManager = image.getRoiManager();
  roiManager.fromMask(mask);
  images[i].grey = { type: 'png', value: grey.toDataURL() };
  images[i].mask = { type: 'png', value: mask.toDataURL() };
  // we take the biggest Roi and we crop based on the center of it the
  // original image
  var rois = roiManager.getRois('default', {
    negative: false,
    minSurface: 10,
  });

  // we corner is the correct one ... we need to find the corner that
  // is the closest to the meanX / meanY and from there
  // take a scale
  var width = 120; // could be determine automatically
  var height = 120;
  var frameBorder = 20;

  var minX = rois[0].minX;
  var maxX = rois[0].maxX;
  var minY = rois[0].minY;
  var maxY = rois[0].maxY;
  var meanX = rois[0].meanX;
  var meanY = rois[0].meanY;

  if (Math.abs(minX - meanX) > Math.abs(maxX - meanX)) {
    var fromX = maxX - width;
    var toX = maxX;
  } else {
    var fromX = minX;
    var toX = minX + width;
  }

  if (Math.abs(minY - meanY) > Math.abs(maxY - meanY)) {
    var fromY = maxY - height;
    var toY = maxY;
  } else {
    var fromY = minY;
    var toY = minY + height;
  }
  var options = {
    x: fromX - frameBorder,
    y: fromY - frameBorder,
    width: width + 2 * frameBorder,
    height: height + 2 * frameBorder,
  };
  var crop = image.crop(options);
  images[i].crop = { type: 'png', value: crop.toDataURL() };

  // we will create a stack
  stack.push(crop);
}
