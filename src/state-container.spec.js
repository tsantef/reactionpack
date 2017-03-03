import React from 'react';
import renderer from 'react-test-renderer';
import { connectToProps } from './connect';
import { createStateContainer } from './state-container';

describe('State Container', () => {

	describe('#installDevTools', () => {

		it('should support installDevTools', () => {

			const onNextState = jest.fn();
			let resetState;

			const actions = {
				changeMyState: (state) => {
					return { prop1: 'hi' };
				},
			};

			const Component = React.createClass({
				render() {
					return (
						<div {...this.props}></div>
					);
				},
			});

			const BoundComponent = connectToProps(Component, actions);

			const StateContainer = createStateContainer(BoundComponent);

			const installDevTools = (registerOnNextState, registerResetState) => {
				registerOnNextState(onNextState);
				resetState = registerResetState;
			};

			const component = renderer.create(
				<StateContainer installDevTools={installDevTools}></StateContainer>
			);

			expect(onNextState).toHaveBeenCalledTimes(0);

			const tree = component.toJSON();
			const props = tree.props;
			props.changeMyState();

			expect(onNextState).toHaveBeenCalledWith({
				prop1: 'hi',
			}, 'changeMyState');

			resetState({here: 1});

		});

	});

	describe('#onNextState', () => {

		it('should call onNextState prop', () => {

			const onNextState = jest.fn();

			const actions = {
				changeMyState: (state) => {
					return { prop1: 'hi' };
				},
			};

			const Component = React.createClass({
				render() {
					return (
						<div {...this.props}></div>
					);
				},
			});

			const BoundComponent = connectToProps(Component, actions);

			const StateContainer = createStateContainer(BoundComponent);

			const component = renderer.create(
				<StateContainer onNextState={onNextState}></StateContainer>
			);

			expect(onNextState).toHaveBeenCalledTimes(0);

			const tree = component.toJSON();
			const props = tree.props;
			props.changeMyState();

			expect(onNextState).toHaveBeenCalledWith({
				prop1: 'hi',
			}, 'changeMyState');

		});

	});

	describe('#_getState', () => {

		it('should support state paths', () => {

			const onNextState = jest.fn();

			const actions = {
				changeMyState: (state) => {
					return { prop1: 'hi' };
				},
			};

			const Component = React.createClass({
				render() {
					return (
						<div {...this.props}></div>
					);
				},
			});

			const BoundComponent = connectToProps(Component, actions);

			const App = () => {
				return (
					<BoundComponent statePath='name1' />
				);
			};

			const StateContainer = createStateContainer(App);

			const component = renderer.create(
				<StateContainer onNextState={onNextState}></StateContainer>
			);

			expect(onNextState).toHaveBeenCalledTimes(0);

			const tree = component.toJSON();
			const props = tree.props;
			props.changeMyState();

			expect(onNextState).toHaveBeenCalledWith({
				name1: { prop1: 'hi'},
			}, 'changeMyState');

		});

	});

	describe('#createStateContainer', () => {

		describe('Initial State', () => {

			it('should accept initial state', () => {

				const initialState = {
					notMapped: 1,
					mappedPropFromInitialState: 2,
					nested: {
						mappedPropFromInitialState: 3,
					},
				};

				const actions = {
					changeMyState: (state) => {
						return { prop1: 'hi' };
					},
				};

				const Component = React.createClass({
					propTypes: {
						mappedToProp: React.PropTypes.string,
						mappedPropFromInitialState: React.PropTypes.number,
					},
					render() {
						return (
							<div {...this.props}></div>
						);
					},
				});

				const BoundComponent = connectToProps(Component, actions);

				const StateContainer = createStateContainer(BoundComponent, initialState);

				const component = renderer.create(
					<StateContainer />
				);

				const tree = component.toJSON();
				tree.props.changeMyState = tree.props.changeMyState ? 'wrappedAction' : null;
				expect(tree.props).toEqual({
					changeMyState: 'wrappedAction',
					mappedPropFromInitialState: 2,
				});
			});

		});

	});

});
