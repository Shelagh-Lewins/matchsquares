
import React from 'react';
import { Row, Col } from 'react-bootstrap';

// import './Home.scss';

// component that lists maps
import MapsList from '../../components/MapsList/MapsList.jsx';
import DonateButton from '../../components/DonateButton/DonateButton.jsx';

const Home = ({ history }) => (
	<div className="Home">
		<h1>MatchSquares</h1>
		<Row>
			<Col xs={12} sm={6}>
				<p>Tap tiles until they match the pattern displayed above the board in this simple puzzle game. Choose a board and start playing!</p>
			</Col>
			<Col xs={12} sm={6}>
				<p>MatchSquares is free to play and there are no adverts. If you enjoy playing MatchSquares, perhaps you might make a small donation to help keep the server running and the developer supplied with coffee?</p>
				<DonateButton
					center={true}
				/>
			</Col>
		</Row>
		<MapsList
			history={history}
		/>
	</div>
);

export default Home;

