import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { check, Match, Maybe } from 'meteor/check'; // eslint-disable-line no-unused-vars
// Maybe is used but in a form eslint doesn't recognise
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
	'game.randomMove': function RandomMove(params) {
		console.log(`${JSON.stringify(params)}`);
		check(params, {
			'generatorSquares': [[Object]],
			'number': Match.Maybe(Number), // eslint-disable-line new-cap
		});

		return params.generatorSquares;
	},
});

rateLimit({
	'methods': [
		'game.generateBoard',
	],
	'limit': 5,
	'timeRange': 1000,
});
