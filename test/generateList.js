'use strict';

var fs = require('fs');

var list = [];

function getImages(folder) {
  var files = fs.readdirSync(__dirname + '/' + folder);
  files.forEach(function (file) {
    var path = folder + '/' + file;
    var stat = fs.statSync(__dirname + '/' + path);
    if (stat.isDirectory()) {
      getImages(path);
    } else if (/\.(jpg|jpeg|tiff|tif|png|gif)$/i.test(file)) {
      list.push(path.slice(4));
    }
  });
}

getImages('img');

fs.writeFileSync(
  __dirname + '/' + 'imgList.json',
  JSON.stringify(list, null, 2),
);
