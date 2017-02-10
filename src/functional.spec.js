import _ from 'lodash';
import React from 'react';
import renderer from 'react-test-renderer';

const { createStateContainer } = require('./state-container');

const {
	func,
	number,
	object,
	string,
} = React.PropTypes;

const {
	connectToProps,
} = require('./actions');

describe('Functional', () => {

	it('Should overide props with computeds and actions', () => {

		const rootAction1 = function rootAction1() {};
		const rootComputed1 = [
			() => 1,
			() => {
				return 'rootComputed1';
			},
		];

		const actions = {
			rootAction1: rootAction1,
			actionOverrided: rootAction1,
			actionPropOverrided: rootAction1,
			nested: {
				rootAction1: rootAction1,
				actionOverrided: rootAction1,
			},
		};

		const computeds = {
			rootComputed1: rootComputed1,
			computedOverrided: rootComputed1,
			computedPropOverrided: rootComputed1,
			nested: {
				rootComputed1: rootComputed1,
				computedOverrided: rootComputed1,
				computedPropOverrided: rootComputed1,
			},
		};

		const App = React.createClass({
			propTypes: {
				prop1: string,
				actionOverrided: func,
				actionPropOverrided: string,
				computedOverrided: string,
				computedPropOverrided: string,
				defaultProp1: string,
				nested: object,
				propOverrided: string,
				rootAction1: func,
				rootComputed1: string,
			},

			getDefaultProps: () => ({
				prop1: 'prop',
				defaultProp1: 'defaultProp1',
				actionOverrided: 'actionOverrided',
				computedOverrided: 'computedOverrided',
				propOverrided: 'propOverrided',
				nested: {
					nestedProp1: 'nestedProp1',
					actionOverrided: 'actionOverrided',
					computedOverrided: 'computedOverrided',
					propOverrided: 'propOverrided',
				},
			}),

			render() {
				return (
					<div {... this.props}></div>
				);
			},
		});

		const BoundApp = connectToProps(App, actions, computeds);

		const WrappedComponent = createStateContainer(BoundApp);

		const initialProps = {
			prop1: 'initialProp1',
			propOverrided: 'fromProps',
			actionPropOverrided: 'actionFromProps',
			computedPropOverrided: 'computedFromProps',
			nested: {
				nProp1: 'nProp1',
				propOverrided: 'fromProps',
				actionPropOverrided: 'actionFromProps',
				computedPropOverrided: 'computedFromProps',
			},
		};

		const component = renderer.create(
			<WrappedComponent {...initialProps}></WrappedComponent>
		);

		const tree = component.toJSON();
		const props = tree.props;
		props.rootAction1 = _.get(props, 'rootAction1.name');
		props.actionOverrided = _.get(props, 'actionOverrided.name');
		props.nested.rootAction1 = _.get(props, 'nested.rootAction1.name');
		props.nested.actionOverrided = _.get(props, 'nested.actionOverrided.name');

		expect(props).toEqual({
			// Default Props
			defaultProp1: 'defaultProp1',
			actionOverrided: 'wrappedAction',
			computedOverrided: 'rootComputed1',
			propOverrided: 'fromProps',

			// Actions
			rootAction1: 'wrappedAction',
			actionPropOverrided: 'actionFromProps',

			// Computeds
			rootComputed1: 'rootComputed1',
			computedPropOverrided: 'computedFromProps',

			// Props
			prop1: 'initialProp1',

			// Nested
			nested: {
				// Default Props
				nestedProp1: 'nestedProp1',
				actionOverrided: 'wrappedAction',
				computedOverrided: 'rootComputed1',
				propOverrided: 'fromProps',

				// Actions
				rootAction1: 'wrappedAction',
				actionPropOverrided: 'actionFromProps',

				// Computeds
				rootComputed1: 'rootComputed1',
				computedPropOverrided: 'computedFromProps',

				// Props
				nProp1: 'nProp1',
			},
		});

	});

	it('composed', () => {

		const pageActions = {
			onUpVote: function onUpVote(state) {
				return {
					...state,
					vote: state.vote + 1,
				};
			},
		};

		const PageComponent = connectToProps(React.createClass({
			propTypes: {
				vote: number,
				onUpVote: func,
			},

			getDefaultProps() {
				return {
					vote: 1,
				};
			},

			render() {
				const {
					vote,
					onUpVote,
				} = this.props;
				return (
					<div id='Page' onClick={onUpVote}>
						<span>{'vote:' + vote}</span>
					</div>
				);
			},
		}), pageActions);

		const appActions = {
			onSearchText: function onUpVote(state, value) {
				return {
					...state,
					searchText: value,
				};
			},
		};

		const appComputeds = {
			testComputed: [
				(state) => state.searchText,
				(searchText) => {
					return searchText + '-computed';
				},
			],
		};

		const appActionDefault = function appActionDefault() {};

		const App = connectToProps(React.createClass({
			propTypes: {
				prop1: string,
				searchText: string,
				testComputed: string,
				onSearchText: func,
			},

			getDefaultProps() {
				return {
					prop1: 'defaultProp1',
					searchText: 'defaultSearchText',
					testComputed: 'defaultTestComputed',
					onSearchText: appActionDefault,
				};
			},

			render() {
				const {
					searchText,
					testComputed,
					onSearchText,
				} = this.props;

				return (
					<div id='App' onClick={onSearchText}>
						<PageComponent />
						<span>{'searchText:' + searchText}</span>
						<span>{'testComputed:' + testComputed}</span>
					</div>
				);
			},
		}), appActions, appComputeds);

		const WrappedComponent = createStateContainer(App);

		const component = renderer.create(
			<WrappedComponent prop1='initialProp1'></WrappedComponent>
		);

		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();

		// Change state from wrapper
		tree.props.onClick('test');
		tree = component.toJSON();
		expect(tree).toMatchSnapshot();

		// Change state from inner
		tree.children[0].props.onClick();
		tree = component.toJSON();
		expect(tree).toMatchSnapshot();

		// Change state from wrapper
		tree.props.onClick('done');
		tree = component.toJSON();
		expect(tree).toMatchSnapshot();

		// Change state from wrapper
		tree.props.onClick('vet');
		tree = component.toJSON();
		expect(tree).toMatchSnapshot();

	});

});
