import { Meteor } from 'meteor/meteor';
import { Promise } from 'meteor/promise';

function promisedCall(method, params) {
	return new Promise((resolve, reject) => {
		Meteor.call(method, params, (err, res) => {
			if (err) {
				reject(err);
			} else {
				resolve(res);
			}
		});
	});
}


export default promisedCall;


