import _ from 'lodash';
import React from 'react';

export function createStateContainer(WrappedComponent) {
	return React.createClass({
		propTypes: {
			onNextState: React.PropTypes.func,
		},

		getChildContext() {
			return {
				getState: this._getState,
				setState: this._setState,
			};
		},

		childContextTypes: {
			getState: React.PropTypes.func,
			setState: React.PropTypes.func,
		},

		_getState() {
			return this.state;
		},

		_setState(path, state, actionName) {
			let newState;
			if (!_.isUndefined(path)) {
				newState = _.set({
					...this.state,
				}, path, {
					..._.get(this.state, path),
					...state,
				});
			} else {
				newState = {
					...this.state,
					...state,
				};
			}
			this.setState(newState);
			if (this.props && this.props.onNextState) {
				this.props.onNextState(newState, actionName);
			}
		},

		render() {
			return React.createElement(WrappedComponent, {...this.state, ...this.props});
		},
	});
}
