import React from 'react';
import { Row, Col } from 'react-bootstrap';

import DonateButton from '../../components/DonateButton/DonateButton.jsx';

const About = () => (
	<div>
		<h1>About MatchSquares</h1>
		<p>MatchSquares is an interactive puzzle game created by Shelagh Lewins.</p>
		<Row>
			<Col xs={12} sm={6}>
				<p>MatchSquares is free to play and there are no adverts. If you enjoy playing MatchSquares, perhaps you might make a small donation to help keep the server running and the developer supplied with coffee? It will make the developer very happy and give them a warm fuzzy feeling all day.</p>
			</Col>
			<Col xs={12} sm={6}>
				<DonateButton />
			</Col>
		</Row>
		<Row>
			<Col xs={12} sm={12}>
				<p>Game design, code and artwork copyright &copy; Shelagh Lewins, 7 March 2018.</p>
			</Col>
		</Row>
	</div>
);

export default About;
