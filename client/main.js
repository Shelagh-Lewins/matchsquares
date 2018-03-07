/* global document */

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

// Start the app with imports
import '../imports/startup/accounts-config.js';
import App from '../imports/ui/layouts/App.jsx';

Meteor.startup(() => {
	render((<BrowserRouter><App /></BrowserRouter>), document.getElementById('app'));
});
