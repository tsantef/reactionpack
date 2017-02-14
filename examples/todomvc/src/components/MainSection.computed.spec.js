import {
	createComputed,
} from '../../../../src/computed';
//} from 'reactionpack/computed';

import {
	SHOW_ALL,
	SHOW_COMPLETED,
	SHOW_ACTIVE,
} from '../constants/TodoFilters';

import {
	completedCount,
	activeCount,
	filteredTodos,
} from './MainSection.computed';

describe('MainSection Computeds', () => {

	describe('#completedCount', () => {

		it('should count completed todos', () => {

			const state = {
				todos: [{
					id: 1,
					completed: false,
				}, {
					id: 2,
					completed: true,
				}],
			};

			const computed = createComputed(completedCount);

			expect(computed(state)).toEqual(1);

		});

	});

	describe('#activeCount', () => {

		it('should count incomplete todos', () => {

			const state = {
				todos: [{
					id: 1,
					completed: false,
				}, {
					id: 2,
					completed: true,
				}, {
					id: 3,
					completed: false,
				}],
			};

			const computed = createComputed(activeCount);

			expect(computed(state)).toEqual(2);

		});
	});

	describe('#filteredTodos', () => {

		it('should show all', () => {

			const state = {
				filter: SHOW_ALL,
				todos: [{
					id: 1,
					completed: false,
				}, {
					id: 2,
					completed: true,
				}, {
					id: 3,
					completed: false,
				}],
			};

			const computed = createComputed(filteredTodos);

			expect(computed(state)).toEqual([{
				completed: false,
				id: 1,
			}, {
				completed: true,
				id: 2,
			}, {
				completed: false,
				id: 3,
			}]);

		});

		it('should show completed', () => {

			const state = {
				filter: SHOW_COMPLETED,
				todos: [{
					id: 1,
					completed: false,
				}, {
					id: 2,
					completed: true,
				}, {
					id: 3,
					completed: false,
				}],
			};

			const computed = createComputed(filteredTodos);

			expect(computed(state)).toEqual([{
				completed: true,
				id: 2,
			}]);

		});

	});

	it('should show active', () => {

		const state = {
			filter: SHOW_ACTIVE,
			todos: [{
				id: 1,
				completed: false,
			}, {
				id: 2,
				completed: true,
			}, {
				id: 3,
				completed: false,
			}],
		};

		const computed = createComputed(filteredTodos);

		expect(computed(state)).toEqual([{
			completed: false,
			id: 1,
		}, {
			completed: false,
			id: 3,
		}]);

	});

});
