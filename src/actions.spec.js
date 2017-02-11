jest.mock('react');

const React = require('react');

const {
	bindActions,
	connectToProps,
} = require('./actions');

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

			expect(_this.context.setState).toHaveBeenCalledWith(undefined, { myState: 6 }, 'myAction');

		});

		describe('context', () => {

			it('#getState', () => {

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

			it('#getComputed', () => {

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

			it('#getActions', () => {

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
					},
				});

				boundActions.myAction();

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

			expect(_this.context.setState).toHaveBeenCalledWith('nest', { myState: 6 }, 'myAction');

		});

	});

	describe('#connectToProps', () => {

		beforeEach(function() {
			React.createClass.mockReset();
			React.createElement.mockReset();
		});

		it('getDefaults', () => {

			const wrappedComponent = {
				getDefaultProps: () => ({
					defaultProp1: 'defaultProp1',
				}),
			};
			const actions = {
				rootAction1: function(state) {
					expect(this.getDefaults()).toEqual({ defaultProp1: 'defaultProp1' });
				},
			};
			connectToProps(wrappedComponent, actions);

			const reactClass = React.createClass.mock.calls[0][0];
			reactClass.setState = function(state) {
				this.state = {
					...this.state,
					...state,
				};
			};
			reactClass.props = {
				prop1: 'prop1',
			};
			reactClass.context = {
				getState: jest.fn(),
				setState: jest.fn(),
			};
			reactClass.state = reactClass.getInitialState();
			reactClass.componentWillMount();

			expect(reactClass.render).toBeDefined();

			reactClass.render();

			expect(React.createElement).toHaveBeenCalledTimes(1);
			const props = React.createElement.mock.calls[0][1];
			props.rootAction1();

		});

	});

});
