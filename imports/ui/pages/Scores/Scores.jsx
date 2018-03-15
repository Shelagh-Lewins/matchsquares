import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

class About extends Component {
	renderScores() {
	// list all the maps
		const data = Meteor.settings.public.maps.map((map) => {
			// is there stored data for this map?
			const storedData = localStorage.getItem(map.url) ?  JSON.parse(localStorage.getItem(map.url)) : {};
			console.log(`stored data ${JSON.stringify(storedData)}`);

			const solved = storedData.solved ? storedData.solved : '-';
			const average = storedData.average ? storedData.average : '-';

			return (
				{
					'name': map.name,
					'solved': solved,
					'average': average,
				}
			);
		});
		console.log(`data ${JSON.stringify(data)}`);
		return (
			<div>
				<ul className='scores'>
					{data.map( (map, index) => <li key={index}>{map.name}</li>)}
				</ul>
			</div>
		);
	}

	render() {
		const scores = this.renderScores();
		return (
			<div>
				<h1>Scores</h1>
				<p>Show scores here</p>
				{scores}
			</div>
		);
	}
}

export default About;
