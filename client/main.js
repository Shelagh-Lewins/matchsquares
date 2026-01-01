/* global document */

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Start the app with imports
import App from '../imports/ui/layouts/App.jsx';

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Import SCSS files
import './main.scss';

Meteor.startup(() => {
	const root = createRoot(document.getElementById('app'));
	root.render(<BrowserRouter><App /></BrowserRouter>);
});
