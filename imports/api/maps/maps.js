import { Mongo } from 'meteor/mongo';
// Note: Simple Schema doesn't support arrays of arrays and does not appear to be maintained.

const Maps = new Mongo.Collection('Maps');

export { Maps };
