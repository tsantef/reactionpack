import _ from 'lodash';
import React from 'react';

import { createComputed } from './computed';

export function bindActions(_this, actions, nameSpace) {
	const lastActionInstanceByName = {};
	const boundActions =  _.mapValues(actions, (action, key) => {
		if (_.isFunction(action)) {
			const actionFn = action;
			return function wrappedAction(...args) {
				const {
					__propTypeKeys,
					__actionKeys,
					__computedKeys,
				} = _this.state;
				const funcState = { canceled: false };
				const setState = _.partial(_this.context.setState, nameSpace);
				const getState = function() {
					const props = nameSpace ? _.get(_this.props, nameSpace) : _this.props;
					let state = { ..._this.state.__defaults, ..._.pick(props, ...__propTypeKeys) };
					state = _.omit(state, ...__actionKeys);
					state = _.omit(state, ...__computedKeys);
					return state;
				};
				const getComputed = () => _this.state.__computed;
				const getDefaults = () => _this.state.__defaults;
				const getActions = () => _.mapValues(boundActions, (func) => (!funcState.canceled ? func.bind(_this) : _.noop));

				const context = {
					getActions,
					getComputed,
					getState,
					getDefaults,
				};

				const action = actionFn.bind(context);

				const newStateMaybe = action(getState(), ...args);

				if (_.isNull(newStateMaybe) || _.isUndefined(newStateMaybe)) {
					return null;
				} else if (newStateMaybe.then) {
					if (lastActionInstanceByName[name]) {
						lastActionInstanceByName[name].canceled = true;
					}
					lastActionInstanceByName[name] = funcState;
					return newStateMaybe.then((newState) => {
						if (lastActionInstanceByName[name] === funcState) {
							lastActionInstanceByName[name] = null;
							setState(newState, key);
						}
						return null;
					});
				} else {
					return setState(newStateMaybe, key);
				}
			};
		} else if (_.isPlainObject(action)) {
			return bindActions(_this, action, key);
		}
	});
	return boundActions;
}

function generateComputeds(computeds, props, nameSpace) {
	const _props = nameSpace ? _.get(props, nameSpace, {}) : props;
	return _.mapValues(computeds, (computed, key) => {
		if (_.isFunction(computed)) {
			return computed(_props);
		} else {
			return generateComputeds(computed, _props, key);
		}
	});
}

// TODO: Should filter out actions
function composeState({ propTypeKeys, defaults, containerState, boundComputeds, props }) {
	const __propKeys = _.keys(props);
	const __stateKeys = _.without(propTypeKeys, ...__propKeys);
	const composedState = {
		__propKeys,
		__stateKeys,
		__computed: null,
	};
	if (boundComputeds) {
		const passThroughProps = _.pick(props, propTypeKeys);
		const stateToProps = _.pick(containerState, __stateKeys);
		composedState.__computed = generateComputeds(boundComputeds, {
			...defaults,
			...stateToProps,
			...passThroughProps,
		});
	}
	return composedState;
}

function buildComputeds(computeds) {
	return _.mapValues(computeds, (value, key) => {
		if (_.isArray(value)) {
			return createComputed(value);
		} else {
			return buildComputeds(value);
		}
	});
}

export function connectToProps(WrappedComponent, actions, computeds, nameSpace) {
	const boundComputeds = buildComputeds(computeds);

	return React.createClass({
		contextTypes: {
			getState: React.PropTypes.func,
			setState: React.PropTypes.func,
		},

		getInitialState() {
			const __propKeys = _.keys(this.props);
			const __propTypeKeys = _.keys(WrappedComponent.propTypes);
			const __actionKeys = _.keys(actions);
			const __computedKeys = _.keys(boundComputeds);
			const __stateKeys = _.without(__propTypeKeys, ...__propKeys);
			const getDefaultProps =  WrappedComponent.getDefaultProps;
			return {
				__propKeys,
				__propTypeKeys,
				__actionKeys,
				__computedKeys,
				__stateKeys,
				__actions: bindActions(this, actions),
				__computed: null,
				__defaults: getDefaultProps ? getDefaultProps() : {},
			};
		},

		componentWillMount() {
			const {
				__defaults,
				__propTypeKeys,
			} = this.state;
			this.setState(composeState({
				defaults: __defaults,
				propTypeKeys: __propTypeKeys,
				containerState: this.context.getState(),
				props: this.props,
				boundComputeds,
			}));
		},

		componentWillReceiveProps(nextProps) {
			const {
				__defaults,
				__propTypeKeys,
			} = this.state;
			this.setState(composeState({
				defaults: __defaults,
				propTypeKeys: __propTypeKeys,
				containerState: this.context.getState(),
				props: nextProps,
				boundComputeds,
			}));
		},

		render() {
			const {
				__propTypeKeys,
				__stateKeys,
				__actions,
				__computed,
				__defaults,
			} = this.state;

			const passThroughProps = _.pick(this.props, __propTypeKeys);
			const stateToProps = _.pick(this.context.getState(), __stateKeys);

			// TODO: should cache the merge smartly
			const props = {..._.merge({}, __defaults, stateToProps, __actions, __computed, passThroughProps) };

			return React.createElement(WrappedComponent, props);
		},
	});
}
