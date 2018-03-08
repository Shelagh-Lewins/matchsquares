/* eslint-env mocha */

// run tests from console with:
// TEST_WATCH=1 meteor test --driver-package practicalmeteor:mocha


import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';

// collection
import { Maps } from './maps.js';

// methods
import './methods.js';
