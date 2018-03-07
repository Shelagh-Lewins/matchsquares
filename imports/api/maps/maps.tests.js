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

if (Meteor.isServer) {
	describe('Maps', () => {
		describe('methods', () => {
			const userId = Random.id();

			// start each test with an empty collection
			beforeEach(() => {
				Maps.remove({});
			});

			// ///////////////////////////////////
			// maps.new
			it('can create new map if logged in', () => {
				// Find the internal implementation of the method so we can
				// test it in isolation
				const newMap = Meteor.server.method_handlers['maps.new'];

				// Set up a fake method invocation that looks like what the method expects
				const invocation = { userId };

				// Run the method with `this` set to the fake invocation
				const mapId = newMap.apply(invocation, [{'name': 'newmap'}]);

				// Verify that the mapId has been created
				assert.typeOf(mapId, 'string');

				// Verify that there is a new map. This is redundant but an example of careful checking.
				assert.equal(Maps.find().count(), 1);
			});

			it('cannot create new map if not logged in', () => {
				// Find the internal implementation of the method so we can
				// test it in isolation
				const newMap = Meteor.server.method_handlers['maps.new'];

				// Set up a fake method invocation that looks like what the method expects
				const invocation = { }; // no userId, user is not logged in

				assert.throws(() => {
					newMap.apply(invocation, [{'name': 'newmap'}]);
				}, Meteor.Error, /not-authorized/);
			});

			// ///////////////////////////////////
			// maps.remove
			it('can remove owned map', () => {
				// make a map to be removed
				const mapId = Maps.insert({
					'name': 'test map',
					'createdBy': userId,
					'mapSquares': [],
				});

				// Find the internal implementation of the method so we can
				// test it in isolation
				const deleteMap = Meteor.server.method_handlers['maps.remove'];

				// Set up a fake method invocation that looks like what the method expects
				const invocation = { userId };

				// Verify that the map was successfully created before we try to remove it
				assert.typeOf(mapId, 'string');

				// Run the method with `this` set to the fake invocation
				// deleteMap.apply(invocation, [mapId]);
				deleteMap.apply(invocation, [mapId]);

				// Verify that the map has been removed
				assert.equal(Maps.find().count(), 0);
			});

			it('cannot remove map if not logged in', () => {
				// make a map to be removed
				const mapId = Maps.insert({
					'name': 'test map',
					'createdBy': userId,
					'mapSquares': [],
				});

				// Find the internal implementation of the method so we can
				// test it in isolation
				const deleteMap = Meteor.server.method_handlers['maps.remove'];

				// Set up a fake method invocation that looks like what the method expects
				const invocation = { }; // no userId, user is not logged in

				// Verify that the map was successfully created before we try to remove it
				assert.typeOf(mapId, 'string');

				assert.throws(() => {
					deleteMap.apply(invocation, [mapId]);
				}, Meteor.Error, /not-authorized/);
			});

			it('cannot remove map owned by another user', () => {
				// make a map to be removed
				const mapId = Maps.insert({
					'name': 'test map',
					'createdBy': userId,
					'mapSquares': [],
				});

				// Find the internal implementation of the method so we can
				// test it in isolation
				const deleteMap = Meteor.server.method_handlers['maps.remove'];

				// Set up a fake method invocation that looks like what the method expects
				const otherUserId = userId + 's'; // a different userId
				const invocation = { otherUserId };

				// Verify that the map was successfully created before we try to remove it
				assert.typeOf(mapId, 'string');

				assert.throws(() => {
					deleteMap.apply(invocation, [mapId]);
				}, Meteor.Error, /not-authorized/);
			});

			// ///////////////////////////////////
			// maps.setMapSquareColor
			it('can change a mapsquare color', () => {
				// Set up a fake method invocation that looks like what the method expects
				const invocation = { userId };

				// make a map to be edited. Use maps.new so it has proper mapSquares
				const newMap = Meteor.server.method_handlers['maps.new'];
				const mapId = newMap.apply(invocation, [{'name': 'newmap'}]);

				// Find the internal implementation of the method so we can
				// test it in isolation
				const setMapSquareColor = Meteor.server.method_handlers['maps.setMapSquareColor'];

				// Verify that the map was successfully created before we try to remove it
				assert.typeOf(mapId, 'string');

				const currentColor = Maps.findOne({ '_id': mapId }, {'fields': {'mapSquares': 1}}).mapSquares[1][1].color;

				// Verify that the mapsquare's color is a string
				assert.typeOf(currentColor, 'string');

				// Run the method with `this` set to the fake invocation
				const params = {
					'mapId': mapId,
					'row': 1,
					'column': 1,
				};
				setMapSquareColor.apply(invocation, [params]);

				const newColor = Maps.findOne({ '_id': mapId }, {'fields': {'mapSquares': 1}}).mapSquares[1][1].color;

				// Verify that the mapsquare's new color is a string
				assert.typeOf(newColor, 'string');

				// Verify that the mapsquare's color has changed
				assert.notEqual(newColor, currentColor);
			});

			it('cannot change a mapsquare color if not logged in', () => {
				// make a map to be removed
				const mapId = Maps.insert({
					'name': 'test map',
					'createdBy': userId,
					'mapSquares': [],
				});

				// Verify that the map was successfully created before we try to edit it
				assert.typeOf(mapId, 'string');

				// Find the internal implementation of the method so we can
				// test it in isolation
				const setMapSquareColor = Meteor.server.method_handlers['maps.setMapSquareColor'];

				// Run the method with `this` set to the fake invocation
				const params = {
					'mapId': mapId,
					'row': 1,
					'column': 1,
				};

				assert.throws(() => {
					setMapSquareColor.apply({}, [params]); // no userId, user is not logged
				}, Meteor.Error, /not-authorized/);
			});

			it('cannot change a mapsquare color if owned by another user', () => {
				// make a map to be removed
				const mapId = Maps.insert({
					'name': 'test map',
					'createdBy': userId,
					'mapSquares': [],
				});

				// Verify that the map was successfully created before we try to edit it
				assert.typeOf(mapId, 'string');

				// Find the internal implementation of the method so we can
				// test it in isolation
				const setMapSquareColor = Meteor.server.method_handlers['maps.setMapSquareColor'];

				// Set up a fake method invocation that looks like what the method expects
				const otherUserId = userId + 's'; // a different userId
				const invocation = { otherUserId };

				// Run the method with `this` set to the fake invocation
				const params = {
					'mapId': mapId,
					'row': 1,
					'column': 1,
				};

				assert.throws(() => {
					setMapSquareColor.apply(invocation, [params]); // no userId, user is not logged
				}, Meteor.Error, /not-authorized/);
			});
		});
	});
}
