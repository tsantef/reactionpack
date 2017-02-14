import { connectToProps } from './connect';

jest.mock('react');
const React = require('react');

describe('Connect', () => {

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
