import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { check, Match, Maybe } from 'meteor/check'; // eslint-disable-line no-unused-vars
// Maybe is used but in a form eslint doesn't recognise
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
	'game.randomMove': function RandomMove(params) {

		check(params, {
			'generatorSquares': [[Object]],
			'number': Match.Maybe(Number), // eslint-disable-line new-cap
			'mapRows': Number,
			'mapColumns': Number,
			'patternRows': Number,
			'patternColumns': Number,
		});

		// let data = params.generatorSquares;

		const row = Math.floor(Random.fraction() * params.mapRows);
		console.log(`random row ${row}`);
		const column = Math.floor(Random.fraction() * params.mapColumns);
		console.log(`random column ${column}`);

		// return params.generatorSquares;

		return Meteor.call('game.mapSquareClicked', {
			'mapSquares': params.generatorSquares,
			'row': row,
			'column': column,
			'mapRows': params.mapRows,
			'mapColumns': params.mapColumns,
			'generatorSquares': params.generatorSquares,
		});
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
			'generatorSquares': params.generatorSquares,
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

		let mapSquares = params.generatorSquares;

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
});

rateLimit({
	'methods': [
		'game.generateBoard',
	],
	'limit': 5,
	'timeRange': 1000,
});
