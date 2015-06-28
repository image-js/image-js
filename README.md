# image-js

Image manipulation in JavaScript

## Installation

`npm install ij`

## License

  [MIT](./LICENSE)

## Developement

* You will have first to install nodejs : https://nodejs.org/
* In order to be able to connect to github easily it is interesting to add your public SSH key in the preferences of your github account. Detailed procedure is available at https://help.github.com/articles/generating-ssh-keys/.
* After you may clone and install the project from a console:

```
mkdir image-js
cd image-js
git clone git@github.com:image-js/ij.git
cd ij
npm install
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


Notes:
* npm install may require the compilation of some code. It is therefore necessary to have the compiler. On OsX you will have to instlal xcode and start it once to accept the licence.
* in order to test you need to install the npm 'canvas'. On OsX the procedure is https://github.com/Automattic/node-canvas/wiki/installation---osx

