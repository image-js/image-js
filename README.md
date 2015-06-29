# image-js

Image manipulation in JavaScript

## Installation

`npm install ij`

## License

  [MIT](./LICENSE)

## Developement

* You will have first to install nodejs : https://nodejs.org/
* For the developement we are using https://www.jetbrains.com/webstorm/
* In order to be able to connect to github easily it is interesting to add your public SSH key in the preferences of your github account. Detailed procedure is available at https://help.github.com/articles/generating-ssh-keys/.
* After you may clone and install the project from a console:

```
mkdir image-js
cd image-js
git clone git@github.com:image-js/ij.git
cd ij
npm install
```


Notes:
* npm install may require the compilation of some code.
  It is therefore necessary to have the compiler.
  On OsX you will have to instlal xcode and start it once to accept the licence.
* in order to test you need to install the npm 'canvas'.
  On OsX you should first install brew (http://brew.sh/) and then
````
brew update
brew install cairo
brew install giflib
brew install libjpeg
brew install pkg-config
brew link pixman
brew link cairo
## and then from the image-js/ij folder
npm install canvas
```


### Other projects installation

For each other project you should do:

````
cd image-js
git clone git@github.com:image-js/filter-invert.git
cd filter-invert
npm install
npm run test
```


