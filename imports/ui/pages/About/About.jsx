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
						<Col xs={12}>
							<div className='box'>
								<h2>How to play</h2>
								<p>Tap tiles until they match the pattern displayed above the board.</p>
								<p>Tapping a tile will change it to the next shape in the sequence:</p>
								<p>triangle &gt; square &gt; pentagon &gt; hexagon</p>
								<p>Neighbouring tiles with the same shape will also change!</p>
							</div>
						</Col>
						<Col xs={12}>
							<div className='box'>
								<h2>Challenging boards</h2>
								<p>If you play a Challenging board, there are three types of pattern.</p>
								<dl className="rules">
									<dt>Generated</dt>
									<dd>The pattern has been constructed so that it can always be solved.</dd>
									<dt>Random</dt>
									<dd>The pattern is completely random. It may not be possible to solve this pattern.</dd>
									<dt>ID</dt>
									<dd>Every pattern is defined by a series of numbers and lower-case letters. Entering an ID lets you try the same pattern again, or share it with a friend to see if they can solve it.</dd>
								</dl>
								<p>I would love to know if there is a mathematical way to tell whether a random pattern can be solved. If you work this out, please let me know!</p>
							</div>
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}

export default About;
