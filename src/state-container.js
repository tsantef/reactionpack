import _ from 'lodash';
import React from 'react';

export function createStateContainer(WrappedComponent, initialState={}) {
	return React.createClass({
		propTypes: {
			onNextState: React.PropTypes.func,
			installDevTools: React.PropTypes.func, // Use for debugging purposes only
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

		getInitialState() {
			return initialState;
		},

		_getState(path) {
			const compactPath = _.compact(path);
			if (!_.isEmpty(compactPath)) {
				return _.get(this.state, compactPath);
			} else {
				return this.state;
			}
		},

		_setState(path, state, actionName) {
			return new Promise((resolve) => {
				let newState;
				const compactPath = _.compact(path);
				if (!_.isEmpty(compactPath)) {
					newState = _.set({
						...this.state,
					}, compactPath, {
						..._.get(this.state, compactPath),
						...state,
					});
				} else {
					newState = {
						...this.state,
						...state,
					};
				}
				if (this.props && this.props.onNextState) {
					this.props.onNextState(newState, actionName);
				}
				if (this.onNextState) {
					this.onNextState(newState, actionName);
				}
				this.setState(newState, () => {
					resolve(this.state);
				});
			});
		},

		componentDidMount() {
			if (this.props.installDevTools) {
				// Call installDevTools with callback to reset state (development purposes only)
				this.props.installDevTools(
					(onNextState) => {
						this.onNextState = onNextState;
					},
					(resetState) => {
						this.setState(resetState);
					},
					this._getState()
				);
			}
		},

		render() {
			const props = _.omit(this.props, 'onNextState');
			return React.createElement(WrappedComponent, {...this.state, ...props});
		},
	});
}
