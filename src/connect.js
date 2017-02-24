import _ from 'lodash';
import React from 'react';

import { bindActions } from './actions';
import { buildComputeds, generateComputeds } from './computed';

function composeState({ propTypeKeys, defaults, containerState, boundComputeds, props }) {
	const __propKeys = _.keys(props);
	const __stateKeys = _.without(propTypeKeys, ...__propKeys);
	const composedState = {
		__propKeys,
		__stateKeys,
		__computed: null,
	};
	if (Object.keys(boundComputeds).length > 0) {
		const passThroughProps = _.pick(props, propTypeKeys);
		const stateToProps = _.pick(containerState, __stateKeys);
		const state = {
			...defaults,
			...stateToProps,
			...passThroughProps,
		};
		composedState.__computed = generateComputeds(boundComputeds, state);
	}
	return composedState;
}

export function connectToProps(WrappedComponent, actions, computeds, nameSpace) {
	const boundComputeds = buildComputeds(computeds);

	return React.createClass({
		propTypes: {
			stateName: React.PropTypes.string,
		},

		getDefaultProps() {
			return {
				stateName: '',
			};
		},

		getChildContext: function() {
			return {
				parentName: this.state.__nameSpace || this.context.parentName,
			};
		},

		childContextTypes: {
			parentName: React.PropTypes.string,
		},

		contextTypes: {
			parentName: React.PropTypes.string,
			getState: React.PropTypes.func,
			setState: React.PropTypes.func,
		},

		getInitialState() {
			const {
				stateName,
				...props
			} = this.props;
			const __propKeys = _.keys(props);
			const __propTypeKeys = _.keys(WrappedComponent.propTypes);
			const __actionKeys = _.keys(actions);
			const __computedKeys = _.keys(boundComputeds);
			const __stateKeys = _.without(__propTypeKeys, ...__propKeys);
			const getDefaultProps = WrappedComponent.getDefaultProps
				? WrappedComponent.getDefaultProps
				: () => (WrappedComponent.defaultProps || {});

			return {
				__nameSpace: nameSpace,
				__stateName: stateName,
				__propKeys,
				__propTypeKeys,
				__actionKeys,
				__computedKeys,
				__stateKeys,
				__actions: bindActions(this, actions),
				__computed: null,
				__defaults: getDefaultProps(),
			};
		},

		componentWillMount() {
			const {
				__nameSpace,
				__stateName,
				__defaults,
				__propTypeKeys,
			} = this.state;
			this.setState(composeState({
				defaults: __defaults,
				propTypeKeys: __propTypeKeys,
				containerState: this.context.getState([this.context.parentName, __nameSpace, __stateName]),
				props: this.props,
				boundComputeds,
			}));
		},

		componentWillReceiveProps(nextProps) {
			const {
				__nameSpace,
				__stateName,
				__defaults,
				__propTypeKeys,
			} = this.state;
			this.setState(composeState({
				defaults: __defaults,
				propTypeKeys: __propTypeKeys,
				containerState: this.context.getState([this.context.parentName, __nameSpace, __stateName]),
				props: nextProps,
				boundComputeds,
			}));
		},

		render() {
			const {
				__nameSpace,
				__stateName,
				__propTypeKeys,
				__stateKeys,
				__actions,
				__computed,
				__defaults,
			} = this.state;

			const passThroughProps = _.pick(this.props, __propTypeKeys);
			const stateToProps = _.pick(this.context.getState([this.context.parentName, __nameSpace, __stateName]), __stateKeys);
			// TODO: should cache the merge smartly
			const props = {..._.merge({}, __defaults, stateToProps, __actions, __computed, passThroughProps) };

			return React.createElement(WrappedComponent, props);
		},
	});
}
