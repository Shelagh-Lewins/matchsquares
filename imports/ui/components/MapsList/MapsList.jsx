import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

import './MapsList.scss';

function MapLink(props) {
	return (
		<li>
			<Link to={`/game/${props.url}`} className={'map-' + props.url} ><span className='name'>{props.mapName}</span><span className='preview'></span></Link>
		</li>
	);
}

class MapsList extends Component {
	constructor(props) {
		super(props);
	}

	buildSingleList(list, className, name) {
		const history = this.props.history;

		return (
			<Col xs={12} sm={6}>
				<div className='box'>
					<h2>{name}</h2>
					<ul className={`${className}`}>
						{
							list.map( (size) => <MapLink
								key={'map' + size.name}
								mapName={size.name}
								url={size.url}
								history={history}
							/> )
						}
					</ul>
				</div>
			</Col>
		);
	}

	renderMapLists() {
		// split the maps into easy and challenging
		const easyMaps = [];
		const challengingMaps = [];

		// challenging maps have pattern and map the same size; no working rows
		Meteor.settings.public.maps.map( (map) => {
			if (map.mapRows === map.patternRows && map.mapColumns === map.patternColumns) {
				challengingMaps.push(map);
			} else {
				easyMaps.push(map);
			}
		});

		return (
			{
				'easyMaps': easyMaps,
				'challengingMaps': challengingMaps,
			}
		);
	}

	render() {
		const mapLists = this.renderMapLists();

		const easyMapList = this.buildSingleList(mapLists.easyMaps, 'easy', 'Easy boards');
		const challengingMapList = this.buildSingleList(mapLists.challengingMaps, 'challenging', 'Challenging boards');

		return (
			<div className = "maps-list">
				<Row>
					{easyMapList}
					{challengingMapList}
				</Row>
			</div>
		);
	}
}

export default MapsList;
