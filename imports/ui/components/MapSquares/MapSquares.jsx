import React, { Component } from 'react';
import './MapSquares.scss';
import { Random } from 'meteor/random';
import { Meteor } from 'meteor/meteor';

import promisedCall from '../../../api/client/promised-call.js';

// notifications
import toastr from 'toastr';
import 'toastr/build/toastr.css';

function PatternSquare(props) {
	return (
		<li className={`pattern-square ${props.color} ${props.match}`}><span key={props.index}><svg viewBox="0 0 100 100">
			<polygon points={props.points} /></svg></span></li>
	);
}

function MapSquare(props) {
	function handleClick(event) {
		event.preventDefault();

		props.mapSquareClicked(event, props.row, props.column);
	}

	return (
		<li className={`map-square ${props.color} ${props.sliding} ${props.match}`} style={{
			'top': props.slideDistance * -1,
			'paddingLeft': Meteor.settings.public.mapSquareHMargin,
			'paddingRight': Meteor.settings.public.mapSquareHMargin,
			'paddingTop': Meteor.settings.public.mapSquareVMargin,
			'paddingBottom': Meteor.settings.public.mapSquareVMargin,
		}} onClick={handleClick}>
			<span key={props.index} style={{
				'top': props.slideDistance,
				'height': Meteor.settings.public.mapSquareHeight,
				'width': Meteor.settings.public.mapSquareHeight,
				'transition': props.slideTransition,
			}}>
				<svg viewBox="0 0 100 100">
					<polygon points={props.points} />
				</svg>
			</span>
		</li>
	);
}

class MapSquares extends Component {
	constructor(props) {
		super(props);

		const mapSize = Meteor.settings.public.mapSizes.find((obj) =>
			obj.url === this.props.url
		);

		this.state = {
			'mapSquares': [[]],
			'pattern': [[]],
			'checkMatch': false,
			'match': {},
			'acceptInput': false,
			'slidingSquares': [],
			'slideDistance': 0,
			'slideTransition': '',
			'mapRows': mapSize.mapRows,
			'mapColumns': mapSize.mapColumns,
			'patternRows': mapSize.patternRows,
			'patternColumns': mapSize.patternColumns,
			'clicks': 0,
			'solved': 0,
			'clickHistory': [],
		};
	}

	componentWillMount() {
		// do some stuff before component mounts
		this.generateMap();
		this.generatePattern();
	}

	componentDidMount() {
		// do some stuff after component mounts
	}

	generatePattern() {
		promisedCall('game.generatePattern', {
			'mapRows': this.state.mapRows,
			'mapColumns': this.state.mapColumns,
			'patternRows': this.state.patternRows,
			'patternColumns': this.state.patternColumns,
		}).then((data) => {
			this.setState( {
				'pattern': data,
				'match': {},
				'checkMatch': true,
				'acceptInput': true,
				'clicks': 0,
			} );
		},
		(err) => {
			toastr.error(`Error performing generating pattern: ${err}`);
		}
		);
	}

	generateMap() {
		const colors = Meteor.settings.public.mapSquareShapes.map((object) => object.color);

		let data = [];

		for (let i = 0; i < this.state.mapRows; i++) {
			data[i] = [];

			for (let j = 0; j < this.state.mapColumns; j++) {
				data[i][j] = {
					'color': Random.choice(colors),
				};
			}
		}

		this.setState({
			'mapSquares': data,
		});
	}

	findMatch() {
		if (!this.state.checkMatch) return;

		const mapSquares = this.state.mapSquares;
		const pattern = this.state.pattern;

		// find size of pattern
		const numPatternRows = Object.keys(pattern).length;
		const numPatternColumns = Object.keys(pattern[1]).length;

		// find size of map
		const numMapRows = this.state.mapRows;
		const numMapColumns = this.state.mapColumns;

		let match = {};
		let test = true;

		// mapsSquares is nested arrays
		for (let i = 0; i <= numMapRows - numPatternRows; i++) {
			for (let j = 0; j <= numMapColumns - numPatternColumns; j++) {
				test = true;
				// pattern is nested arrays
				for (let k = 0; k < numPatternRows; k++) {
					for (let l = 0; l < numPatternColumns; l++) {
						const patternSquare = pattern[k][l];
						const mapSquare = mapSquares[i + k][j + l];

						if (patternSquare.color !== mapSquare.color) {
							test = false;
							break;
						}
					}
				}
				if (test) {
					match.row = i;
					match.column = j;
					break;
				}
			}
			if (test) break;
		}

		if (this.state.match.row !== match.row && this.state.match.column !== match.column) {
			const clickHistory = this.state.clickHistory;

			if (clickHistory.length > Meteor.settings.public.clickHistoryLength) {
				clickHistory.shift(); // track the last 10 patterns
			}
			clickHistory.push(this.state.clicks);

			this.setState( {
				'checkMatch': false,
				'match': match,
				'acceptInput': false,
				'clicks': 0,
				'solved': this.state.solved + 1,
				'clickHistory': clickHistory,
			});

			setTimeout(() => {
				this.removeMatchSquares();
				setTimeout(() => {
					this.generatePattern();
				}, Meteor.settings.public.slideSquaresTime);
			}, Meteor.settings.public.showMatchTime + Meteor.settings.public.slideSquaresTime);
		}
	}

	removeMatchSquares() {
		if (typeof this.state.match.row !== 'undefined') {
			const startRow = this.state.match.row + this.state.patternRows - 1;
			const endRow = 0;

			const startColumn = this.state.match.column;
			const endColumn = startColumn + this.state.patternColumns - 1;

			// change the matched squares
			const matchedSquares = [];
			const colors = Meteor.settings.public.mapSquareShapes.map((object) => object.color);

			for (let i = startColumn; i <= endColumn; i++) {
				for (let j = startRow; j >= endRow; j--) {
					const square = {
						'row': j,
						'column': i,
					};
					if (j >= this.state.patternRows) {
						square.color = this.state.mapSquares[j - this.state.patternRows][i].color;
					} else {
						square.color = Random.choice(colors);
					}
					matchedSquares.push(square);
				}
			}

			this.setMapSquareColor({'squares': matchedSquares});

			// now slide the changed squares down
			const slidingSquares = [];

			for (let i = startColumn; i <= endColumn; i++) {
				for (let j = startRow; j >= endRow; j--) {
					const square = {
						'row': j,
						'column': i,
					};
					slidingSquares.push(square);
				}
			}

			this.setState({'slidingSquares': slidingSquares});

			const slideDistance = (Meteor.settings.public.mapSquareHeight + 2 * Meteor.settings.public.mapSquareVMargin)
				* this.state.patternRows;
			this.setState({'slideDistance': slideDistance});

			const that = this;
			setTimeout(() => { that.setState({ 'slidingSquares': [] });}, Meteor.settings.public.slideSquaresTime);
		}
	}

	mapSquareClicked(event, row, column) {
		event.preventDefault();

		if (!this.state.acceptInput) return;

		// check adjacent squares
		const mapSquares = this.state.mapSquares;
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
		if (column < this.state.mapColumns - 1) {
			if (mapSquares[row][column + 1].color === clickedColor) {
				affectedSquares.push({
					'row': row,
					'column': column + 1,
				});
			}
		}

		// bottom
		if (row < this.state.mapRows - 1) {
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

		this.setState({
			'clicks': this.state.clicks + 1,
		});
		this.setMapSquareColor({'squares': affectedSquares});
		this.findMatch();
	}

	setMapSquareColor(params) {
		// accepts either a single square defined by row, column
		// or an array of objects like [{'row': row, 'column': column, 'color': color})
		// array of objects will be used preferentially
		// 'color' is optional. If not, choose the next up in the sequence

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

		let mapSquares = this.state.mapSquares;

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

		this.setState({'mapSquares': mapSquares});
	}

	calculateAverage(clickHistory) {
		if (clickHistory.length < 1) return '-';
		const averageClicks = clickHistory.reduce((a, b) =>a + b) / clickHistory.length;

		return Math.round(averageClicks * 100) / 100;
	}

	renderPatternRow(patternrow, index) {
		return (
			<ul className='patternrow' key={`patternrow ${index}`}>
				{
					patternrow.map( (patternsquare) => {
						const shape = Meteor.settings.public.mapSquareShapes.find((obj) => obj.color === patternsquare.color );

						let match = '';
						if (typeof this.state.match.row !== 'undefined') {
							match = 'match';
						}

						return (
							<PatternSquare
								key={`patternsquare_${patternsquare.row}_${patternsquare.column}`}
								index={`patternsquare_${patternsquare.row}_${patternsquare.column}`}
								row={patternsquare.row}
								column={patternsquare.column}
								color={patternsquare.color}
								match={match}
								points={shape.points}
								findMatch={this.findMatch.bind(this)}
							/>);
					})
				}
			</ul>
		);
	}

	renderMapRow(maprow, index) {
		return (
			<ul className='maprow' key={`maprow ${index}`}>
				{
					maprow.map( (mapSquare) => {
						const shape = Meteor.settings.public.mapSquareShapes.find((obj) => obj.color === mapSquare.color );

						return (
							<MapSquare
								key={`mapSquare_${mapSquare.row}_${mapSquare.column}`}
								index={`mapSquare_${mapSquare.row}_${mapSquare.column}`}
								row={mapSquare.row}
								column={mapSquare.column}
								color={mapSquare.color}
								match={mapSquare.match}
								sliding={mapSquare.sliding}
								slideDistance={mapSquare.slideDistance}
								slideTransition={mapSquare.slideTransition}
								points={shape.points}
								mapSquareClicked={this.mapSquareClicked.bind(this)}
							/>);
					})
				}
			</ul>
		);
	}

	renderPattern(pattern) {
		return (
			<div className="pattern-holder">
				<ul className='pattern'>
					{pattern.map( (patternrow, index) => this.renderPatternRow(patternrow, index))}
				</ul>
			</div>
		);
	}

	renderMap(mapSquares) {
		return (
			<div className="map-holder">
				<ul className='game-map'>
					{mapSquares.map( (maprow, index) => this.renderMapRow(maprow, index))}
				</ul>
			</div>
		);
	}

	renderGameStatus(params) {
		return (
			<div className='game-status'>
				<div className='centerer'>
					<span className='clicks'>
						Solved: {params.solved}
					</span>
					<span className='clicks'>
						Clicks: {params.clicks}
					</span>
					<span className='clicks'>
						Average clicks: {params.averageClicks}
					</span>
				</div>
			</div>
		);
	}

	render() {
		if (this.props.loading) return <div></div>;

		// convert nested objects to nested arrays
		let mapSquaresArray = [];

		const numberOfRows = this.state.mapRows;
		const numberOfColumns = this.state.mapColumns;

		// highlight matching squares
		let startRow = null;
		let endRow = null;
		let startColumn = null;
		let endColumn = null;

		if (typeof this.state.match.row !== 'undefined') {
			startRow = this.state.match.row;
			endRow = startRow + this.state.patternRows - 1;

			startColumn = this.state.match.column;
			endColumn = startColumn + this.state.patternColumns - 1;
		}

		for (let i = 0; i < numberOfRows; i++) {
			let row = [];

			for (let j = 0; j < numberOfColumns; j++) {
				// is this square in a match?
				let match = '';
				if (typeof this.state.match.row !== 'undefined') {
					if (startRow <= i && i <= endRow && startColumn <= j && j <= endColumn) {
						match = 'match';
					}
				}

				// is this square sliding?
				let sliding = '';
				let slideDistance = 0;
				let slideTransition = '';

				if (this.state.slidingSquares) {
					if (this.state.slidingSquares.findIndex((element) => {return element.row === i && element.column === j;}) !== -1) {
						sliding = 'sliding';
						slideDistance = this.state.slideDistance;
						slideTransition = Meteor.settings.public.slideSquaresTransition;
					}
				}

				let square = {
					'color': this.state.mapSquares[i][j].color,
					'row': i,
					'column': j,
					'match': match,
					'sliding': sliding,
					'slideDistance': slideDistance,
					'slideTransition': slideTransition,
				};
				row.push(square);
			}
			mapSquaresArray.push(row);
		}

		const mapSquares = this.renderMap(mapSquaresArray);
		const pattern = this.renderPattern(this.state.pattern);
		const gameStatus = this.renderGameStatus({
			'clicks': this.state.clicks,
			'solved': this.state.solved,
			'averageClicks': this.calculateAverage(this.state.clickHistory),
		});

		return (
			<div>
				{gameStatus}
				{pattern}
				{mapSquares}
			</div>
		);
	}
}

export default MapSquares;
