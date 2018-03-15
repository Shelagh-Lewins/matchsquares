
import React from 'react';

// component that lists maps
import MapsList from '../../components/MapsList/MapsList.jsx';

const Home = ({ history }) => (
	<div className="Home">
		<h1>MatchSquares</h1>
		<p>Tap tiles until they match the pattern above the board, in this simple puzzle game. Choose a board and start playing!</p>
		<MapsList
			history={history}
		/>
	</div>
);

export default Home;

