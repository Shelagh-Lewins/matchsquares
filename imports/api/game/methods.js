import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { check, Match, Maybe } from 'meteor/check'; // eslint-disable-line no-unused-vars
// Maybe is used but in a form eslint doesn't recognise
import rateLimit from '../../modules/rate-limit';
import baseConvert from '../../modules/base-convert';

Meteor.methods({
	'game.generatePattern': function RandomMove(params) {
		check(params, {
			'mapRows': Number,
			'mapColumns': Number,
			'patternRows': Number,
			'patternColumns': Number,
			'patternType': String,
			'id': String,
		});

		let invalidId = false;
		if (params.patternType === 'id') {
			if (params.id === '' || params.id === 'NaN') {
				invalidId = true;
			}
		}

		if (invalidId) {
			throw new Meteor.Error('generate-pattern-failed', 'no id provided');
		}


		// TODO don't try to generate id pattern if id is empty string
		let pattern = [];
		let id = '';
		const colors = Meteor.settings.public.mapSquareShapes.map((object) => object.color);

		if (params.patternType === 'random') {
			// choose pattern square colours at random
			for (let i = 0; i < params.patternRows; i++) {
				pattern[i] = [];

				for (let j = 0; j < params.patternColumns; j++) {
					pattern[i][j] = {
						'color': Random.choice(colors),
						'row': i,
						'column': j,
					};
				}
			}
			id = Meteor.call('game.findPatternId', pattern);
		} else if (params.patternType === 'generated') {
			// start with a solid ground the size of the map
			const colorNumber = Math.floor(Random.fraction() * colors.length);

			for (let i = 0; i < params.patternRows; i++) {
				let row = [];

				for (let j = 0; j < params.patternColumns; j++) {
					let square = {
						'color': colors[colorNumber],
						'row': i,
						'column': j,
					};

					row.push(square);
				}

				pattern.push(row);
			}

			// make random moves from the base map. This ensures the pattern can be solved.
			const generatorSteps = Meteor.settings.private.generatorSteps[params.patternColumns];

			for (let i = 0; i < generatorSteps; i++ ) {
				const row = Math.floor(Random.fraction() * params.patternRows);
				const column = Math.floor(Random.fraction() * params.patternColumns);

				pattern = Meteor.call('game.mapSquareClicked', {
					'mapSquares': pattern,
					'row': row,
					'column': column,
					'mapRows': params.patternRows,
					'mapColumns': params.patternColumns,
				});
			}
			id = Meteor.call('game.findPatternId', pattern);
		} else if (params.patternType === 'id') {
			// create the pattern from the id
			// convert the id back to a base 4 string
			const tempId = baseConvert(params.id, 36, 4).split('');

			// add leading 0s if necessary to make enough digits
			const numSquares = params.patternRows * params.patternColumns;

			for (let i = tempId.length; i < numSquares; i++ ) {
				tempId.unshift(0);
			}

			for (let i = 0; i < params.patternRows; i++) {
				let row = [];

				for (let j = 0; j < params.patternColumns; j++) {
					let square = {
						'color': colors[tempId.shift()],
						'row': i,
						'column': j,
					};

					if (typeof square.color === 'undefined') {
						throw new Meteor.Error('generate-pattern-failed', 'id did not have enough digits');
					}

					row.push(square);
				}

				pattern.push(row);
			}

			id = params.id;
		}

		return { pattern, id };
	},
	'game.mapSquareClicked': function MapSquareClicked(params) {
		// check adjacent squares

		const mapSquares = params.mapSquares;
		const row = params.row;
		const column = params.column;
		const mapRows = params.mapRows;
		const mapColumns = params.mapColumns;

		const clickedColor = mapSquares[row][column].color;

		const affectedSquares = [
			{
				'row': row,
				'column': column,
			},
		];

		// top
		if (row > 0) {
			if (mapSquares[row - 1][column].color === clickedColor) {
				affectedSquares.push({
					'row': row - 1,
					'column': column,
				});
			}
		}

		// right
		if (column < mapColumns - 1) {
			if (mapSquares[row][column + 1].color === clickedColor) {
				affectedSquares.push({
					'row': row,
					'column': column + 1,
				});
			}
		}

		// bottom
		if (row < mapRows - 1) {
			if (mapSquares[row + 1][column].color === clickedColor) {
				affectedSquares.push({
					'row': row + 1,
					'column': column,
				});
			}
		}

		// left
		if (column > 0) {
			if (mapSquares[row][column - 1].color === clickedColor) {
				affectedSquares.push({
					'row': row,
					'column': column - 1,
				});
			}
		}

		return Meteor.call('game.setMapSquareColor', {
			'squares': affectedSquares,
			'mapSquares': params.mapSquares,
		});
	},
	'game.setMapSquareColor': function SetMapSquareColor(params) {
		let squares = [];

		if (typeof params.squares !== 'object') {
			if (typeof params.row !== 'number' || typeof params.column !== 'number') {
				return; // no valid squares data
			}
			squares = [{ // convert single object to expected array
				'row': params.row,
				'column': params.column,
			}];
		} else {
			squares = params.squares;
		}

		let mapSquares = params.mapSquares;

		squares.map((square) => {
			let newColor = square.color;
			if (typeof newColor === 'undefined') {
				// if no color specified, choose the next color along
				const colors = Meteor.settings.public.mapSquareShapes.map((object) => object.color);
				const currentColor = mapSquares[square.row][square.column].color;
				const colorIndex = (colors.indexOf(currentColor) + 1) % colors.length;
				newColor = colors[colorIndex];
			}
			mapSquares[square.row][square.column].color = newColor;
		});

		return mapSquares; // eslint-disable-line consistent-return
	},
	'game.findPatternId': function FindPatternId(pattern) {
		// encode the pattern color data as a base 36 number
		// 0-9 + lower case alphabet
		// represented by a string

		// first create a base 4 representation (4 colours)
		const colors = Meteor.settings.public.mapSquareShapes.map((object) => object.color);
		let id = '';

		pattern.map((patternRow) => {
			patternRow.map((patternCell) => {
				id += colors.indexOf(patternCell.color);
			});
		});

		// now convert to a base 36 number
		id = baseConvert(id, 4, 36);

		// add leading 0s if necessary to make enough digits
		for (let i = id.length; i < Meteor.settings.public.idLengths[pattern[0].length]; i++ ) {
			id = '0' + id;
		}

		return id;
	},
});

rateLimit({
	'methods': [
		'game.generateBoard',
	],
	'limit': 2,
	'timeRange': 1000,
});

rateLimit({
	'methods': [
		'game.mapSquareClicked',
		'game.setMapSquareColor',
	],
	'limit': 50,
	'timeRange': 1000,
});
