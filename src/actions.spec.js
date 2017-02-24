import _ from 'lodash';
import React from 'react';
import renderer from 'react-test-renderer';

import {
	bindActions,
	mockActions,
} from './actions';
import { connectToProps } from './connect';
import { createStateContainer } from './state-container';

describe('Actions', () => {

	describe('#bindActions', () => {

		it('root function', () => {

			const _this = {
				context: {
					getState: jest.fn(),
					setState: jest.fn(),
				},
				state: {
					__defaults: {},
					__propTypeKeys: ['value1'],
					__actionKeys: [],
					__computedKeys: [],
				},
				props: {
					value1: 4,
				},
			};

			const boundActions = bindActions(_this, {
				myAction: (state, value) => {
					expect(state).toEqual(_this.props);
					expect(value).toEqual(5);
					return { myState: 6 };
				},
			});
			boundActions.myAction(5);

			expect(_this.context.setState).toHaveBeenCalledWith([undefined, undefined, undefined, undefined], { myState: 6 }, 'myAction');

		});

		describe('context', () => {

			describe('#getState', () => {

				it('should existing in action context', () => {
					const _this = {
						state: {
							__defaults: {},
							__propTypeKeys: [],
							__actionKeys: [],
							__computedKeys: [],
						},
						context: {
							getState: jest.fn(),
							setState: jest.fn(),
						},
					};

					const boundActions = bindActions(_this, {
						myAction: function(state, value) {
							expect(this.getState).toBeDefined();
						},
					});

					boundActions.myAction();
				});

			});

			describe('#getComputed', () => {

				it('should existing in action context', () => {
					const _this = {
						context: {
							getState: jest.fn(),
							setState: jest.fn(),
						},
						state: {
							__propTypeKeys: [],
							__actionKeys: [],
							__computedKeys: [],
							__defaults: {
								value1: 'd1',
							},
							__computed: {
								value1: 'c1',
							},
						},
					};

					const boundActions = bindActions(_this, {
						myAction: function(state, value) {
							expect(this.getComputed).toBeDefined();
							expect(this.getComputed()).toEqual({ value1: 'c1' });
						},
					});

					boundActions.myAction();

				});

			});

			describe('#getActions', () => {

				it('should existing in action context', () => {

					const _this = {
						state: {
							__propTypeKeys: [],
							__actionKeys: [],
							__computedKeys: [],
						},
						context: {
							getState: jest.fn(),
							setState: jest.fn(),
						},
					};

					const boundActions = bindActions(_this, {
						myAction: function(state, value) {
							expect(this.getActions).toBeDefined();
							expect(this.getActions().myAction.name).toEqual('bound wrappedAction');
						},
					});

					boundActions.myAction();

				});

			});

			it('#getDefaults', () => {

				const _this = {
					context: {
						getState: jest.fn(),
						setState: jest.fn(),
					},
					state: {
						__propTypeKeys: [],
						__actionKeys: [],
						__computedKeys: [],
						__defaults: {
							value1: 'd1',
						},
						__computed: {
							value1: 'c1',
						},
					},
				};

				const boundActions = bindActions(_this, {
					myAction: function(state, value) {
						expect(this.getDefaults).toBeDefined();
						expect(this.getDefaults()).toEqual({ value1: 'd1' });
					},
				});

				boundActions.myAction();

			});

		});

		it('nested function', () => {

			const _this = {
				state: {
					__propKeys: [],
					__propTypeKeys: ['value2'],
					__actionKeys: [],
					__computedKeys: [],
				},
				context: {
					getState: jest.fn(),
					setState: jest.fn(),
				},
				props: {
					value1: 4,
					nest: {
						value2: 3,
					},
				},
			};

			const boundActions = bindActions(_this, {
				nest: {
					myAction: (state, value) => {
						expect(state).toEqual(_this.props.nest);
						expect(value).toEqual(5);
						return { myState: 6 };
					},
				},
			});

			boundActions.nest.myAction(5);

			expect(_this.context.setState).toHaveBeenCalledWith([undefined, undefined, undefined, 'nest'], { myState: 6 }, 'myAction');

		});

	});

	describe('wrappedAction', () => {

		it('should resolve return object', () => {

			const actions = {
				action1: () => {
					return { prop1: 'action1' };
				},
			};

			const Component = (props) => {
				return (
					<div {...props}></div>
				);
			};

			Component.propTypes = {
				prop1: React.PropTypes.string,
			};

			const BoundComponent = connectToProps(Component, actions);

			const StateContainer = createStateContainer(BoundComponent);

			const component = renderer.create(
				<StateContainer></StateContainer>
			);

			let tree = component.toJSON();
			let props = tree.props;

			props.action1();

			tree = component.toJSON();
			props = tree.props;

			expect(_.omit(props, 'action1')).toEqual({ prop1: 'action1' });

		});

		it('should allow null', () => {

			const actions = {
				action1: () => {
					return null;
				},
			};

			const Component = (props) => {
				return (
					<div {...props}></div>
				);
			};

			Component.propTypes = {
				prop1: React.PropTypes.string,
			};

			const BoundComponent = connectToProps(Component, actions);

			const StateContainer = createStateContainer(BoundComponent);

			const component = renderer.create(
				<StateContainer></StateContainer>
			);

			let tree = component.toJSON();
			let props = tree.props;

			props.action1();

			tree = component.toJSON();
			props = tree.props;

			expect(_.omit(props, 'action1')).toEqual({});

		});

		it('should reject invalid action', () => {

			const actions = {
				action1: 5,
			};

			const Component = (props) => {
				return (
					<div {...props}></div>
				);
			};

			Component.propTypes = {
				prop1: React.PropTypes.string,
			};

			const BoundComponent = connectToProps(Component, actions);

			const StateContainer = createStateContainer(BoundComponent);

			expect(() => {
				renderer.create(
					<StateContainer></StateContainer>
				);
			}).toThrowErrorMatchingSnapshot();

		});

		describe('promised state', () => {

			it('should resolve promise state', () => {

				const actions = {
					action1: () => {
						return Promise.resolve({ resolvedProp1: 'resolvedProp' });
					},
				};

				const Component = (props) => {
					return (
						<div {...props}></div>
					);
				};

				Component.propTypes = {
					resolvedProp1: React.PropTypes.string,
				};

				const BoundComponent = connectToProps(Component, actions);

				const StateContainer = createStateContainer(BoundComponent);

				const component = renderer.create(
					<StateContainer></StateContainer>
				);

				let tree = component.toJSON();
				let props = tree.props;

				return props.action1().then(() => {
					tree = component.toJSON();
					props = tree.props;
					return expect(_.omit(props, 'action1')).toEqual({ resolvedProp1: 'resolvedProp' });
				});

			});

			it('should resolve only last action call', () => {

				function returnFirst() {
					return new Promise((resolve) => {
						setTimeout(() => {
							resolve({ resolvedProp1: 1 });
						}, 10);
					});
				}

				function returnSecond() {
					return new Promise((resolve) => {
						setTimeout(() => {
							resolve({ resolvedProp1: 2 });
						}, 500);
					});
				}

				const functionQueue = [returnFirst, returnSecond];

				const actions = {
					action1: () => {
						return functionQueue.shift()();
					},
				};

				const Component = (props) => {
					return (
						<div {...props}></div>
					);
				};

				Component.propTypes = {
					resolvedProp1: React.PropTypes.number,
				};

				const BoundComponent = connectToProps(Component, actions);

				const StateContainer = createStateContainer(BoundComponent);

				const component = renderer.create(
					<StateContainer></StateContainer>
				);

				let tree = component.toJSON();
				let props = tree.props;

				return Promise.all([
					props.action1(),
					props.action1(),
				]).then(() => {
					tree = component.toJSON();
					props = tree.props;
					return expect(_.omit(props, 'action1')).toEqual({ resolvedProp1: 2 });
				});

			});

		});

	});

	describe('#mockActions', () => {

		it('should mock an action', () => {

			const actions = {
				action1: jest.fn(function(state) {
					return {
						...state,
						value1: 5,
					};
				}),
			};

			const computeds = {};

			const mocked = mockActions(actions, computeds);
			expect(mocked.action1).toBeDefined();

			const result = mocked.action1();
			expect(result.then).toBeDefined();

			return result.then((value) => {
				expect(value).toEqual({ value1: 5 });
				return null;
			});

		});

		it('should default computeds', () => {

			let computeds;

			const actions = {
				action1: jest.fn(function() { computeds = this.getComputed(); }),
			};

			const mocked = mockActions(actions);
			expect(mocked.action1).toBeDefined();

			const result = mocked.action1();
			expect(result.then).toBeDefined();

			return result.then(() => {
				expect(computeds).toEqual({});
				return null;
			});

		});

	});

});
