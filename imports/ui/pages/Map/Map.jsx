import React from 'react';
import { withRouter } from 'react-router-dom';

// import { Meteor } from 'meteor/meteor';
// import { withTracker } from 'meteor/react-meteor-data';

// Mongodb collection
// import { Maps } from '../../../api/maps/maps.js';

// component that draws map
import MapSquares from '../../components/MapSquares/MapSquares.jsx';

const Map = ({  mapName }) => (
	<div className="Map">
		<MapSquares
			mapSize={mapName}
		/>
	</div>
);
/*
// it seems necessary for Map to have its own subscription. I can pass the id of the map down from App but not the collection.
// withRouter is required to pass down props
export default withRouter(withTracker((props) => {
	const mapsHandle = Meteor.subscribe('maps');

	return {
		'map': Maps.findOne({'_id': props.match.params._id}),
		'loading': !mapsHandle.ready(),
		'currentUser': Meteor.user(),
		'mapId': props.match.params._id,
	};
})(Map)); */

export default withRouter((props) => {
	console.log('here');
	return {
		'mapName': props.mapName,
	};
})(Map);
