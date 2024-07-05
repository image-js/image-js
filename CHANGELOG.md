# Changelog

### [0.35.6](https://www.github.com/image-js/image-js/compare/v0.35.5...v0.35.6) (2024-07-05)


### Bug Fixes

* add type for insert method ([faead4f](https://github.com/image-js/image-js/commit/faead4f71c0eb640e65fa9f2b17b31b3cc51351b))

### [0.35.5](https://www.github.com/image-js/image-js/compare/v0.35.4...v0.35.5) (2023-10-17)


### Bug Fixes

* add TypeScript definition to RoiManager ([#630](https://www.github.com/image-js/image-js/issues/630)) ([10bec0b](https://www.github.com/image-js/image-js/commit/10bec0b4b4794cf8c9d8459ebf77380829fa814d))

### [0.35.4](https://www.github.com/image-js/image-js/compare/v0.35.3...v0.35.4) (2023-06-14)


### Bug Fixes

* setMatrix() return this object ([#621](https://www.github.com/image-js/image-js/issues/621)) ([b4ca38e](https://www.github.com/image-js/image-js/commit/b4ca38efd196f87147f2f14f670b7214ed18f9b5))

### [0.35.3](https://www.github.com/image-js/image-js/compare/v0.35.2...v0.35.3) (2023-02-02)


### Bug Fixes

* **types:** wrong matrix definition ([#616](https://www.github.com/image-js/image-js/issues/616)) ([e265e2a](https://www.github.com/image-js/image-js/commit/e265e2a38c835e8b09678e003426e128e7c951ae))

### [0.35.2](https://www.github.com/image-js/image-js/compare/v0.35.1...v0.35.2) (2022-10-07)


### Bug Fixes

* add more typescript definitions ([#606](https://www.github.com/image-js/image-js/issues/606)) ([e4eb534](https://www.github.com/image-js/image-js/commit/e4eb5341314a322cb6addec998fd24b21e0c2143))
* bump fast-bmp to 2.0.1 ([#608](https://www.github.com/image-js/image-js/issues/608)) ([2ddabf9](https://www.github.com/image-js/image-js/commit/2ddabf9a21824c094b30bc93849308a228007b19))

### [0.35.1](https://www.github.com/image-js/image-js/compare/v0.35.0...v0.35.1) (2022-08-10)


### Bug Fixes

* add TypeScript definition to many methods ([#600](https://www.github.com/image-js/image-js/issues/600)) ([6caaf19](https://www.github.com/image-js/image-js/commit/6caaf19f0651945f798def1a1193b5d1ccf4d9f0))

## [0.35.0](https://www.github.com/image-js/image-js/compare/v0.34.1...v0.35.0) (2022-08-01)


### Features

* allow rotate & crop for bitDepth = 1 images ([#596](https://www.github.com/image-js/image-js/issues/596)) ([622b909](https://www.github.com/image-js/image-js/commit/622b9093f17698dd18c3564773a59dd54d4e7f7e))


### Bug Fixes

* add TypeScript definition to setChannel() method ([#597](https://www.github.com/image-js/image-js/issues/597)) ([551c334](https://www.github.com/image-js/image-js/commit/551c334bdcd9f8ea2972c31197ee0847a14ead3b))

### [0.34.1](https://www.github.com/image-js/image-js/compare/v0.34.0...v0.34.1) (2022-05-17)


### Bug Fixes

* add TypeScript definition for paintMasks() ([#591](https://www.github.com/image-js/image-js/issues/591)) ([6edd169](https://www.github.com/image-js/image-js/commit/6edd169cf161b3658a89dfa7d193fb718cd3c25c))

## [0.34.0](https://www.github.com/image-js/image-js/compare/v0.33.2...v0.34.0) (2022-04-11)


### Features

* add option to ignore color palette in TIFF images ([#589](https://www.github.com/image-js/image-js/issues/589)) ([07aa7d5](https://www.github.com/image-js/image-js/commit/07aa7d591ca0f674fca83fbfef910e4e6243181e))

### [0.33.2](https://www.github.com/image-js/image-js/compare/v0.33.1...v0.33.2) (2022-03-28)


### Bug Fixes

* add TypeScript definition for paintPolygon() ([#587](https://www.github.com/image-js/image-js/issues/587)) ([d0c0541](https://www.github.com/image-js/image-js/commit/d0c054124ef38b0dea6a791780a6b83fda842ee8))

### [0.33.1](https://www.github.com/image-js/image-js/compare/v0.33.0...v0.33.1) (2021-10-31)


### Bug Fixes

* update TIFF decoder ([#575](https://www.github.com/image-js/image-js/issues/575)) ([8a09396](https://www.github.com/image-js/image-js/commit/8a0939620027957e41209549ffe595c7c3023a37))

## [0.33.0](https://www.github.com/image-js/image-js/compare/v0.32.0...v0.33.0) (2021-08-30)


### ⚠ BREAKING CHANGES

* Improve MBR speed

### Bug Fixes

* Improve MBR speed ([c77fec2](https://www.github.com/image-js/image-js/commit/c77fec2308bf7d1f23ddc352d21f4f53ee911c8d))

## [0.32.0](https://www.github.com/image-js/image-js/compare/v0.31.4...v0.32.0) (2021-07-09)


### ⚠ BREAKING CHANGES

* auto-correct orientation of JPEG images according to EXIF (#563)
* Removed support for Node.js 10

### Bug Fixes

* auto-correct orientation of JPEG images according to EXIF ([#563](https://www.github.com/image-js/image-js/issues/563)) ([6a2bcf3](https://www.github.com/image-js/image-js/commit/6a2bcf3d479cf4ea700785a17fa4488892a3e448))
* **types:** add flipX and flipY to types ([2c14a85](https://www.github.com/image-js/image-js/commit/2c14a8510f4958f0c39c048300a9b4596f6268ee))
* **types:** remove bilinear from supported resize interpolations ([a96eb4c](https://www.github.com/image-js/image-js/commit/a96eb4c40867b715a4411e85fe13dff005179f5d))


### Miscellaneous Chores

* update dependencies ([ec97242](https://www.github.com/image-js/image-js/commit/ec972424fa6b1e34a65898d0dd4e179d7da0bb0b))

### [0.31.4](https://www.github.com/image-js/image-js/compare/v0.31.3...v0.31.4) (2021-01-21)


### Bug Fixes

* roundness was not 1 for perfect circle ([#548](https://www.github.com/image-js/image-js/issues/548)) ([e73f596](https://www.github.com/image-js/image-js/commit/e73f59606218f274bbace969ae48af3bbe1d8b2a))

### [0.31.3](https://www.github.com/image-js/image-js/compare/v0.31.2...v0.31.3) (2020-12-14)


### Bug Fixes

* update dependencies ([#539](https://www.github.com/image-js/image-js/issues/539)) ([c972f63](https://www.github.com/image-js/image-js/commit/c972f63a181706c65ea144ec1e6a6edf92deba5a))

### [0.31.2](https://www.github.com/image-js/image-js/compare/v0.31.1...v0.31.2) (2020-12-10)


### Performance Improvements

* improve medianFilter ([#537](https://www.github.com/image-js/image-js/issues/537)) ([c341fac](https://www.github.com/image-js/image-js/commit/c341facf65745641510b5c53d1c00e6b3c69697e))

### [0.31.1](https://www.github.com/image-js/image-js/compare/v0.31.0...v0.31.1) (2020-11-17)


### Bug Fixes

* correct hull filled mask ([81a8cd7](https://www.github.com/image-js/image-js/commit/81a8cd713add86fdb46f78024dacc343880d71cd))

## [0.31.0](https://www.github.com/image-js/image-js/compare/v0.30.3...v0.31.0) (2020-11-12)


### Features

* restore old implementations of getMask with hull or mbr ([#532](https://www.github.com/image-js/image-js/issues/532)) ([4d51dbd](https://www.github.com/image-js/image-js/commit/4d51dbd7baffc4cc32d625b2912e4fbdabdf13a0))

### [0.30.3](https://www.github.com/image-js/image-js/compare/v0.30.2...v0.30.3) (2020-10-20)


### Bug Fixes

* **types:** correct return type of Stack.getAverageImage to Image ([#529](https://www.github.com/image-js/image-js/issues/529)) ([ec6588c](https://www.github.com/image-js/image-js/commit/ec6588c2b0152bd865013ffe6fb3e5668c83cae3))

### [0.30.2](https://www.github.com/image-js/image-js/compare/v0.30.1...v0.30.2) (2020-10-18)


### Bug Fixes

* add basic Stack type definition ([#525](https://www.github.com/image-js/image-js/issues/525)) ([d5f1972](https://www.github.com/image-js/image-js/commit/d5f1972fc1f39b506882f46b7c6c7722157bfd4c))

### [0.30.1](https://www.github.com/image-js/image-js/compare/v0.30.0...v0.30.1) (2020-10-13)


### Bug Fixes

* include less files in npm package ([03903a6](https://www.github.com/image-js/image-js/commit/03903a692a3f4801d44d8d017fced52f218d0369))

## [0.30.0](https://www.github.com/image-js/image-js/compare/v0.29.0...v0.30.0) (2020-10-13)


### Bug Fixes

* correct TIFF support in documentation ([7f3993f](https://www.github.com/image-js/image-js/commit/7f3993f189fe8adb32467b9c8522273778392871))
