import _ from 'lodash';

export function bindActions(_this, actions, actionNameSpace) {
	const boundActions = _.mapValues(actions, (action, actionName) => {
		if (_.isFunction(action)) {
			const actionFn = action;
			const statePath = _this.getStatePath(actionNameSpace);
			return function wrappedAction(...args) {
				const {
					__propTypeKeys,
					__actionKeys,
					__computedKeys,
				} = _this.state;

				const setState = _.partial(_this.context.setState, _this.getStatePath().concat([actionNameSpace]));

				const getDefaults = () => {
					return !_.isEmpty(statePath) ? _.get(_this.state.__defaults, statePath) : _this.state.__defaults;
				};

				const getState = function() {
					const props = actionNameSpace ? _.get(_this.props, actionNameSpace) : _this.props;
					const containerState = _this.context.getState(statePath);
					const defaults = getDefaults();
					let state = {
						...defaults,
						...containerState,
						..._.pick(props, ...__propTypeKeys),
					};
					state = _.omit(state, ...__actionKeys);
					state = _.omit(state, ...__computedKeys);
					return state;
				};

				const getComputed = () => _this.state.__computed;
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
		getStatePath: jest.fn(() => []),
		context: {
			setState: (nameSpace, newState) => {
				state = {...state, ...newState};
				return Promise.resolve(state);
			},
			getState: () => state,
		},
	}, actions);
}
