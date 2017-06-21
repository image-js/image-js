// This file contains imports that have a circular dependency with the StackClass
import extend from './extend';

import Stack from './StackClass';
export default Stack;

extend(Stack);
