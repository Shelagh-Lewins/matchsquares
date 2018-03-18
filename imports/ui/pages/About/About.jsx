import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';

import DonateButton from '../../components/DonateButton/DonateButton.jsx';

import './About.scss';

class About extends Component {
	componentDidMount() {
		$('body').addClass('about');
		$('main').css('background', 'url(/backgrounds/cat.jpg) transparent no-repeat 0 0');
		$('main').css('background-size', 'cover');
	}

	componentWillUnmount() {
		$('body').removeClass('about');
	}

	render() {
		return (
			<div className="inner-tube">
				<div className="box">
					<Row>
						<Col xs={12}>
							<h1>About MatchSquares</h1>
						</Col>
					</Row>
				</div>
				<div className="columns">
					<Row>
						<Col xs={12} sm={6}>
							<div className='box'>
								<p>MatchSquares is an interactive puzzle game created by Shelagh Lewins.</p>
								<p>Game design, code and artwork copyright &copy; Shelagh Lewins, 7 March 2018. All photographs were taken in the region of Hadrian&apos;s Wall and are copyright &copy; Alister Perrott 2012.</p>
							</div>
						</Col>
						<Col xs={12} sm={6}>
							<div className='box'>
								<DonateButton />
								<p>MatchSquares is free to play and there are no adverts. If you enjoy playing MatchSquares, perhaps you might make a small donation to help keep the server running and the developer supplied with coffee? It will make the developer very happy and give them a warm fuzzy feeling all day.</p>
							</div>
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}

export default About;
