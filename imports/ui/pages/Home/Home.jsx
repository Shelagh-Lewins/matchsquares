
import React from 'react';
import { withRouter } from 'react-router-dom';

import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

// Mongodb collection
import { Maps } from '../../../api/maps/maps.js';

// component that lists maps
import MapsList from '../../components/MapsList/MapsList.jsx';

const Home = ({ maps, loading, currentUser, history }) => (
	<div className="Maps">
		<MapsList
			maps={maps}
			loading={loading}
			currentUser={currentUser}
			history={history}
		/>
	</div>
);

// withRouter is required to pass down props
export default withRouter(withTracker((props) => {
	const mapsHandle = Meteor.subscribe('maps');

	return {
		'maps': Maps.find({}).fetch(),
		'loading': !mapsHandle.ready(),
		'currentUser': Meteor.user(),
		'history': props.history,
	};
})(Home));
