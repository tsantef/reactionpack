import _ from 'lodash';

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
