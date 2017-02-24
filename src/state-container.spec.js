import React from 'react';
import renderer from 'react-test-renderer';
import { connectToProps } from './connect';
import { createStateContainer } from './state-container';

describe('State Container', () => {

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
					<BoundComponent stateName='name1' />
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

});
