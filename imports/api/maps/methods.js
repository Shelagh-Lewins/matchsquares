import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { check, Match, Maybe } from 'meteor/check'; // eslint-disable-line no-unused-vars
// Maybe is used but in a form eslint doesn't recognise
import rateLimit from '../../modules/rate-limit';

import { Maps } from './maps.js';

Meteor.methods({
	'maps.new': function NewMap(map) {
		check(map, {
			'name': String,
		});

		if (!this.userId) {
			throw new Meteor.Error('not-authorized', 'You must be signed in to create a new map');
		}

		// build mapsquares
		const colors = Meteor.settings.public.mapSquareShapes.map((object) => object.color);

		const rows = Meteor.settings.public.defaultMapRows;
		const columns = Meteor.settings.public.defaultMapColumns;

		let data = {};

		for (let i = 1; i <= rows; i++) {
			data[i] = {};

			for (let j = 1; j <= columns; j++) {
				data[i][j] = {
					'color': Random.choice(colors),
				};
			}
		}

		let mapId = Maps.insert({
			'name': map.name,
			'createdBy': this.userId,
			'mapSquares': data,
		});

		return mapId;
	},
	'maps.remove': function DeleteMap(mapId) {
		check(mapId, String);

		if (!this.userId) {
			throw new Meteor.Error('not-authorized', 'You must be signed in to delete a map');
		}

		const ownerId = Maps.findOne({ '_id': mapId }, {'fields': {'createdBy': 1}}).createdBy;

		if (this.userId !== ownerId) {
			throw new Meteor.Error('not-authorized', 'You can only delete maps that you created');
		}

		Maps.remove(mapId);
		return;
	},
	'maps.setMapSquareColor': function SetMapSquareColor(params) {
		// method accepts either a single square defined by row, column
		// or an array of objects like [{'row': row, 'column': column, 'color': color})
		// array of objects will be used preferentially
		// 'color' is optional. If not, choose the next up in the sequence
		check(params, {
			'mapId': String,
			'row': Match.Maybe(Number), // eslint-disable-line new-cap
			'column': Match.Maybe(Number), // eslint-disable-line new-cap
			'color': Match.Maybe(Number), // eslint-disable-line new-cap
			'squares': Match.Maybe([Object]), // eslint-disable-line new-cap
		});

		if (!this.userId) {
			throw new Meteor.Error('not-authorized', 'You must be signed in to edit a map');
		}

		const ownerId = Maps.findOne({ '_id': params.mapId }, {'fields': {'createdBy': 1}}).createdBy;

		if (this.userId !== ownerId) {
			throw new Meteor.Error('not-authorized', 'You can only edit maps that you created');
		}

		let squares = [];

		if (typeof params.squares !== 'object') {
			if (typeof params.row !== 'number' || typeof params.column !== 'number') {
				throw new Meteor.Error('invalid-params', 'Params must include either an array of squares or the row and column for a single square');
			} else { // convert single object to expected array
				squares = [{
					'row': params.row,
					'column': params.column,
				}];
			}
		} else {
			squares = params.squares;
		}

		squares.map((square) => {
			// object format is required to update nested object
			let update = {};
			let newColor = square.color;
			if (typeof newColor === 'undefined') {
				// if no color specified, choose the next color along
				const colors = Meteor.settings.public.mapSquareShapes.map((object) => object.color);
				const currentColor = Maps.findOne({ '_id': params.mapId },
					{'fields': {'mapSquares': 1}}).mapSquares[square.row][square.column].color;
				const colorIndex = (colors.indexOf(currentColor) + 1) % colors.length;
				newColor = colors[colorIndex];
			}

			update['mapSquares.' + square.row + '.' + square.column + '.color'] = newColor;

			Maps.update(
				{ '_id': params.mapId },
				{ '$set': update}
			);
		});
	},
	// example: how to delay a return
	/* 'asyncTest': function(val) {
		var timeNow = new Date();
		while (new Date().getSeconds() < timeNow.getSeconds() + 2) {
		}
		return val;
	}, */
});

rateLimit({
	'methods': [
		'maps.new',
		'maps.remove',
	],
	'limit': 5,
	'timeRange': 1000,
});

