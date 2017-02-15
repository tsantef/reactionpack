import { createStateContainer } from './state-container';

jest.mock('react');
const React = require('react');

describe('State Container', () => {

	beforeEach(function() {
		React.createClass.mockReset();
		React.createElement.mockReset();
	});

	describe('#createStateContainer', () => {

		it('root state _setState', () => {

			createStateContainer('SomeComponent');

			expect(React.createClass).toHaveBeenCalledTimes(1);

			const reactClass = React.createClass.mock.calls[0][0];
			reactClass.setState = jest.fn();

			const state = { myState: 4 };

			expect(reactClass._setState).toBeDefined();

			reactClass._setState(undefined, state);

			expect(reactClass.setState.mock.calls[0][0]).toEqual(state);

		});

		it('root state render', () => {

			createStateContainer('SomeComponent');

			expect(React.createClass).toHaveBeenCalledTimes(1);

			const reactClass = React.createClass.mock.calls[0][0];
			reactClass.state = {
				existing: 5,
				nested: {
					existing: 6,
				},
			};
			reactClass.setState = function(state) {
				this.state = state;
			};
			reactClass.createElement = jest.fn();

			expect(reactClass.render).toBeDefined();

			const state = { myState: 4 };

			reactClass._setState(undefined, state);
			reactClass.render();

			expect(React.createElement).toHaveBeenCalledWith('SomeComponent', { existing: 5, myState: 4, nested: { existing: 6 } });

		});

		it('nested state _setState', () => {

			createStateContainer('SomeComponent');

			expect(React.createClass).toHaveBeenCalledTimes(1);

			const reactClass = React.createClass.mock.calls[0][0];
			reactClass.setState = jest.fn();

			const state = { myState: 4 };

			expect(reactClass._setState).toBeDefined();

			reactClass._setState('nested', state);

			expect(reactClass.setState.mock.calls[0][0]).toEqual({ nested: state });

		});

		it('nested state render', () => {

			createStateContainer('SomeComponent');

			expect(React.createClass).toHaveBeenCalledTimes(1);

			const reactClass = React.createClass.mock.calls[0][0];
			reactClass.state = {
				existing: 5,
				nested: {
					existing: 6,
				},
			};
			reactClass.setState = function(state) {
				this.state = state;
			};
			reactClass.createElement = jest.fn();

			expect(reactClass.render).toBeDefined();

			const state = { myState: 4 };

			reactClass._setState('nested', state);
			reactClass.render();

			expect(React.createElement).toHaveBeenCalledTimes(1);
			expect(React.createElement).toHaveBeenCalledWith('SomeComponent', { existing: 5, nested: { existing: 6, ...state } });

		});

	});

});
