# Changelog

## 1.0.0 (2025-08-13)


### ⚠ BREAKING CHANGES

* refactor points and add absolute coords calculation ([#472](https://github.com/image-js/image-js/issues/472))
* group optional arguments in computeThreshold
* renamed autoLevel to increaseContrast
* remove getmap method in roi  ([#347](https://github.com/image-js/image-js/issues/347))
* change ROI borders API to return array of Border object ([#276](https://github.com/image-js/image-js/issues/276))
* change property name from "corners" to "points" in mbr

### Features

* adapt demo to use snapshot ([525e8c0](https://github.com/image-js/image-js/commit/525e8c01efead9b8dbf78d1a94f92052a7b4cfb7))
* add a sum operation ([#384](https://github.com/image-js/image-js/issues/384)) ([09621e5](https://github.com/image-js/image-js/commit/09621e50ec813e79c0d67a5563dfd448968d0a92))
* add background correction ([#449](https://github.com/image-js/image-js/issues/449)) ([f3ca64c](https://github.com/image-js/image-js/commit/f3ca64c7ba548367ca75b38db4c1f64294856e23))
* add base64 image encoding ([595ca54](https://github.com/image-js/image-js/commit/595ca54945cd5dacd98e53c60dc4a18a5c1ffc7b))
* add bmp encoding ([#462](https://github.com/image-js/image-js/issues/462)) ([f81e45e](https://github.com/image-js/image-js/commit/f81e45ea3d5f542b38d69ad2ebdcb3b2eb8be391))
* add caliperLines property in feret diameters ([#321](https://github.com/image-js/image-js/issues/321)) ([0a565ed](https://github.com/image-js/image-js/commit/0a565edb4e888d2ed6b1a55f421bf0194afd639e))
* add CameraSnapshotButton and SnapshotImage ([12d4bb8](https://github.com/image-js/image-js/commit/12d4bb8ef29c7c3f95ad37c6142e07ec67740037))
* add color options to clearBorder ([#291](https://github.com/image-js/image-js/issues/291)) ([98d27a4](https://github.com/image-js/image-js/commit/98d27a40e57a8b8b311111f56eb32ddb65d0cc75))
* add cropRectangle ([#439](https://github.com/image-js/image-js/issues/439)) ([6e2b57c](https://github.com/image-js/image-js/commit/6e2b57cdf1c0e1c4ea269bbf5ef5b5e7e6ebb9e1))
* add features that calculate convexHull, borders length etc. ([04f73e6](https://github.com/image-js/image-js/commit/04f73e6f3f6cf700975760c34707aa07442f37c1))
* add function to compute minima and maxima  ([#369](https://github.com/image-js/image-js/issues/369)) ([d74a29d](https://github.com/image-js/image-js/commit/d74a29deeee96f1abe34dd27512c9d44f029d3fe))
* add functions to get and set by point ([#185](https://github.com/image-js/image-js/issues/185)) ([6e812a5](https://github.com/image-js/image-js/commit/6e812a5e65510b331f47eccbba8e79441bfd7b17)), closes [#180](https://github.com/image-js/image-js/issues/180)
* add generic clamp function ([26ccd22](https://github.com/image-js/image-js/commit/26ccd22005d813258d7fcb35d9f17ffe4bbc7c07))
* add getExtrema and removeClosePoints geometry utils ([#412](https://github.com/image-js/image-js/issues/412)) ([70e18b0](https://github.com/image-js/image-js/commit/70e18b021fdadd376107a56feabd81bbac9d9511))
* add getRow and getColumn methods to Image.ts ([#346](https://github.com/image-js/image-js/issues/346)) ([03c0263](https://github.com/image-js/image-js/commit/03c0263f611e96e2af0feb260390e032887b39d0))
* add loading image from fetching URL ([#482](https://github.com/image-js/image-js/issues/482)) ([bdfff4e](https://github.com/image-js/image-js/commit/bdfff4e2796336f6dcf1740ef32bef7becf25021))
* add multiply/divide functions ([#459](https://github.com/image-js/image-js/issues/459)) ([ffca331](https://github.com/image-js/image-js/commit/ffca3316edf89533c6d749b7e9cf358c8eaad498))
* add new method getRoiById on RoiMapManager ([#343](https://github.com/image-js/image-js/issues/343)) ([dedf44e](https://github.com/image-js/image-js/commit/dedf44e0740299bcb72216635557812450b53be4))
* add option to choose an algorithm of pixelization ([#344](https://github.com/image-js/image-js/issues/344)) ([0ab4329](https://github.com/image-js/image-js/commit/0ab432909657f7e520f8934ade1519cff323f5a9))
* add option to specify the number of slots for the histogram ([f597aea](https://github.com/image-js/image-js/commit/f597aeac6c5bb48127e92f9dacc46be70b81dec8))
* add option to specify the number of slots for the histogram ([#448](https://github.com/image-js/image-js/issues/448)) ([f597aea](https://github.com/image-js/image-js/commit/f597aeac6c5bb48127e92f9dacc46be70b81dec8))
* add options to mean, median and variance  ([#471](https://github.com/image-js/image-js/issues/471)) ([37db7e3](https://github.com/image-js/image-js/commit/37db7e3fcb0e248dfa53060737aa6652924ace7c))
* add origin to IJS, Mask and Roi ([d01f409](https://github.com/image-js/image-js/commit/d01f4097415be958f32425b7a002950b454de373))
* add pixelization filter of an image ([#338](https://github.com/image-js/image-js/issues/338)) ([7a2e57a](https://github.com/image-js/image-js/commit/7a2e57aa785e969fc15ee89d6b07cc49f8f5b149))
* add ROI features that calculate convexHull, borders length etc. ([#237](https://github.com/image-js/image-js/issues/237)) ([04f73e6](https://github.com/image-js/image-js/commit/04f73e6f3f6cf700975760c34707aa07442f37c1))
* add scale to Montage ([02e3cc0](https://github.com/image-js/image-js/commit/02e3cc01934010fa2a803db7505ec4fff2438952)), closes [#203](https://github.com/image-js/image-js/issues/203)
* add setClampedValue and setClampedValueByIndex ([#443](https://github.com/image-js/image-js/issues/443)) ([4d254d3](https://github.com/image-js/image-js/commit/4d254d3d9775be6e07834f9e24a41bde326c1eb8))
* add Stack class to public API ([#475](https://github.com/image-js/image-js/issues/475)) ([ec04a57](https://github.com/image-js/image-js/commit/ec04a5773c308eb5730b95007270e3dead632994))
* add static method fromMask to RoiMapManager ([#289](https://github.com/image-js/image-js/issues/289)) ([661e66b](https://github.com/image-js/image-js/commit/661e66bf0c17c4960e7e8ac0ea5d400edb7e7d85))
* add support for URL and recursive option in write methods ([#284](https://github.com/image-js/image-js/issues/284)) ([0e8410a](https://github.com/image-js/image-js/commit/0e8410a5990dba779b984e4220537b3fdd6453e9))
* add watershed filter ([#379](https://github.com/image-js/image-js/issues/379)) ([ecab15e](https://github.com/image-js/image-js/commit/ecab15e3041e844b2fcf15b738f881c38e7cefd4))
* **alignMinDiff:** extend to any nb of components ([a6032d4](https://github.com/image-js/image-js/commit/a6032d41eef5b09a221e744dd4721a23d6f3a1c4)), closes [#402](https://github.com/image-js/image-js/issues/402)
* allow conversion from mask to RGB and RGBA ([#335](https://github.com/image-js/image-js/issues/335)) ([d68e926](https://github.com/image-js/image-js/commit/d68e926a1989f5b98ab072e964e8d83ae464cb6c))
* **autoLevel:** add uniform option ([9f87a41](https://github.com/image-js/image-js/commit/9f87a41a0eba35a6a2c7e9e897d6c731a3648c59))
* blend pixels using alpha in all draw functions ([#478](https://github.com/image-js/image-js/issues/478)) ([692b155](https://github.com/image-js/image-js/commit/692b15513ae177b6641af16a4fb55fe4c2db471f))
* change property name from "corners" to "points" in mbr ([5209949](https://github.com/image-js/image-js/commit/520994997f10b4bf56746cd63f1d8ef36ada3568))
* **checkPointIsInteger:** force user to pass integer points ([f3c6d72](https://github.com/image-js/image-js/commit/f3c6d72a8c12d46af52209a9c337697967a32c55)), closes [#353](https://github.com/image-js/image-js/issues/353)
* convert image if needed when encoding ([#466](https://github.com/image-js/image-js/issues/466)) ([cca4975](https://github.com/image-js/image-js/commit/cca4975882789b41e0cc4eeebfdbe038c0d9be98))
* create bundled types in build output ([5076c62](https://github.com/image-js/image-js/commit/5076c621a0f18e14aac15825271355c7b0a1aae5))
* decode and expose metadata ([#354](https://github.com/image-js/image-js/issues/354)) ([d0e1936](https://github.com/image-js/image-js/commit/d0e1936362efdc1a88c5212be4a1ed768363a879))
* **drawKeypoints:** add showOrientation option ([fac8161](https://github.com/image-js/image-js/commit/fac8161137c7a7771de5a9c765d3e82dd8959d4d))
* drawMarker and drawMarkers ([11c755d](https://github.com/image-js/image-js/commit/11c755d3048f4328c694d7b5b44fdde71471530c))
* **drawRectangle:** add fillColor = 'none' option ([d3e5830](https://github.com/image-js/image-js/commit/d3e5830d98f1145a8498404c1f1ab1473bf9a44c)), closes [#311](https://github.com/image-js/image-js/issues/311)
* expose `extendBorders` ([#465](https://github.com/image-js/image-js/issues/465)) ([1225b4d](https://github.com/image-js/image-js/commit/1225b4d7e50f0106e13d27d4b8269b24c91ce8e9))
* expose BorderType and InterpolationType ([f19c0fd](https://github.com/image-js/image-js/commit/f19c0fd6547b0cda07561bbc1a335ada97d7c655))
* expose image.minMax ([3b92425](https://github.com/image-js/image-js/commit/3b924250157717838c0f5b80b14d7d71c32e9959)), closes [#307](https://github.com/image-js/image-js/issues/307)
* expose list of grey algorithms ([00589a1](https://github.com/image-js/image-js/commit/00589a16d8701c5c78cc9df3bbe9b1461b0f5a70))
* **getAffineTransform:** change return object ([b3312d3](https://github.com/image-js/image-js/commit/b3312d3c29a27949513b34261737e6d612b92706))
* **getAffineTransform:** simplify options ([c1a1467](https://github.com/image-js/image-js/commit/c1a146743c93702df74cdafb82442af89f127478)), closes [#372](https://github.com/image-js/image-js/issues/372)
* **getFastKeypoints:** add normaliseScores option ([afdb2c9](https://github.com/image-js/image-js/commit/afdb2c95ef3b4d442cdc368da5760769f304bbfd))
* **getFastKeypoints:** add scoreAlgorithm option ([373bcca](https://github.com/image-js/image-js/commit/373bcca5391c8c893cec67c4f5064b0830d21765))
* impelement meanDifference ([a703a3b](https://github.com/image-js/image-js/commit/a703a3be7eb819ddb7956cb91a58ca841eb54fd1))
* implement `cropAlpha` ([#131](https://github.com/image-js/image-js/issues/131)) ([8de414f](https://github.com/image-js/image-js/commit/8de414f98319b4aed33d460357dd9d269e17824a))
* implement `rotate` with multiples of 90 degrees ([6f4830f](https://github.com/image-js/image-js/commit/6f4830f322d59633a18643e3ca59917670d1c17d))
* implement affine transform utilities ([65714bf](https://github.com/image-js/image-js/commit/65714bf70e7c1b2e9bcbcf3eaca906bab8a4a46c))
* implement alignImagesMinDifference ([43ac550](https://github.com/image-js/image-js/commit/43ac5509443d07cfbb68ca75c8b41e2bfc2a8d65)), closes [#366](https://github.com/image-js/image-js/issues/366)
* implement average ([9de5381](https://github.com/image-js/image-js/commit/9de53815d74463740c6663583fab1a2eb8b84d98))
* implement bruteForceMatch ([036f21e](https://github.com/image-js/image-js/commit/036f21e5ac5432bc7b8bc0eddb6923cbcdc428e5)), closes [#183](https://github.com/image-js/image-js/issues/183)
* implement CameraSnapshotButton ([b8c196d](https://github.com/image-js/image-js/commit/b8c196d6827bfdbf3317333a694b335217c19935))
* implement channelLabels ([#294](https://github.com/image-js/image-js/issues/294)) ([fedba43](https://github.com/image-js/image-js/commit/fedba43d57efa2e54ce6fab977b065ebd7abaa10))
* implement checkBorderDistance ([d33dd7d](https://github.com/image-js/image-js/commit/d33dd7daa619adec6db61b7ba21e73becab1fe82))
* implement compareIntensity ([7612e1c](https://github.com/image-js/image-js/commit/7612e1ce1ba83513e83f6e48853ed86fe2b3a121))
* implement computeDssim ([7a97050](https://github.com/image-js/image-js/commit/7a97050425f377b049d14b8956060e41d70e0086))
* implement drawMatches ([44b42fc](https://github.com/image-js/image-js/commit/44b42fc59e53daeeb2c63bdcc2e56b161f06752e))
* implement drawPoints ([c589acd](https://github.com/image-js/image-js/commit/c589acdca9b55215d2fc1f022c3340e57bd15bf5))
* implement enhanceContrast ([ae0aeed](https://github.com/image-js/image-js/commit/ae0aeeda9ef217b8b789b90ec685abe975749e2b))
* implement extractSquareImage ([9c7fc17](https://github.com/image-js/image-js/commit/9c7fc178da2beca0377a3f4573fe8c187e716290))
* implement filterBestKeypoints ([a9d1998](https://github.com/image-js/image-js/commit/a9d19985fa76b527473e95c79384e10512d6dbc0))
* implement filterEuclidianDistance ([badd71a](https://github.com/image-js/image-js/commit/badd71a9f29d7c11b63a6b5d31d89ecccf486649))
* implement filterSmallestDistanceMatches ([c3cb0a7](https://github.com/image-js/image-js/commit/c3cb0a7840ea0da6ba66526debcf45ec5d886d97))
* implement getBasicMontage ([1dc4bfc](https://github.com/image-js/image-js/commit/1dc4bfca6cb20f8da052d5c97107cfdeb00fb5c9))
* implement getBriedDescriptors ([c0c2bda](https://github.com/image-js/image-js/commit/c0c2bda371eb9df5a944906aa87e7bee019eee5b))
* implement getBrief ([7e1b215](https://github.com/image-js/image-js/commit/7e1b215a640c015c7f72d3a00254cc8492c39174))
* implement getChannel ([efc3d5a](https://github.com/image-js/image-js/commit/efc3d5a694a9014af6cb029e4581aa54de8f6625))
* implement getCirclePoints ([51b9fc1](https://github.com/image-js/image-js/commit/51b9fc1d1c30a436dec5b3806c55ffde8660c267))
* implement getCornerScore ([236e80c](https://github.com/image-js/image-js/commit/236e80cdad908702f51dbbc941ea0c1d4ef73570))
* implement getCrosscheckMatches ([8b719c5](https://github.com/image-js/image-js/commit/8b719c52ccdf1b5869e49718bc530a180a47b4c4)), closes [#197](https://github.com/image-js/image-js/issues/197)
* implement getDistanceMatrix ([34ed186](https://github.com/image-js/image-js/commit/34ed186339c2b5430239fbc125972f33af9495b4))
* implement getFeret ([e709d31](https://github.com/image-js/image-js/commit/e709d31109575881fb4ad73aeb326163a9343dcd))
* implement getFilledCirclePoints ([ad97cb8](https://github.com/image-js/image-js/commit/ad97cb8662669e7b844fbbdc020234da1c005a49))
* implement getGaussianPoints ([1c4e707](https://github.com/image-js/image-js/commit/1c4e7070b39311b230be05bbed2a80530cdbe49a))
* implement getHarrisScore ([c482082](https://github.com/image-js/image-js/commit/c482082d227526f011862cd8f00da54a6826fcde))
* implement getKeypointColor ([920d719](https://github.com/image-js/image-js/commit/920d719e1dcd37f5ea67da9fdf82f83a8ba0274c)), closes [#188](https://github.com/image-js/image-js/issues/188)
* implement getKeypointPatch ([6314b82](https://github.com/image-js/image-js/commit/6314b82c4385f318647dd10d8922a92034d95bae))
* implement getKeypointsInRadius ([8db6270](https://github.com/image-js/image-js/commit/8db627026faa5bd06784ff48b46c926005da6b82)), closes [#216](https://github.com/image-js/image-js/issues/216)
* implement getLineLentgh ([8103abe](https://github.com/image-js/image-js/commit/8103abe80363f05d46ff4a48aef435e927497875))
* implement getLinePoints ([2bb1c6d](https://github.com/image-js/image-js/commit/2bb1c6dc73c9c395b0913cf21fa140df8679cf60))
* implement getMatchColor ([09c2b20](https://github.com/image-js/image-js/commit/09c2b200a159fbee6bdeab6264246f7e883a38ae))
* implement getMathAngle ([bfeacfb](https://github.com/image-js/image-js/commit/bfeacfba263a9fcc0838e2bfd91dd7f2c8f3c2fd))
* implement getMbrAngle ([2ffeb10](https://github.com/image-js/image-js/commit/2ffeb10bd5a046c2514ae34f480b290662fecde0))
* implement getPatchIntensityMoment ([a547a46](https://github.com/image-js/image-js/commit/a547a465927cb043ac5438e33a3bff5e809e5289))
* implement getPolygonArea ([036341e](https://github.com/image-js/image-js/commit/036341eb7eead9589f58c5ec5bf1fce84d509cd2))
* implement getPolygonPerimeter ([82c2587](https://github.com/image-js/image-js/commit/82c2587f2210fa4b7444f6780abf6c74315d3c75))
* implement getScoreColors ([6674470](https://github.com/image-js/image-js/commit/66744704907fb5eb143180343f1152ea05fd934b))
* implement GetScoreColorsOptions ([f4fabd0](https://github.com/image-js/image-js/commit/f4fabd00f8a234e946810503c1e82d1062d64ac5))
* implement getSourceWithoutMargins ([24a6b66](https://github.com/image-js/image-js/commit/24a6b6622ead70c2264322501d9cf95279733554))
* implement hamming distance ([ee796cb](https://github.com/image-js/image-js/commit/ee796cb91f3bb0ad94971b6082758586b3e375c9)), closes [#183](https://github.com/image-js/image-js/issues/183)
* implement isFastKeypoints ([bc04d2e](https://github.com/image-js/image-js/commit/bc04d2ef5aeb78ff561d77476fc094e3b193f9e7))
* implement mask.paintMask ([3c53e6b](https://github.com/image-js/image-js/commit/3c53e6bb244e5fde26ce5b368618f6de9d756863))
* implement median ([95aab70](https://github.com/image-js/image-js/commit/95aab70ef42d4d36ffb11b3f97ea3254e7c2de65))
* implement median filter for noise removal ([#337](https://github.com/image-js/image-js/issues/337)) ([4b99fe6](https://github.com/image-js/image-js/commit/4b99fe67ffd65cf705fdadb630e0c3ae12ba6732))
* implement Montage class ([7421ca1](https://github.com/image-js/image-js/commit/7421ca1ab4052186530be3e21b5a54bfb99b0dc4)), closes [#200](https://github.com/image-js/image-js/issues/200)
* implement mse and rmse ([c82b95a](https://github.com/image-js/image-js/commit/c82b95ac01821de5abc69bb64993bafa25506aa4)), closes [#152](https://github.com/image-js/image-js/issues/152)
* implement oriented FAST features ([#171](https://github.com/image-js/image-js/issues/171)) ([7a6a014](https://github.com/image-js/image-js/commit/7a6a0146cf2740ef9f0b9e002574c5a307211520)), closes [#165](https://github.com/image-js/image-js/issues/165)
* implement overlapImages ([e8fb18f](https://github.com/image-js/image-js/commit/e8fb18f5d0a639aca740112378d5682f831cb99d))
* implement perspective warp ([#484](https://github.com/image-js/image-js/issues/484)) ([1a96bf3](https://github.com/image-js/image-js/commit/1a96bf38e697187ea47493f07aa60bb25352c4ad))
* implement psnr ([2725149](https://github.com/image-js/image-js/commit/27251494c50a0ff4de23b1f33f5a593959eb2a07)), closes [#152](https://github.com/image-js/image-js/issues/152)
* implement scaleKeypoints ([d072086](https://github.com/image-js/image-js/commit/d0720869dd4966fde966c4ab0aaffe9cd25881cc))
* implement setVisiblePixel ([3d93dce](https://github.com/image-js/image-js/commit/3d93dce6a001bd750d27e58f77afe5fce24f0742))
* implement sliceBrief ([8052336](https://github.com/image-js/image-js/commit/8052336ed563e6446b29e0ae86b058c360fb27c3))
* implement sliceBrief ([3f47965](https://github.com/image-js/image-js/commit/3f4796599c0033acf591176e796bc2b062d908c1))
* implement SnapshotImage ([8d03fec](https://github.com/image-js/image-js/commit/8d03fecf6ffdc5cb34e595e66cc8069835d3a179))
* implement sortByColumnRow ([810c368](https://github.com/image-js/image-js/commit/810c368b01212c01adef3ffd8f7135df33f777f9))
* implement sortByDistance ([20b4d26](https://github.com/image-js/image-js/commit/20b4d2691cc6c698eaeab859248236fb5cba52bf))
* implement ssim ([fd723ea](https://github.com/image-js/image-js/commit/fd723eaa7c22dea33f2a615a1de066a132cbef27))
* implement validateForComparison ([2bc29bc](https://github.com/image-js/image-js/commit/2bc29bcbae5ffd2a531ddcd1bf3120b6d7e4770b))
* implement variance ([3ce1526](https://github.com/image-js/image-js/commit/3ce1526056d4602867cc3b365e40e7c3f82c8cb7))
* improve histogram ([#358](https://github.com/image-js/image-js/issues/358)) ([ce6a4f4](https://github.com/image-js/image-js/commit/ce6a4f4a28f61f5968df56db69cceed887866fbb))
* **level:** parameters can now be arrays ([0952643](https://github.com/image-js/image-js/commit/0952643fed92e12457e6e7f07befd93bd6859065)), closes [#307](https://github.com/image-js/image-js/issues/307)
* make encode types easier to use ([7e22b9c](https://github.com/image-js/image-js/commit/7e22b9c1e848b862081100cdb35f5eea4a77db48))
* **Montage:** add disposition options ([6bd9e84](https://github.com/image-js/image-js/commit/6bd9e84e39afe84a9d8c161ecd7e4f829eec7bea))
* **overlapImages:** add angle and scale ([09cb838](https://github.com/image-js/image-js/commit/09cb838799519154cc96ecdeb3e44c5ccddae9a2))
* refactor points and add absolute coords calculation ([#472](https://github.com/image-js/image-js/issues/472)) ([ad9f91d](https://github.com/image-js/image-js/commit/ad9f91d0ead5160c86e2b09d27082be7e9a29071))
* **ROI:** add new property filledSurface ([#314](https://github.com/image-js/image-js/issues/314)) ([d91cf57](https://github.com/image-js/image-js/commit/d91cf57c3d9178bb71643ec950242dbb9ae45c98))
* **ROI:** add new property filledSurface ([#314](https://github.com/image-js/image-js/issues/314)) ([d91cf57](https://github.com/image-js/image-js/commit/d91cf57c3d9178bb71643ec950242dbb9ae45c98))
* RoiMap could too easily contain over 2^15 rois ([#388](https://github.com/image-js/image-js/issues/388)) ([afecc5f](https://github.com/image-js/image-js/commit/afecc5fc1070fb14e5d021c7126e32f3a9f76be8))
* start implementing getDestinationOrigin ([6edbd5f](https://github.com/image-js/image-js/commit/6edbd5ffac3c1c93b5cc267f631a10b417449556)), closes [#248](https://github.com/image-js/image-js/issues/248)
* start implementing stacks ([#416](https://github.com/image-js/image-js/issues/416)) ([0c347c8](https://github.com/image-js/image-js/commit/0c347c84c673faefe2e154dc70df598b1184f660))
* **threshold:** authorize threshold in percents ([#150](https://github.com/image-js/image-js/issues/150)) ([d80f0e1](https://github.com/image-js/image-js/commit/d80f0e1f954e7cf894512f77dc812f086e7c2931)), closes [#142](https://github.com/image-js/image-js/issues/142)
* working on script to align images ([2e3bf12](https://github.com/image-js/image-js/commit/2e3bf126a685bec850092c4be8b7a87cf70535ce))


### Bug Fixes

* 16-bit PNG encoding ([#445](https://github.com/image-js/image-js/issues/445)) ([f1832a3](https://github.com/image-js/image-js/commit/f1832a3a55e424aec95e367697de6363822086c6))
* add bruteForceMatch options ([bacba4d](https://github.com/image-js/image-js/commit/bacba4d0aa674751c5f8445628164fd10eef1640))
* add option to only draw desired nb of annotations ([d0f456e](https://github.com/image-js/image-js/commit/d0f456ee7ad9680d4f147f009d93cb3e6eae6def))
* add origin option to drawKeypoint ([93c31a3](https://github.com/image-js/image-js/commit/93c31a392f5d2a5f6e12c23a3dc2186bf6152d94))
* affineTransform import issues ([00095e2](https://github.com/image-js/image-js/commit/00095e2195cee84a7ca023d15e902262a3f5b39c))
* alignImages works even with slightly different typos ([5d10816](https://github.com/image-js/image-js/commit/5d10816827eaae49ca3df71400be3c8f7f7ca115))
* **alignImages:** add debug info ([0e9831f](https://github.com/image-js/image-js/commit/0e9831f470b0d13f36d9aa944218e6865e3c4947))
* **alignImages:** deleting files works ([11ad6ca](https://github.com/image-js/image-js/commit/11ad6ca15ade788ca1afd0a02144f347e22435c1))
* **alignImages:** empty folder with fs.opendir ([7f6e145](https://github.com/image-js/image-js/commit/7f6e145bd0057c4eb3334ec93e2f0bf338d4cee2))
* aligning works ([3b4a81a](https://github.com/image-js/image-js/commit/3b4a81a6d4e0d794942ce5b95d6a86f34fc489c4))
* **alignMinDiff:** edge case bug ([8c34ce0](https://github.com/image-js/image-js/commit/8c34ce0f296d32f80faee096c09bf803ac58c9f2))
* **alignMinDiff:** subtract absolute value was missing ([48d4a08](https://github.com/image-js/image-js/commit/48d4a08b85c07444665c7149410f49fa64dc39b7))
* allow 16 bits images to be written on canvas ([#350](https://github.com/image-js/image-js/issues/350)) ([331d42e](https://github.com/image-js/image-js/commit/331d42e7fcfd5f5438e108cefd15f14689278353))
* allow handling floating values in draw functions ([#383](https://github.com/image-js/image-js/issues/383)) ([f7b46a3](https://github.com/image-js/image-js/commit/f7b46a3736c5bfb9d1d9f0ad3914ce3a3c31bf21))
* allow to decode JPEG files of any size ([#145](https://github.com/image-js/image-js/issues/145)) ([9e0a7e1](https://github.com/image-js/image-js/commit/9e0a7e158df9ef149c3728747157c1e7e99db695))
* avoid black pixels on patch borders ([b708731](https://github.com/image-js/image-js/commit/b708731f6ec9f3f0a4a1e767cf5b96ccf7b86b05)), closes [#236](https://github.com/image-js/image-js/issues/236)
* bug in checkBorderDistance ([62c4309](https://github.com/image-js/image-js/commit/62c43095f81482252a75d9a551b6293f09a6a693))
* calculate aspectRatio in mbr more consistently  ([#341](https://github.com/image-js/image-js/issues/341)) ([fdfc847](https://github.com/image-js/image-js/commit/fdfc8479d8ec2809640f57927d7ead63a79acc5b))
* change getGaussianPoints parameters ([ce9d634](https://github.com/image-js/image-js/commit/ce9d634e6db3fe079d76450f2f7d52d47974458c))
* channel validator ([09e739b](https://github.com/image-js/image-js/commit/09e739b6230749ddb586350282446c99eb2c1f2d)), closes [#371](https://github.com/image-js/image-js/issues/371)
* check and fix api inconsistencies ([#738](https://github.com/image-js/image-js/issues/738)) ([8b2301f](https://github.com/image-js/image-js/commit/8b2301f1a3221f54c8abf50c0fb610d9374b3b83))
* **compareIntensity:** points coordinates were false ([93ca357](https://github.com/image-js/image-js/commit/93ca3574d17d5d9626df4a67e69407e76319fdf0)), closes [#194](https://github.com/image-js/image-js/issues/194)
* computeSsim works ([065eb90](https://github.com/image-js/image-js/commit/065eb909dbbdf9c1cdc6690d99ba1f6feb76fddf))
* **computeSsim:** add algorithm option ([c742899](https://github.com/image-js/image-js/commit/c742899026b17ae336caad200dc70a30d80661ab))
* convex Hull ([917abcf](https://github.com/image-js/image-js/commit/917abcfdaaa2b6640c029e17fd71b4812ca55b0a)), closes [#148](https://github.com/image-js/image-js/issues/148)
* copy origin in convertDepth and extract ([e870fec](https://github.com/image-js/image-js/commit/e870fec61648d54d3a3d299a325332f19acce854))
* correct 16 bits image thresholding ([8ca381f](https://github.com/image-js/image-js/commit/8ca381fd1d3f723682375bf77dc9e163eeb2eee6)), closes [#374](https://github.com/image-js/image-js/issues/374)
* correct hypothenuse implementation when custom channels are passed ([#407](https://github.com/image-js/image-js/issues/407)) ([646dc2b](https://github.com/image-js/image-js/commit/646dc2b0066f31616cc9d228ce7cd3a2e07291e9))
* correct level default options and rename autoLevel to increaseContrast ([#409](https://github.com/image-js/image-js/issues/409)) ([58041ea](https://github.com/image-js/image-js/commit/58041eaa73e5f92bceecf1504becdb551bb2f816))
* correct things for review ([5b01dc4](https://github.com/image-js/image-js/commit/5b01dc4783df1cf7de5fc4cbd710e05c61d7fe15))
* **createFrom:** copy input image origin ([4cecfe4](https://github.com/image-js/image-js/commit/4cecfe4b67436d3701db6da60f8dfea495cd0de4))
* **crop:** throw if floating values are passed ([9ebc8ae](https://github.com/image-js/image-js/commit/9ebc8ae0ffaa63debcb50058b60dd3db2161d119)), closes [#353](https://github.com/image-js/image-js/issues/353)
* debug borderDistance ([3a1c62a](https://github.com/image-js/image-js/commit/3a1c62a3b1046867ca359959092fd25aea777a34))
* debug sortBySourceDest ([74e3a40](https://github.com/image-js/image-js/commit/74e3a408dff4054b9134c0e0815beb4ffd30e33e))
* draw functions work with shape out of image ([430da8d](https://github.com/image-js/image-js/commit/430da8defe83b839593475e209a3183ef4d8165a)), closes [#118](https://github.com/image-js/image-js/issues/118)
* drawCircle options were not optional ([7193ec8](https://github.com/image-js/image-js/commit/7193ec85b19abfab8250c49447c0fc0319cb55f7))
* **drawCircleOnImage:** handle non integer radius ([01062b7](https://github.com/image-js/image-js/commit/01062b7ff4c098dd02bb2e01c45416248b7d3bb9))
* drawKeypoints with score color works ([b03aae3](https://github.com/image-js/image-js/commit/b03aae33e9dcf43468dd6c7a864ac5b6d371c1bb))
* **drawKeypoints:** showOrientation was buggy ([5107e0f](https://github.com/image-js/image-js/commit/5107e0fd141e0fbda63eb624e77732d87bbd3d92))
* **drawMatches:** add option to show keypoints ([c9f925c](https://github.com/image-js/image-js/commit/c9f925cf627112028068a41f21049f9930f0181f))
* **drawMatches:** scale was not handled properly ([220d78b](https://github.com/image-js/image-js/commit/220d78be43d29727a561a118d13a5493f2eeb759))
* **drawMatches:** showDistance had a bug ([00655de](https://github.com/image-js/image-js/commit/00655dee3613e55c76decf7ad2980d5befb6688e))
* **drawMatches:** use drawKeypoints ([3a41ab4](https://github.com/image-js/image-js/commit/3a41ab482f59b974bc96a35f1a81eb194885924b))
* **drawMatches:** use Montage ([ff79424](https://github.com/image-js/image-js/commit/ff794240f82302c6bb7f6f466f1f9b559beff6da))
* **drawMatches:** works with showScore ([d372d2a](https://github.com/image-js/image-js/commit/d372d2a7e59e85faf4ae55c5946b0b2a6cdee096))
* **drawPoints:** allow out to be Mask ([bdbb104](https://github.com/image-js/image-js/commit/bdbb1049ed842481e9775f34d01f7243d2ec5c64)), closes [#355](https://github.com/image-js/image-js/issues/355)
* **draw:** round floating point values ([bdf359f](https://github.com/image-js/image-js/commit/bdf359f463d80d2498299edf37f1626ee2343d55)), closes [#353](https://github.com/image-js/image-js/issues/353)
* enhance alignImages to use various datasets ([9688a6a](https://github.com/image-js/image-js/commit/9688a6a7a347b7c115af2afa167a71c69e5c8a6c))
* enhance generic fm script ([678363d](https://github.com/image-js/image-js/commit/678363d73307dbe6c1f488fe0642b8f1e88ad007))
* export channel labels ([#360](https://github.com/image-js/image-js/issues/360)) ([6b1e1f6](https://github.com/image-js/image-js/commit/6b1e1f657cf0cd7dee27ac9d7f620691a0ddb853))
* expose Point interface ([0e52551](https://github.com/image-js/image-js/commit/0e52551228fce8713becd34654dfce7d1622e6ed))
* **extract:** use options origin ([27f5074](https://github.com/image-js/image-js/commit/27f5074e0f74ad440054c2829c04fa1621915759))
* **featureMatchingTest:** use min and max to level ([9827870](https://github.com/image-js/image-js/commit/98278706c7cb05d2d14d328c19dc170f66d1d6d8))
* **filterEuclideanDistance:** last element not handled properly ([c468fe4](https://github.com/image-js/image-js/commit/c468fe41e5db04aa1ceda95af4af1a7b8eb0b230))
* fix bug with transform function and fullImage:true ([#487](https://github.com/image-js/image-js/issues/487)) ([59009fa](https://github.com/image-js/image-js/commit/59009fade4d8c3cac4d7947581400de2b6b37e06))
* fix bug with transparent circle fill ([#480](https://github.com/image-js/image-js/issues/480)) ([928b6e7](https://github.com/image-js/image-js/commit/928b6e7325f1e4511fbcbaeb8e82019d76f7f605))
* fix compute functions parameters ([e71b254](https://github.com/image-js/image-js/commit/e71b2546f28f0990964fc9275ccdb66372a5d1e8))
* fix getChannel ([111e15e](https://github.com/image-js/image-js/commit/111e15e2c6d7f49f4f4851d67cf6452b87519a80))
* generalize getIntensityMoment ([#184](https://github.com/image-js/image-js/issues/184)) ([bc7dfee](https://github.com/image-js/image-js/commit/bc7dfeeb299fd2ea5a3610ed5f236d51a6694089)), closes [#177](https://github.com/image-js/image-js/issues/177)
* **getAffineTransform:** round translation coordinates ([3a7a907](https://github.com/image-js/image-js/commit/3a7a9073ecb912a5e5a99845d50a02f64825b7ed))
* **getAffineTransform:** works with ID card crops! ([c16888b](https://github.com/image-js/image-js/commit/c16888b97632b0f3c5b9eec2c0761bd68cbc5da1))
* **getBorderPoints:** innerBorders option ([1e628bd](https://github.com/image-js/image-js/commit/1e628bd85345cee723d8c61c7486e8d0cb8ed9e0))
* **getBrief:** add minScore option ([6171505](https://github.com/image-js/image-js/commit/6171505bada4c0494e36a00c78da0fbaee5182c4))
* **getBriefDescriptors:** add minBorderDistance option ([d7250fb](https://github.com/image-js/image-js/commit/d7250fbdcc401d61adf7d71509e4957c7f319e2f))
* **getBriefDescriptors:** avoid even dimensions ([9b7be25](https://github.com/image-js/image-js/commit/9b7be254127e5b3e9429e7fdffda73374f75d8e6))
* **getBriefDescriptors:** enhance options ([4584c74](https://github.com/image-js/image-js/commit/4584c74ca40c56606ce6a84bc8a4f64a2cbb88fe))
* **getBriefDescriptors:** extract keypoint patch ([237382b](https://github.com/image-js/image-js/commit/237382b40d8572d13fd20dc84e995676e404eee4))
* **getBriefDescriptors:** handle edge cases ([e436b35](https://github.com/image-js/image-js/commit/e436b353b58e94bb064d71d4e33e36fd12d2f239))
* **getBriefDescriptors:** tests run until the end ([6b18bc9](https://github.com/image-js/image-js/commit/6b18bc93e8b1033b95ad3405f52aaaf0d7cb0052))
* getCirclePoints loop ([0ac917e](https://github.com/image-js/image-js/commit/0ac917e2588c2a0034b087d442bfa94f88d157d3))
* **getCirclePoints:** return ordered points ([a9517cf](https://github.com/image-js/image-js/commit/a9517cfdcc1e9d94eab64657f553a9dac2295f29))
* **getConvexHull:** add surface and perimeter ([76ca8d2](https://github.com/image-js/image-js/commit/76ca8d2484bdec2012588ff8e0dc2f133a56cba0)), closes [#121](https://github.com/image-js/image-js/issues/121)
* **getFastKeypoints:** add fastRadius as parameter ([ecf5e4a](https://github.com/image-js/image-js/commit/ecf5e4a322f135472be3e74dfb479f6cfcd63955))
* **getFastKeypoints:** add nonMaxSuppresssion option ([fa02901](https://github.com/image-js/image-js/commit/fa029017fb819b99348db8ec0b6675b0b32123a3))
* **getFastKeypoints:** remove duplicate keypoints ([7f1d583](https://github.com/image-js/image-js/commit/7f1d583b1958567988b8011e1e1d04625c1da91e))
* **getFastKeypoints:** remove normalizeScore option ([1a8424f](https://github.com/image-js/image-js/commit/1a8424ff197550a7a90e8f71518c052eaf8138ac))
* getFeret has expected behaviour ([db0a3b6](https://github.com/image-js/image-js/commit/db0a3b61a9f13b986a1044300386d6802d078278)), closes [#138](https://github.com/image-js/image-js/issues/138)
* **getFilledCirclePoints:** remove duplicates ([d0424f1](https://github.com/image-js/image-js/commit/d0424f1d4f8e7f91b72477de21399ede0fc463f9))
* **getHarrisScore:** x and y inverted ([00d7602](https://github.com/image-js/image-js/commit/00d76029e50a830bd4285663c7974383ffdd2848))
* **getKeypointColor:** color index was wrong ([7bdb8c2](https://github.com/image-js/image-js/commit/7bdb8c26ebcfcbe419de5f0850ae0060f76a53f3))
* **getKeypointPatch:** fix rotation ([74d5871](https://github.com/image-js/image-js/commit/74d58718578be246d119f6dfe38c04f376ed071b))
* getMask should return filled ROI ([31b7e54](https://github.com/image-js/image-js/commit/31b7e5491315a430f484bb1549801575366a1cf9))
* **getMask:** remove useless option ([#292](https://github.com/image-js/image-js/issues/292)) ([70d251c](https://github.com/image-js/image-js/commit/70d251c3cd502172848bda1516575b09f7cb4318))
* **getMbr:** add Mbr interface ([72e797d](https://github.com/image-js/image-js/commit/72e797d6dc72a25db8d09dcb417ab055675bf7a0)), closes [#121](https://github.com/image-js/image-js/issues/121)
* **getMbrAngle:** angle should be in degrees ([5a74e0e](https://github.com/image-js/image-js/commit/5a74e0e29524fbb983660d190d9d3bdf2173ce35))
* **getMbrAngle:** fix angle sign ([6c33420](https://github.com/image-js/image-js/commit/6c3342045ae2c1bb43cbae6b661070860b41422e))
* **getMbrFromPoints:** angle was false ([1785453](https://github.com/image-js/image-js/commit/17854536387b051cb4c24b0b1cb09161ba1e0dcb))
* **getOrientedFastKeypoints:** bug with splice ([d90a4df](https://github.com/image-js/image-js/commit/d90a4dfb0811cf74188debf2e264ef541aa4e10f))
* **getOrientedFastKeypoints:** orientation was wrong ([bfade72](https://github.com/image-js/image-js/commit/bfade72c5e0b6a21ccd5c62edefd5221a83a1d62))
* **getOrientedFastKeypoints:** remove descriptorsPatchSize option ([caf14b1](https://github.com/image-js/image-js/commit/caf14b18c026727acefb41f8e72ff1e707e68c7b))
* **getOrientedFastKeypoints:** use circular window ([6851b6f](https://github.com/image-js/image-js/commit/6851b6fd0a63ebe55237ba41cb30972da48d8e78)), closes [#174](https://github.com/image-js/image-js/issues/174)
* **getPatchKeypoint:** don't use null as return type ([7847e14](https://github.com/image-js/image-js/commit/7847e14de74b9d88082f7cd607e8157fbcd3b58c))
* getPolygonArea returned negative values ([66b5327](https://github.com/image-js/image-js/commit/66b5327b24656dae2ff535bd423d7305614e7180))
* **getSourceImage:** bug with height and width ([35bd5e0](https://github.com/image-js/image-js/commit/35bd5e0a16b3e1ccf6515f94905e6c286f5a3361))
* handle 0 to 1 threshold ([#290](https://github.com/image-js/image-js/issues/290)) ([4b0464d](https://github.com/image-js/image-js/commit/4b0464d73d10774dad0266ba5abcfd39e67dbcf4))
* handle empty mask in MBR and Hull ([6462fb0](https://github.com/image-js/image-js/commit/6462fb0ce16260eec87f62a657e38b8258abc6be))
* **IJS:** enhance custom inspect ([bcb770f](https://github.com/image-js/image-js/commit/bcb770f1f50c58d71a8c3d872df975ab624c1a4d)), closes [#127](https://github.com/image-js/image-js/issues/127)
* import issue ([5cda6ae](https://github.com/image-js/image-js/commit/5cda6ae9f3f54d9770e41e5d7bed59e5761733c7))
* improve resize for bilinear and bicubic interpolations ([#458](https://github.com/image-js/image-js/issues/458)) ([625bc6e](https://github.com/image-js/image-js/commit/625bc6e5b123b7c8c37ffcf463f5bf7cbabdfe73))
* improve serialization of Mask ([d81f43f](https://github.com/image-js/image-js/commit/d81f43f2557120e8dc949c80de15170f74155373))
* isFastKeypoint uses predefined points ([30b3110](https://github.com/image-js/image-js/commit/30b3110f48d4c1de8d1188caa83f2b2ac8928027))
* **isFastKeypoint:** all compare values the same ([850404c](https://github.com/image-js/image-js/commit/850404cf86239eeb2b8b621a5f7be084ba42b535))
* keypoints and descriptors have same size ([94cb5c5](https://github.com/image-js/image-js/commit/94cb5c5b3cbca9cb36046b6d05e961fccb9327c3))
* make drawing api more consistent ([#736](https://github.com/image-js/image-js/issues/736)) ([add9e3d](https://github.com/image-js/image-js/commit/add9e3d57283af4443d7ab0118897c9c0823ed3c))
* make sure encoding options are passed to encode when no format is specified ([67d902d](https://github.com/image-js/image-js/commit/67d902d0fb0edfd41ac77bb4bbdd436249771cba))
* mbr works ([cf30ac6](https://github.com/image-js/image-js/commit/cf30ac60dba53b81fa5cccc2dc02cb0a72f9d5ff))
* **mean:** allow to compute mean on all values ([777f465](https://github.com/image-js/image-js/commit/777f465c08fed84be606ab33f1cc2f15a5e7a724))
* modify patch size in getBriefDescriptors ([75d7bb2](https://github.com/image-js/image-js/commit/75d7bb289739d59ad792607a645fb98365ec43f8))
* **Montage:** scale must be an integer ([78ecaa5](https://github.com/image-js/image-js/commit/78ecaa5848de1f40858cea617f98a35e3d8f37f4))
* **Montage:** use scale everywhere ([6ef6494](https://github.com/image-js/image-js/commit/6ef649458cc925e8d35794ef995b1ddea30da9bb)), closes [#203](https://github.com/image-js/image-js/issues/203)
* move important line to histogram ([1e2b09d](https://github.com/image-js/image-js/commit/1e2b09dc800f814dd99f0203ee5fcdd70a9c4141))
* optimise crosscheck using pointers ([6edcd9a](https://github.com/image-js/image-js/commit/6edcd9a282fe94ddabcee6b64211b46041b91ffb))
* optimise getIntensityMoment ([3b73730](https://github.com/image-js/image-js/commit/3b737306dfccc89c7965e96f826944a8179fcec7))
* orientation can be drawn but still buggy ([57b85bc](https://github.com/image-js/image-js/commit/57b85bc6acb88bf21bee9657b9a1fdcbc26d2b80)), closes [#217](https://github.com/image-js/image-js/issues/217)
* **orientedFastFeature:** distance to border ([57618f5](https://github.com/image-js/image-js/commit/57618f5ea905fc75c6ac95cdd5820d90e4a23309))
* **overlapImages:** colorModel issue ([d177c2f](https://github.com/image-js/image-js/commit/d177c2f58b78bfcbdf167b9b76e31a977dbd0fe2))
* **overlapImages:** remove useless lines ([a60be54](https://github.com/image-js/image-js/commit/a60be547026ec6edc14a242ae629c6d5bebe9904))
* remove getClampFromTo from inside map ([eebb85a](https://github.com/image-js/image-js/commit/eebb85a0a918e548310705fc06fb8de99293eb13))
* remove keypoints too close to border ([d0f1d6f](https://github.com/image-js/image-js/commit/d0f1d6f4ed9324c2031b36ac857a2e2f662aecb2))
* remove useless check ([6feb2c1](https://github.com/image-js/image-js/commit/6feb2c16aa039661002dd07e369024d3aa86064e))
* remove useless getOutputImage ([99513c6](https://github.com/image-js/image-js/commit/99513c6967aec38f6b0edaf3ab69ceb807b04a30))
* resize nearest ([#454](https://github.com/image-js/image-js/issues/454)) ([d80f4a7](https://github.com/image-js/image-js/commit/d80f4a78289903228f503dbd03c99f59474de009))
* Roi.solidity was not caching result ([#468](https://github.com/image-js/image-js/issues/468)) ([acd6fd2](https://github.com/image-js/image-js/commit/acd6fd2386875888c91e3a6fe12b496a6b95eab4))
* **Roi:** make map readonly ([49f0f23](https://github.com/image-js/image-js/commit/49f0f239693a644fa6c627e4e93f44300fe0c60e))
* scale threshold when slots number is changed ([#450](https://github.com/image-js/image-js/issues/450)) ([d280f46](https://github.com/image-js/image-js/commit/d280f46ab70ca1a227299a6fad4306699726cab2))
* **scaleKeypoints:** always return copy of array ([e8f0262](https://github.com/image-js/image-js/commit/e8f0262490e41efb21d66e71499dd18aaedbe4fd))
* **scaleKeypoints:** use loop instead of map ([d6d9b29](https://github.com/image-js/image-js/commit/d6d9b2973527ed5007b6e0c63f3aa09c1b351e3b))
* **scaleKeypoints:** use map instead of loop ([55cb7a4](https://github.com/image-js/image-js/commit/55cb7a41da4580effc53e84d911d0c6f9869c3bf))
* showOrientation works ([7e5ac01](https://github.com/image-js/image-js/commit/7e5ac014470a8596b4c6528289402d0b4b374eee)), closes [#217](https://github.com/image-js/image-js/issues/217)
* update error checks for blur and median filters ([#735](https://github.com/image-js/image-js/issues/735)) ([1799f97](https://github.com/image-js/image-js/commit/1799f97eb6d6d79f22832e0936a4638c464d26d8))
* update featureMatching index ([05aa75a](https://github.com/image-js/image-js/commit/05aa75a2acb3ee9083f2d98b29d58016804beb5a))
* use getBrief in fm test ([9855c94](https://github.com/image-js/image-js/commit/9855c94fce6b6c116324edfbf67943bc9490863d))
* use origin option in draw functions ([0c59dea](https://github.com/image-js/image-js/commit/0c59deab25c7d1c6762b9a563cfb1ed3f093982c))
* use origin option in extract ([05cc5c7](https://github.com/image-js/image-js/commit/05cc5c70b3df15efea4d1dcf28df07430bfcf0aa))
* use ransac in getDestinationOrigin ([eaf77ea](https://github.com/image-js/image-js/commit/eaf77ea05a58f6b97e35330758bcac69bfd0246f))


### Performance Improvements

* optimize bilinear ([#296](https://github.com/image-js/image-js/issues/296)) ([3d1a191](https://github.com/image-js/image-js/commit/3d1a191ace28928c057bf19a8ff27aeee2f2080d))


### Miscellaneous Chores

* change ROI borders API to return array of Border object ([#276](https://github.com/image-js/image-js/issues/276)) ([09932c7](https://github.com/image-js/image-js/commit/09932c75ed87b4fe555029e871c56f69a5754541))
* prepare workflows for stable release ([6fe966c](https://github.com/image-js/image-js/commit/6fe966cb7dc88ad4e69ade2591f5c56bbc2e12c0))
* remove getmap method in roi  ([#347](https://github.com/image-js/image-js/issues/347)) ([06d0e3a](https://github.com/image-js/image-js/commit/06d0e3a15a71c813380ed6d5e74950c6b5d788e6))


### Code Refactoring

* group optional arguments in computeThreshold ([f597aea](https://github.com/image-js/image-js/commit/f597aeac6c5bb48127e92f9dacc46be70b81dec8))

## [0.37.0](https://www.github.com/image-js/image-js/compare/v0.36.1...v0.37.0) (2025-04-15)


### Features

* add filledSurface on ROI ([019c71a](https://www.github.com/image-js/image-js/commit/019c71ab2b64217564b3eae8fd731b80c743ff3c))
* ROI.toJSON expose hullSurface and hullPerimeter ([85471eb](https://www.github.com/image-js/image-js/commit/85471eb1318846a22563346680de9886e1c42bfc))

### [0.36.1](https://www.github.com/image-js/image-js/compare/v0.36.0...v0.36.1) (2025-04-09)


### Bug Fixes

* add types and documentation for cannyEdge parameters ([f73f9b4](https://www.github.com/image-js/image-js/commit/f73f9b4864029eae39f8dd3412d3991b84798fab))

## [0.36.0](https://www.github.com/image-js/image-js/compare/v0.35.6...v0.36.0) (2024-12-26)


### Features

* extract text field from png as meta information ([180ccd4](https://www.github.com/image-js/image-js/commit/180ccd40a833bc9279a29ba83d16a83e9e724427))

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
