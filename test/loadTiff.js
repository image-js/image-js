'use strict';

var fs = require('fs');

import IJS from '../src';
import { readFileSync } from 'fs';
import { join } from 'path';

const filename = 'Downloads/test.tif';

let image = IJS.load(join(__dirname, '../../../../', filename));
