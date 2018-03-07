import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

function MapLink(props) {
	return (
		<li>
			<Link to={`/game/${props.url}`}>{props.mapName}</Link>
		</li>
	);
}

class MapsList extends Component {
	constructor(props) {
		super(props);
	}

	renderMapList() {
		const history = this.props.history;

		return (
			<Row>
				<Col>
					<ul>
						{
							Meteor.settings.public.mapSizes.map( (size) => <MapLink
								key={'map' + size.name}
								mapName={size.name}
								url={size.url}
								history={history}
							/> )
						}
					</ul>
				</Col>
			</Row>
		);
	}

	render() {
		let maps = this.renderMapList(this.props.maps);

		return (
			<div className="home">
				<h1>Game Sizes</h1>
				<div className = "maps">
					{maps}
				</div>
			</div>
		);
	}
}

export default MapsList;
