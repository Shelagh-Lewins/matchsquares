
import React from 'react';

// component that lists maps
import MapsList from '../../components/MapsList/MapsList.jsx';

const Home = ({ history }) => (
	<div className="Maps">
		<MapsList
			history={history}
		/>
	</div>
);

export default Home;

