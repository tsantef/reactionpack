import { installDevTools } from './dev-tools';

describe('Dev Tools', () => {

	describe('#installDevTools', () => {
		let devTools;

		beforeEach(() => {
			devTools = {
				connect: jest.fn(() => devTools),
				init: jest.fn(),
				send: jest.fn(),
				subscribe: jest.fn(),
			};
			window.__REDUX_DEVTOOLS_EXTENSION__ = devTools;
		});

		afterEach(() => {
			window.__REDUX_DEVTOOLS_EXTENSION__ = null;
		});

		it('should call init', () => {
			installDevTools(jest.fn(), null, { value: 2 });
			expect(devTools.init).toHaveBeenCalledWith({ value: 2 });
		});

		it('should call onNextState', () => {
			const resetState = jest.fn();
			installDevTools((onNextState) => {
				onNextState({ state: 1 }, 'myAction');
			}, resetState);

			expect(devTools.send).toHaveBeenCalledWith({type: 'myAction'}, {state: 1});
		});

		it('should handle no dev tools', () => {
			window.__REDUX_DEVTOOLS_EXTENSION__ = null;
			installDevTools(jest.fn());
		});

		describe('#subscribe', () => {

			it('should reset state on JUMP_TO_STATE', () => {
				const resetState = jest.fn();
				devTools.subscribe = jest.fn((callback) => {
					callback({
						type: 'DISPATCH',
						payload: {
							type: 'JUMP_TO_STATE',
						},
						state: '{}',
					});
				});
				installDevTools(
					() => {},
					resetState
				);
				expect(resetState).toHaveBeenCalledWith({});
			});

			it('should set state on TOGGLE_ACTION', () => {
				const resetState = jest.fn();
				devTools.subscribe = jest.fn((callback) => {
					callback({
						type: 'DISPATCH',
						payload: {
							id: 1,
							type: 'TOGGLE_ACTION',
						},
						state: '{"computedStates":{"1":{"state":{}}}}',
					});
				});
				installDevTools(
					() => {},
					resetState
				);
				expect(resetState).toHaveBeenCalledWith({});
			});

			it('should reset state on JUMP_TO_STATE', () => {
				const resetState = jest.fn();
				devTools.subscribe = jest.fn((callback) => {
					callback({
						type: 'DISPATCH',
						payload: {
							type: 'RESET',
						},
					});
				});
				installDevTools(
					() => {},
					resetState,
					{value: 1}
				);
				expect(resetState).toHaveBeenCalledWith({'value': 1});
			});

			it('should ignore non DISPATCH', () => {
				const resetState = jest.fn();
				devTools.subscribe = jest.fn((callback) => {
					callback({
						type: 'SOMETHING',
					});
				});
				installDevTools(
					() => {},
					resetState,
					{value: 1}
				);
				expect(resetState).not.toHaveBeenCalled();
			});

		});

	});

});
