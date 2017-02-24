import _ from 'lodash';

export function bindActions(_this, actions, nameSpace) {
	const boundActions = _.mapValues(actions, (action, actionName) => {
		if (_.isFunction(action)) {
			const actionFn = action;
			return function wrappedAction(...args) {
				const {
					__stateName,
					__propTypeKeys,
					__actionKeys,
					__computedKeys,
				} = _this.state;
				const setState = _.partial(_this.context.setState, [nameSpace, __stateName]);
				const getState = function() {
					const props = nameSpace ? _.get(_this.props, nameSpace) : _this.props;
					const containerState = _this.context.getState([nameSpace, __stateName]);
					let state = { ..._this.state.__defaults, ..._.pick(containerState, __propTypeKeys), ..._.pick(props, ...__propTypeKeys) };
					state = _.omit(state, ...__actionKeys);
					state = _.omit(state, ...__computedKeys);
					return state;
				};
				const getComputed = () => _this.state.__computed;
				const getDefaults = () => _this.state.__defaults;
				const getActions = () => _.mapValues(boundActions, (func) => func.bind(_this));

				const context = {
					getActions,
					getComputed,
					getState,
					getDefaults,
				};

				const action = actionFn.bind(context);
				const state = getState();

				const newStateMaybe = action(state, ...args);

				if (_.isNull(newStateMaybe) || _.isUndefined(newStateMaybe)) {
					return Promise.resolve(state);
				} else if (newStateMaybe.then) {
					return newStateMaybe.then((newState) => {
						return setState(newState, actionName);
					});
				} else {
					return setState(newStateMaybe, actionName);
				}
			};
		} else if (_.isPlainObject(action)) {
			return bindActions(_this, action, actionName);
		} else {
			throw new Error('Actions must be either functions or objects');
		}
	});

	return boundActions;
}

export function mockActions(actions, computeds={}) {
	let state = {};
	return bindActions({
		state: {
			__propTypeKeys: [],
			__actionKeys: [],
			__computedKeys: [],
			__computed: computeds,
		},
		context: {
			setState: (nameSpace, newState) => {
				state = {...state, ...newState};
				return Promise.resolve(state);
			},
			getState: () => state,
		},
	}, actions);
}
