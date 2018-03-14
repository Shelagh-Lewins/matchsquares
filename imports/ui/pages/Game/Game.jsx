import React, { Component } from 'react';

// component that draws map
import MapSquares from '../../components/MapSquares/MapSquares.jsx';

class Game extends Component {
	render() {
		return (
			<div className="Map">
				<MapSquares
					url={this.props.match.params.url}
				/>
			</div>
		);
	}
}

export default Game;

