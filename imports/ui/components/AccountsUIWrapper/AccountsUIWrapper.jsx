import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

// TUtorial code uses findDOMNode which is expected to be deprecated. Code updated as per https://reactjs.org/docs/refs-and-the-dom.html

export default class AccountsUIWrapper extends Component {
	componentDidMount() {
		// Use Meteor Blaze to render login buttons
		// this.view = Blaze.render(Template.loginButtons,
		// ReactDOM.findDOMNode(this.refs.container));
		// this.view = Blaze.render(Template.loginButtons, this.node);
		this.view = Blaze.renderWithData(Template.loginButtons, {'align': 'right'}, this.node);
	}
	componentWillUnmount() {
		// Clean up Blaze view
		Blaze.remove(this.view);
	}
	render() {
		// Just render a placeholder container that will be filled in
		// return <span ref="container" />;
		return <span ref={node => {this.node = node;}} />;
	}
}
