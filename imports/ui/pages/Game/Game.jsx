import React, { Component } from 'react';
import { useParams } from 'react-router-dom';

// component that draws map
import MapSquares from '../../components/MapSquares/MapSquares.jsx';
import './Game.scss';

class Game extends Component {
	render() {
		return (
			<div className="map">
				<MapSquares
					url={this.props.url}
				/>
			</div>
		);
	}
}

// Wrapper to use hooks with class component
function GameWithParams(props) {
	const params = useParams();
	return <Game {...props} url={params.url} />;
}

export default GameWithParams;

