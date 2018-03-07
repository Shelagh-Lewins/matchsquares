import { Meteor } from 'meteor/meteor';
import { Maps } from '../../api/maps/maps.js';

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
	// Maps.remove({}); // TODO remove. Just clears the collection for messing about.
	// can now create a map in the UI, so this isn't as important
	/* if (Maps.find().count() === 0) {
		Meteor.call('createMap', {TODO insert params});
	} */
});
