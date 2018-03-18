import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

import './Scores.scss';

class About extends Component {
	componentDidMount() {
		$('body').addClass('scores');
		$('main').css('background', 'url(/backgrounds/fort.jpg) transparent no-repeat 0 0');
		$('main').css('background-size', 'cover');
	}

	componentWillUnmount() {
		$('body').removeClass('scores');
	}

	renderScores() {
		// split the maps into easy and challenging
		const easyMaps = [];
		const challengingMaps = [];

		Meteor.settings.public.maps.map((map) => {
			// is there stored data for this map?
			const storedData = localStorage.getItem(map.url) ?  JSON.parse(localStorage.getItem(map.url)) : {};

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
			<Row>
				<Col xs={12} sm={6}>
					<div className='box'>
						<h2>Easy boards</h2>
						<BootstrapTable
							keyField='url'
							data={ data.easyMaps }
							columns={ columns }
							rowStyle={ rowStyle }
						/>
					</div>
				</Col>
				<Col xs={12} sm={6}>
					<div className='box'>
						<h2>Challenging boards</h2>
						<BootstrapTable
							keyField='url'
							data={ data.challengingMaps }
							columns={ columns }
							rowStyle={ rowStyle }
						/>
					</div>
				</Col>
			</Row>
		);
	}

	render() {
		const scores = this.renderScores();
		return (
			<div className="inner-tube">
				<div className="box">
					<Row>
						<Col xs={12}>
							<h1>Scores</h1>
						</Col>
					</Row>
				</div>
				<div className = "score-tables">
					{scores}
				</div>
			</div>
		);
	}
}

export default About;
