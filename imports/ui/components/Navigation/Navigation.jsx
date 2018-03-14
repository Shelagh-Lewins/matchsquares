import React from 'react';
import { Link } from 'react-router-dom';
// import Logo from '~/public/header-icon.png';

import './Navigation.scss';

function Navigation() {
	return (
		<nav>
			<ul>
				<li><Link to='/'>Home</Link></li>
				<li><Link to='/about'>About</Link></li>
			</ul>
		</nav>
	);
}

export default Navigation;
