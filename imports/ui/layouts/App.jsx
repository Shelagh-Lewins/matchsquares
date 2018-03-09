/* This is an app under development.

For a boilerplate app, see the 'boilerplate' branch. That includes:

React
React Router 4
Rate limiting of methods
Unit testing of methods with mocha / chai
Twitter Bootstrap
Client-side promises to avoid 'callback hell'
toastr notifications
User accounts
Modular / component structure
SASS
JSX and SASS linting config files
settings.json

There is NOT a schema because Simple Schema doesn't support nested arrays, and doesn't appear to be maintained.

It allows the user to create, view and delete 'maps' comprising a square grid.

Clicking mapsquares cycles them through a series of polygons.
*/

import React, { Component } from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import './App.scss';
import { Grid } from 'react-bootstrap';

import Navigation from '../components/Navigation/Navigation.jsx';

import Home from '../pages/Home/Home.jsx';
import Game from '../pages/Game/Game.jsx';
import About from '../pages/About/About.jsx'; // TODO move this into a folder

class App extends Component {
	render() {
		return (
			<div className="primary-layout">
				<header>
					<Navigation />
				</header>

				<main>
					<Grid fluid={true}>
						<Switch>
							<Route exact path='/' component={Home}/>
							<Route path='/game/:url' component={Game}/>
							<Route path='/about' component={About}/>
						</Switch>
					</Grid>
				</main>
			</div>
		);
	}
}

export default withRouter(App);

