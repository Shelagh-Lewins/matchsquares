
import React from 'react';

// component that lists maps
import MapsList from '../../components/MapsList/MapsList.jsx';

const Home = ({ history }) => (
	<div className="Home">
	<h1>MatchSquares</h1>
	<p>A simple puzzle game in which you tap tiles until they match the pattern above the board. Choose a board and start playing!</p>
		<MapsList
			history={history}
		/>
	</div>
);

export default Home;

