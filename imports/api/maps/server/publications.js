/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { Maps } from '../maps.js';

Meteor.publish('maps', function mapPublication() {
	if (this.userId) return Maps.find({ 'createdBy': this.userId });
	return this.ready();
});
