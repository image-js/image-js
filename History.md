<a name="0.21.4"></a>
## [0.21.4](https://github.com/image-js/core/compare/v0.21.3...v0.21.4) (2018-09-17)



<a name="0.21.3"></a>
## [0.21.3](https://github.com/image-js/core/compare/v0.21.2...v0.21.3) (2018-09-17)



<a name="0.21.2"></a>
## [0.21.2](https://github.com/image-js/core/compare/v0.21.1...v0.21.2) (2018-09-16)



<a name="0.21.1"></a>
## [0.21.1](https://github.com/image-js/core/compare/v0.21.0...v0.21.1) (2018-09-08)


### Bug Fixes

* pin canvas to alpha.12 ([1982ffb](https://github.com/image-js/core/commit/1982ffb))
* **build:** correct babel 7 config ([da0c8a9](https://github.com/image-js/core/commit/da0c8a9))
* **package:** update blob-util to version 2.0.2 ([#390](https://github.com/image-js/core/issues/390)) ([72780ce](https://github.com/image-js/core/commit/72780ce)), closes [#388](https://github.com/image-js/core/issues/388)


### Features

* **load:** add support palette PNG ([f6042f1](https://github.com/image-js/core/commit/f6042f1))



<a name="0.21.0"></a>
# [0.21.0](https://github.com/image-js/core/compare/v0.20.1...v0.21.0) (2018-04-26)


### Features

* add toBuffer method ([f2fdfc7](https://github.com/image-js/core/commit/f2fdfc7))



<a name="0.20.1"></a>
## [0.20.1](https://github.com/image-js/core/compare/v0.20.0...v0.20.1) (2018-04-13)


### Bug Fixes

* **save:** fix jpeg saving ([c4d90d0](https://github.com/image-js/core/commit/c4d90d0))



<a name="0.20.0"></a>
# [0.20.0](https://github.com/image-js/core/compare/v0.19.1...v0.20.0) (2018-03-15)


### Features

* insert image into another one ([f690a30](https://github.com/image-js/core/commit/f690a30))



<a name="0.19.1"></a>
## [0.19.1](https://github.com/image-js/core/compare/v0.19.0...v0.19.1) (2018-02-16)



<a name="0.19.0"></a>
# [0.19.0](https://github.com/image-js/core/compare/v0.18.1...v0.19.0) (2018-02-16)


### Performance Improvements

* optimize dilate and erode for "only-1" kernels with grey images ([2119414](https://github.com/image-js/core/commit/2119414))
* optimize erode and dilate for "only-1" kernels ([#374](https://github.com/image-js/core/issues/374)) ([6023f70](https://github.com/image-js/core/commit/6023f70))



<a name="0.18.1"></a>
## [0.18.1](https://github.com/image-js/core/compare/v0.18.0...v0.18.1) (2018-02-06)


### Bug Fixes

* allow again to export png from 1 or 32 bit images ([838f5e0](https://github.com/image-js/core/commit/838f5e0))



<a name="0.18.0"></a>
# [0.18.0](https://github.com/image-js/core/compare/v0.17.0...v0.18.0) (2018-02-06)



<a name="0.17.0"></a>
# [0.17.0](https://github.com/image-js/core/compare/v0.16.1...v0.17.0) (2018-02-01)


* infer file format from filename when saving ([9a30c34](https://github.com/image-js/core/commit/9a30c34))


### Bug Fixes

* fix gaussian blur. kernels should sum to 1 ([ea70851](https://github.com/image-js/core/commit/ea70851))
* pass bitDepth option in gradientFilter ([0b60bce](https://github.com/image-js/core/commit/0b60bce))


### Features

* add abs filter ([671f601](https://github.com/image-js/core/commit/671f601))
* direction option in sobelFilter ([8b9034e](https://github.com/image-js/core/commit/8b9034e))
* iteration parameter on erode ([4fd915a](https://github.com/image-js/core/commit/4fd915a))
* support conversion of 32-bit images to rgba data ([5790815](https://github.com/image-js/core/commit/5790815))


### BREAKING CHANGES

* not specifying a file format will throw instead of saving to png
* sobelFilter no longer allows custom filters. Use gradientFilter instead



<a name="0.16.1"></a>
## [0.16.1](https://github.com/image-js/core/compare/v0.16.0...v0.16.1) (2018-01-24)


### Features

* add getThreshold ([d4fdf9f](https://github.com/image-js/core/commit/d4fdf9f))



<a name="0.16.0"></a>
# [0.16.0](https://github.com/image-js/core/compare/v0.15.0...v0.16.0) (2018-01-17)


### Bug Fixes

* force version of rollup-plugin-node-resolve ([80b59bd](https://github.com/image-js/core/commit/80b59bd))
* **package:** does not support node 6 ([a1660bd](https://github.com/image-js/core/commit/a1660bd))


### Features

* decode JPEG in JS ([8d92060](https://github.com/image-js/core/commit/8d92060))



<a name="0.15.0"></a>
# [0.15.0](https://github.com/image-js/core/compare/v0.14.4...v0.15.0) (2017-12-11)



<a name="0.14.4"></a>
## [0.14.4](https://github.com/image-js/core/compare/v0.14.3...v0.14.4) (2017-08-16)


### Bug Fixes

* fix problem caused by inversion between white and black ([8eaf922](https://github.com/image-js/core/commit/8eaf922))



<a name="0.14.3"></a>
## [0.14.3](https://github.com/image-js/core/compare/v0.14.2...v0.14.3) (2017-08-15)


### Bug Fixes

* errors in the call of the morphological transforms ([b99d938](https://github.com/image-js/core/commit/b99d938))



<a name="0.14.2"></a>
## [0.14.2](https://github.com/image-js/core/compare/v0.14.1...v0.14.2) (2017-08-15)



<a name="0.14.1"></a>
## [0.14.1](https://github.com/image-js/core/compare/v0.14.0...v0.14.1) (2017-08-15)


### Bug Fixes

* errors in some cases with erode and dilate ([717d173](https://github.com/image-js/core/commit/717d173))
* errors in the definition of the dimensions of the submatrix ([e86e6a0](https://github.com/image-js/core/commit/e86e6a0))



<a name="0.14.0"></a>
# [0.14.0](https://github.com/image-js/core/compare/v0.13.0...v0.14.0) (2017-08-15)


### Bug Fixes

* add missing files ([3dc9491](https://github.com/image-js/core/commit/3dc9491))
* add missing files ([51d45ff](https://github.com/image-js/core/commit/51d45ff))
* change the arguments (replaced by one argument 'options') ([8f8ebc9](https://github.com/image-js/core/commit/8f8ebc9))
* check image and kernel ([7ea982c](https://github.com/image-js/core/commit/7ea982c))
* correction of the name of the errors ([afd79ba](https://github.com/image-js/core/commit/afd79ba))
* modify names of the tests ([c41e611](https://github.com/image-js/core/commit/c41e611))


### Features

* Add an argument 'iterations' to the morphological transforms (except dilate and erode) ([671d318](https://github.com/image-js/core/commit/671d318))
* Add erode and dilate functions ([e4e1dad](https://github.com/image-js/core/commit/e4e1dad))
* add subtractImage with absolute values and use it for new function -> morphologicalGradient ([d3cbfe2](https://github.com/image-js/core/commit/d3cbfe2))



<a name="0.13.0"></a>
# [0.13.0](https://github.com/image-js/core/compare/v0.12.0...v0.13.0) (2017-08-10)


### Bug Fixes

* add deleted tests, default option options.filled = false ([b93f388](https://github.com/image-js/core/commit/b93f388))
* bug when we want to draw polygon without fill it ([44013d4](https://github.com/image-js/core/commit/44013d4))
* replace the word 'filtred' by 'filtered' ([3f092b9](https://github.com/image-js/core/commit/3f092b9))
* revert rollup-plugin-babel to v2 ([57009cd](https://github.com/image-js/core/commit/57009cd))
* update doc polygon ([a611eac](https://github.com/image-js/core/commit/a611eac))


### Features

* Add drawing of filled polygons ([3491905](https://github.com/image-js/core/commit/3491905))
* Add the possibility to desactivate the computation of the aspect ratio. ([097f2a7](https://github.com/image-js/core/commit/097f2a7))
* Add the warping with 4 fours (transform a quadrilateral to a rectangle) ([e8e9a5e](https://github.com/image-js/core/commit/e8e9a5e))



<a name="0.12.0"></a>
# [0.12.0](https://github.com/image-js/core/compare/v0.11.11...v0.12.0) (2017-07-25)



<a name="0.11.11"></a>
## [0.11.11](https://github.com/image-js/core/compare/v0.11.10...v0.11.11) (2017-07-25)



<a name="0.11.10"></a>
## [0.11.10](https://github.com/image-js/core/compare/v0.11.9...v0.11.10) (2017-07-20)



<a name="0.11.9"></a>
## [0.11.9](https://github.com/image-js/core/compare/v0.11.8...v0.11.9) (2017-07-13)



<a name="0.11.8"></a>
## [0.11.8](https://github.com/image-js/core/compare/v0.11.7...v0.11.8) (2017-07-13)



<a name="0.11.7"></a>
## [0.11.7](https://github.com/image-js/core/compare/v0.11.6...v0.11.7) (2017-07-12)



<a name="0.11.6"></a>
## [0.11.6](https://github.com/image-js/core/compare/v0.11.5...v0.11.6) (2017-07-12)



<a name="0.11.5"></a>
## [0.11.5](https://github.com/image-js/core/compare/v0.11.4...v0.11.5) (2017-06-28)


### Features

* add cannyEdge method ([c19b90a](https://github.com/image-js/core/commit/c19b90a))



<a name="0.11.4"></a>
## [0.11.4](https://github.com/image-js/core/compare/v0.11.3...v0.11.4) (2017-06-28)



<a name="0.11.3"></a>
## [0.11.3](https://github.com/image-js/core/compare/v0.11.2...v0.11.3) (2017-06-13)



<a name="0.11.1"></a>
## [0.11.1](https://github.com/image-js/core/compare/v0.11.0...v0.11.1) (2017-06-07)


### Features

* Add paintPolygon and don t close shape in paintPolyline ([e7cad0c](https://github.com/image-js/core/commit/e7cad0c))



<a name="0.11.0"></a>
# [0.11.0](https://github.com/image-js/core/compare/v0.10.4...v0.11.0) (2017-05-29)



<a name="0.10.4"></a>
## [0.10.4](https://github.com/image-js/core/compare/v0.10.3...v0.10.4) (2017-05-22)


### Bug Fixes

* allow separable algorithm for big images ([1e8b28a](https://github.com/image-js/core/commit/1e8b28a))



<a name="0.10.3"></a>
## [0.10.3](https://github.com/image-js/core/compare/v0.10.2...v0.10.3) (2017-05-22)


### Features

* add algorithm for convolution with separable kernels ([c11bd98](https://github.com/image-js/core/commit/c11bd98))



<a name="0.10.2"></a>
## [0.10.2](https://github.com/image-js/core/compare/v0.10.1...v0.10.2) (2017-05-18)



<a name="0.10.1"></a>
## [0.10.1](https://github.com/image-js/core/compare/v0.10.0...v0.10.1) (2017-05-18)



<a name="0.10.0"></a>
# [0.10.0](https://github.com/image-js/core/compare/v0.9.13...v0.10.0) (2017-05-18)



<a name="0.9.13"></a>
## [0.9.13](https://github.com/image-js/core/compare/v0.9.12...v0.9.13) (2017-04-30)


### Bug Fixes

* **package:** update ml-matrix to version 3.0.0 ([#312](https://github.com/image-js/core/issues/312)) ([1b9b9ea](https://github.com/image-js/core/commit/1b9b9ea))



<a name="0.9.12"></a>
## [0.9.12](https://github.com/image-js/core/compare/v0.9.11...v0.9.12) (2017-04-16)



<a name="0.9.11"></a>
## [0.9.11](https://github.com/image-js/core/compare/v0.9.10...v0.9.11) (2017-04-15)



<a name="0.9.10"></a>
## [0.9.10](https://github.com/image-js/core/compare/v0.9.5...v0.9.10) (2017-04-12)


### Bug Fixes

* **package:** update image-type to version 3.0.0 ([#299](https://github.com/image-js/core/issues/299)) ([8c62465](https://github.com/image-js/core/commit/8c62465))


### Features

* add monotoneChainConvexHull and minimalBoundingRectangle ([139aa21](https://github.com/image-js/core/commit/139aa21))



<a name="0.9.5"></a>
## [0.9.5](https://github.com/image-js/core/compare/v0.9.4...v0.9.5) (2017-01-19)



<a name="0.9.4"></a>
## [0.9.4](https://github.com/image-js/core/compare/v0.9.3...v0.9.4) (2017-01-06)



<a name="0.9.3"></a>
## [0.9.3](https://github.com/image-js/core/compare/v0.9.2...v0.9.3) (2017-01-06)



<a name="0.9.2"></a>
## [0.9.2](https://github.com/image-js/core/compare/v0.9.1...v0.9.2) (2017-01-05)



<a name="0.9.1"></a>
## [0.9.1](https://github.com/image-js/core/compare/v0.9.0...v0.9.1) (2016-12-15)



<a name="0.9.0"></a>
# [0.9.0](https://github.com/image-js/core/compare/v0.8.9...v0.9.0) (2016-12-15)


### Features

* add bmp support to save ([86a07a5](https://github.com/image-js/core/commit/86a07a5))
* add support for bmp in toDataURL ([8b9fa61](https://github.com/image-js/core/commit/8b9fa61))



<a name="0.8.9"></a>
## [0.8.9](https://github.com/image-js/core/compare/v0.8.8...v0.8.9) (2016-12-02)


### Features

* implement cropAlpha ([149cf6b](https://github.com/image-js/core/commit/149cf6b))
* implement floodFill for binary images ([5d7b190](https://github.com/image-js/core/commit/5d7b190))



<a name="0.8.8"></a>
## [0.8.8](https://github.com/image-js/core/compare/v0.8.7...v0.8.8) (2016-12-01)


### Features

* add free rotation support ([#111](https://github.com/image-js/core/issues/111)) ([92cf504](https://github.com/image-js/core/commit/92cf504))



<a name="0.8.7"></a>
## [0.8.7](https://github.com/image-js/core/compare/v0.8.6...v0.8.7) (2016-11-30)


### Features

* allow toBase64 to be async for Node.js ([4644d2e](https://github.com/image-js/core/commit/4644d2e))



<a name="0.8.6"></a>
## [0.8.6](https://github.com/image-js/core/compare/v0.8.5...v0.8.6) (2016-11-30)


### Features

* allow toDataURL to be async for Node.js ([a4b5fb1](https://github.com/image-js/core/commit/a4b5fb1))



<a name="0.8.5"></a>
## [0.8.5](https://github.com/image-js/core/compare/v0.8.4...v0.8.5) (2016-11-30)


### Features

* add toBase64 method ([e7e8633](https://github.com/image-js/core/commit/e7e8633))



<a name="0.8.4"></a>
## [0.8.4](https://github.com/image-js/core/compare/v0.8.3...v0.8.4) (2016-11-30)



<a name="0.8.3"></a>
## [0.8.3](https://github.com/image-js/core/compare/v0.8.2...v0.8.3) (2016-11-29)



<a name="0.8.2"></a>
## [0.8.2](https://github.com/image-js/core/compare/v0.8.1...v0.8.2) (2016-11-27)



<a name="0.8.1"></a>
## [0.8.1](https://github.com/image-js/core/compare/v0.8.0...v0.8.1) (2016-11-26)



<a name="0.8.0"></a>
# [0.8.0](https://github.com/image-js/core/compare/v0.7.0...v0.8.0) (2016-11-21)


### Bug Fixes

* inverted components and channels in checkProcessable ([7b8b4c2](https://github.com/image-js/core/commit/7b8b4c2))
* **crop:** convert non-integer arguments ([e308ca6](https://github.com/image-js/core/commit/e308ca6))
* **paintMasks:** accept images with 3 channels ([cbb9b00](https://github.com/image-js/core/commit/cbb9b00))
* **save:** don't create write stream if getCanvas failed ([ce4271e](https://github.com/image-js/core/commit/ce4271e))


### Features

* **scale:** add preserveAspectRatio option ([6976c11](https://github.com/image-js/core/commit/6976c11)), closes [#259](https://github.com/image-js/core/issues/259)
* add img.rotate, img.rotateLeft and img.rotateRight ([a189747](https://github.com/image-js/core/commit/a189747)), closes [#235](https://github.com/image-js/core/issues/235)



<a name="0.7.0"></a>
# [0.7.0](https://github.com/image-js/core/compare/v0.6.3...v0.7.0) (2016-11-05)


### Bug Fixes

* correctly read bitsPerSample on RGB TIFF images ([5acf2a0](https://github.com/image-js/core/commit/5acf2a0))


### Features

* update tiff to add support for RGB images ([372e126](https://github.com/image-js/core/commit/372e126))



<a name="0.6.3"></a>
## [0.6.3](https://github.com/image-js/core/compare/v0.6.2...v0.6.3) (2016-10-31)


### Features

* add support for loading an image from buffers ([65830dd](https://github.com/image-js/core/commit/65830dd))
* add support for loading an image from buffers ([b701a0f](https://github.com/image-js/core/commit/b701a0f))



<a name="0.6.2"></a>
## [0.6.2](https://github.com/image-js/core/compare/v0.6.1...v0.6.2) (2016-10-18)


### Bug Fixes

* add missing GREY color model ([cd2f22e](https://github.com/image-js/core/commit/cd2f22e))



<a name="0.6.1"></a>
## [0.6.1](https://github.com/image-js/core/compare/v0.6.0...v0.6.1) (2016-10-13)



<a name="0.6.0"></a>
# [0.6.0](https://github.com/image-js/core/compare/v0.5.9...v0.6.0) (2016-10-12)


### Bug Fixes

* crop in fft convolution missed columns and rows ([9483fc0](https://github.com/image-js/core/commit/9483fc0))



<a name="0.5.9"></a>
## [0.5.9](https://github.com/image-js/core/compare/v0.5.8...v0.5.9) (2016-10-05)


### Features

* add getPixelsArray method ([8891fd1](https://github.com/image-js/core/commit/8891fd1))



<a name="0.5.8"></a>
## [0.5.8](https://github.com/image-js/core/compare/v0.5.7...v0.5.8) (2016-09-27)



<a name="0.5.7"></a>
## [0.5.7](https://github.com/image-js/core/compare/v0.5.6...v0.5.7) (2016-09-27)



<a name="0.5.6"></a>
## [0.5.6](https://github.com/image-js/core/compare/v0.5.5...v0.5.6) (2016-09-27)



<a name="0.5.5"></a>
## [0.5.5](https://github.com/image-js/core/compare/v0.5.4...v0.5.5) (2016-09-27)



<a name="0.5.4"></a>
## [0.5.4](https://github.com/image-js/core/compare/v0.5.3...v0.5.4) (2016-09-26)



<a name="0.5.3"></a>
## [0.5.3](https://github.com/image-js/core/compare/v0.5.0...v0.5.3) (2016-09-26)



<a name="0.5.0"></a>
# [0.5.0](https://github.com/image-js/core/compare/v0.2.3...v0.5.0) (2016-09-25)


### Features

* Add cmyk model and conversion from rgb and rgba to cmyk ([288ffd6](https://github.com/image-js/core/commit/288ffd6))
* add support for tiff and jpeg metadata ([1d6fcac](https://github.com/image-js/core/commit/1d6fcac))



<a name="0.2.3"></a>
## [0.2.3](https://github.com/image-js/core/compare/v0.1.12...v0.2.3) (2016-09-17)



<a name="0.1.12"></a>
## [0.1.12](https://github.com/image-js/core/compare/v0.1.11...v0.1.12) (2016-08-29)


### Bug Fixes

* **load:** allow to set withCredentials option ([6d16a2f](https://github.com/image-js/core/commit/6d16a2f))



<a name="0.1.11"></a>
## [0.1.11](https://github.com/image-js/core/compare/v0.1.10...v0.1.11) (2016-08-25)


### Bug Fixes

* **stack:** fix check of Symbol.species ([4ca66ed](https://github.com/image-js/core/commit/4ca66ed))



<a name="0.1.10"></a>
## [0.1.10](https://github.com/image-js/core/compare/v0.1.9...v0.1.10) (2016-08-03)


### Features

* add Image.fromCanvas ([b75f03c](https://github.com/image-js/core/commit/b75f03c))
* allow 8 neighbours connectivity for map creator ([e0ba870](https://github.com/image-js/core/commit/e0ba870))



<a name="0.1.9"></a>
## [0.1.9](https://github.com/image-js/core/compare/v0.1.8...v0.1.9) (2016-04-25)



<a name="0.1.8"></a>
## [0.1.8](https://github.com/image-js/core/compare/v0.1.7...v0.1.8) (2016-01-29)



<a name="0.1.7"></a>
## [0.1.7](https://github.com/image-js/core/compare/v0.1.6...v0.1.7) (2015-12-12)



<a name="0.1.6"></a>
## [0.1.6](https://github.com/image-js/core/compare/v0.1.5...v0.1.6) (2015-10-23)



<a name="0.1.5"></a>
## [0.1.5](https://github.com/image-js/core/compare/v0.1.4...v0.1.5) (2015-10-23)



<a name="0.1.4"></a>
## [0.1.4](https://github.com/image-js/core/compare/v0.1.3...v0.1.4) (2015-10-14)


### Features

* Improve ROI manager to create RGBA image for painting ([3d21bdb](https://github.com/image-js/core/commit/3d21bdb))



<a name="0.1.3"></a>
## [0.1.3](https://github.com/image-js/core/compare/v0.1.2...v0.1.3) (2015-10-02)



<a name="0.1.2"></a>
## [0.1.2](https://github.com/image-js/core/compare/v0.1.1...v0.1.2) (2015-09-20)



<a name="0.1.1"></a>
## [0.1.1](https://github.com/image-js/core/compare/v0.1.0...v0.1.1) (2015-09-20)



<a name="0.1.0"></a>
# [0.1.0](https://github.com/image-js/core/compare/v0.0.5...v0.1.0) (2015-09-19)



<a name="0.0.5"></a>
## [0.0.5](https://github.com/image-js/core/compare/v0.0.4...v0.0.5) (2015-08-14)



<a name="0.0.4"></a>
## [0.0.4](https://github.com/image-js/core/compare/v0.0.3...v0.0.4) (2015-07-21)



<a name="0.0.3"></a>
## 0.0.3 (2015-07-17)



