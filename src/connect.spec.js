import _ from 'lodash';
import React from 'react';
import renderer from 'react-test-renderer';
import { connectToProps } from './connect';
import { createStateContainer } from './state-container';

describe('Connect', () => {

	describe('#connectToProps', () => {

		it('Should pass default prop through', () => {

			const Component = React.createClass({
				getDefaultProps: () => ({
					defaultProp1: 'defaultProp1',
				}),

				render() {
					return (
						<div {...this.props}></div>
					);
				},
			});

			const BoundComponent = connectToProps(Component);

			const StateContainer = createStateContainer(BoundComponent);

			const component = renderer.create(
				<StateContainer></StateContainer>
			);

			const tree = component.toJSON();
			const props = tree.props;

			expect(props).toEqual({ defaultProp1: 'defaultProp1' });

		});

		it('Should override default prop with action', () => {

			const Component = React.createClass({
				propTypes: {
					defaultProp1: React.PropTypes.func,
					prop2: React.PropTypes.string,
				},

				getDefaultProps: () => ({
					defaultProp1: 'defaultProp1',
					prop2: 'prop2',
				}),

				render() {
					return (
						<div {...this.props}></div>
					);
				},
			});

			const actions = {
				defaultProp1: () => ({ prop2: 'action1' }),
			};

			const BoundComponent = connectToProps(Component, actions);

			const StateContainer = createStateContainer(BoundComponent);

			const component = renderer.create(
				<StateContainer></StateContainer>
			);

			let tree = component.toJSON();
			tree.props.defaultProp1();

			tree = component.toJSON();

			expect(_.omit(tree.props, 'defaultProp1')).toEqual({ prop2: 'action1' });

		});


		it('Should override default prop with computed', () => {

			const Component = React.createClass({
				render() {
					return (
						<div {...this.props}></div>
					);
				},
			});

			const computed = {
				defaultProp1: [
					() => 5,
					() => 'computed1',
				],
			};

			const BoundComponent = connectToProps(Component, null, computed);

			const StateContainer = createStateContainer(BoundComponent);

			const component = renderer.create(
				<StateContainer></StateContainer>
			);

			const tree = component.toJSON();
			const props = tree.props;

			expect(props).toEqual({ defaultProp1: 'computed1' });

		});

		// beforeEach(function() {
		// 	React.createClass.mockReset();
		// 	React.createElement.mockReset();
		// });
		//
		// it('getDefaults', () => {
		//
		// 	const wrappedComponent = {
		// 		getDefaultProps: () => ({
		// 			defaultProp1: 'defaultProp1',
		// 		}),
		// 	};
		//
		// 	const actions = {
		// 		rootAction1: function(state) {
		// 			expect(this.getDefaults()).toEqual({ defaultProp1: 'defaultProp1' });
		// 		},
		// 	};
		//
		// 	connectToProps(wrappedComponent, actions);
		//
		// 	const reactClass = React.createClass.mock.calls[0][0];
		// 	reactClass.setState = function(state) {
		// 		this.state = {
		// 			...this.state,
		// 			...state,
		// 		};
		// 	};
		// 	reactClass.props = {
		// 		prop1: 'prop1',
		// 	};
		// 	reactClass.context = {
		// 		getState: jest.fn(),
		// 		setState: jest.fn(),
		// 	};
		// 	reactClass.state = reactClass.getInitialState();
		// 	reactClass.componentWillMount();
		//
		// 	expect(reactClass.render).toBeDefined();
		//
		// 	reactClass.render();
		//
		// 	expect(React.createElement).toHaveBeenCalledTimes(1);
		// 	const props = React.createElement.mock.calls[0][1];
		// 	props.rootAction1();
		//
		// });

	});

});
