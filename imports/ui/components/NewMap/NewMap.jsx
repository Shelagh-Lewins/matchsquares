import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

import { Meteor } from 'meteor/meteor';

import promisedCall from '../../../api/client/promised-call.js';

// notifications
import toastr from 'toastr';
import 'toastr/build/toastr.css';

class NewMap extends Component {
	constructor(props) {
		super(props);
		this.state = {'name': ''};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({'name': event.target.value});
	}

	handleSubmit(event) {
		event.preventDefault();

		promisedCall('maps.new', {'name': this.state.name}).then((_id) => {
			this.setState({'name': ''});
			this.props.history.push(`/map/${_id}`);
		},
		(err) => {
			toastr.error(`Error creating map: ${err}`);
		}
		);
	}

	// test rate limit
	/* swarm() {
		for ( let i = 0; i < 15; i++ ) {
			const methodName = 'maps.new';
			promisedCall(methodName, {'name': `test_${i}`}).then(() => {
				console.log(`sending method ${methodName}`);
			},
			(err) => {
				toastr.error(`Error calling method: ${err}`);
			}
			);
		}
	} */

	render() {
		// must be logged in to create a map
		// & map must have a name
		let inputDisabled = 'disabled';
		if (Meteor.userId()) inputDisabled = '';

		let submitDisabled = true;
		if (this.state.name && Meteor.userId()) submitDisabled = false;

		// let swarm = this.swarm;

		return (
			<form className="new-map form-group" onSubmit={this.handleSubmit}>
				<label>
					<input type="text" className="form=control" disabled={inputDisabled} placeholder="Map name" value={this.state.name} onChange={this.handleChange} />
				</label>
				<Button type="submit" disabled={submitDisabled} className="btn btn-secondary" >New map</Button>
				{/* <button onClick={ swarm } >Test rate limiter</button> */}
			</form>
		);
	}
}

export default NewMap;
