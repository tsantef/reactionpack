export function installDevTools(onNextState, resetState, initialState) {
	const devToolsConfig = {};

	const devTools = window.__REDUX_DEVTOOLS_EXTENSION__
		? window.__REDUX_DEVTOOLS_EXTENSION__ .connect(devToolsConfig)
		: null;

	if (devTools) {
		devTools.init(initialState);

		devTools.subscribe((message) => {
			const {
				type,
				payload,
				state: rawStateInfo,
			} = message;
			if (type === 'DISPATCH') {
				if (payload.type === 'JUMP_TO_STATE') {
					const stateInfo = JSON.parse(rawStateInfo);
					resetState(stateInfo);
				}
				if (payload.type === 'TOGGLE_ACTION') {
					const stateInfo = JSON.parse(rawStateInfo);
					const state = stateInfo.computedStates[payload.id].state;
					resetState(state);
				}
				if (payload.type === 'RESET') {
					resetState(initialState);
				}
			}
		});

		// register onNextState callback
		onNextState((state, action) => devTools.send({ type: action }, state));
	}
}
