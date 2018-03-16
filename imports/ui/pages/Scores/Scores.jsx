import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

import './Scores.css';

class About extends Component {
	renderScores() {
	// list all the maps
		// split the maps into easy and challenging
		const easyMaps = [];
		const challengingMaps = [];

		Meteor.settings.public.maps.map((map) => {
			// is there stored data for this map?
			const storedData = localStorage.getItem(map.url) ?  JSON.parse(localStorage.getItem(map.url)) : {};
			console.log(`stored data for ${map.url}: ${JSON.stringify(storedData)}`);

			const solved = storedData.solved ? storedData.solved : '-';
			const averageClicks = storedData.averageClicks ? storedData.averageClicks : '-';

			const temp = {
				'url': map.url,
				'name': map.name,
				'solved': solved,
				'averageClicks': averageClicks,
			};

			if (map.mapRows === map.patternRows && map.mapColumns === map.patternColumns) {
				challengingMaps.push(temp);
			} else {
				easyMaps.push(temp);
			}
		});

		const data = {
			'easyMaps': easyMaps,
			'challengingMaps': challengingMaps,
		};

		console.log(`data ${JSON.stringify(data)}`);
		const headerStyle = {
			'color': '#fff',
			'backgroundColor': '#51376b',
		};

		const rowStyle = { 'borderColor': '#51376b' };

		const columns = [{
			'dataField': 'name',
			'text': 'Name',
			'headerStyle': headerStyle,
		}, {
			'dataField': 'solved',
			'text': 'Solved',
			'headerStyle': headerStyle,
		}, {
			'dataField': 'averageClicks',
			'text': 'Average Clicks',
			'headerStyle': headerStyle,
		}];

		return (
			<div>
				{/* <ul className='scores'>
					{data.map( (map, index) => <li key={index}>{map.name}</li>)}
				</ul> */}
				<h2>Easy</h2>
				<BootstrapTable
					keyField='url'
					data={ data.easyMaps }
					columns={ columns }
					striped
					rowStyle={ rowStyle }
				/>
				<h2>Challenging</h2>
				<BootstrapTable
					keyField='url'
					data={ data.challengingMaps }
					columns={ columns }
					striped
					rowStyle={ rowStyle }
				/>
			</div>
		);
	}

	render() {
		const scores = this.renderScores();
		return (
			<div>
				<h1>Scores</h1>
				{scores}
			</div>
		);
	}
}

export default About;