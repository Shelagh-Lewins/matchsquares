import React, { Component } from 'react';

// component that draws map
import MapSquares from '../../components/MapSquares/MapSquares.jsx';
import './Game.scss';

class Game extends Component {
	render() {
		return (
			<div className="map">
				<MapSquares
					url={this.props.match.params.url}
				/>
			</div>
		);
	}
}

export default Game;

