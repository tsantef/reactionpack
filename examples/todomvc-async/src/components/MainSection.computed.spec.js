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
				todosById: {
					1: {
						id: 1,
						completed: false,
					},
					2: {
						id: 2,
						completed: true,
					},
				},
			};

			const computed = createComputed(completedCount);

			expect(computed(state)).toEqual(1);

		});

	});

	describe('#activeCount', () => {

		it('should count incomplete todos', () => {

			const state = {
				todosById: {
					1: {
						id: 1,
						completed: false,
					},
					2: {
						id: 2,
						completed: true,
					},
					3: {
						id: 3,
						completed: false,
					},
				},
			};

			const computed = createComputed(activeCount);

			expect(computed(state)).toEqual(2);

		});
	});

	describe('#filteredTodos', () => {

		it('should show all', () => {

			const state = {
				filter: SHOW_ALL,
				todosById: {
					1: {
						id: 1,
						completed: false,
					},
					2: {
						id: 2,
						completed: true,
					},
					3: {
						id: 3,
						completed: false,
					},
				},
			};

			const computed = createComputed(filteredTodos);

			expect(computed(state)).toEqual([
				{
					completed: false,
					id: 1,
				},
				{
					completed: true,
					id: 2,
				},
				{
					completed: false,
					id: 3,
				},
			]);
		});

		it('should show completed', () => {

			const state = {
				filter: SHOW_COMPLETED,
				todosById: {
					1: {
						id: 1,
						completed: false,
					},
					2: {
						id: 2,
						completed: true,
					},
					3: {
						id: 3,
						completed: false,
					},
				},
			};

			const computed = createComputed(filteredTodos);

			expect(computed(state)).toEqual([
				{
					completed: true,
					id: 2,
				},
			]);

		});

	});

	it('should show active', () => {

		const state = {
			filter: SHOW_ACTIVE,
			todosById: {
				1: {
					id: 1,
					completed: false,
				},
				2: {
					id: 2,
					completed: true,
				},
				3: {
					id: 3,
					completed: false,
				},
			},
		};

		const computed = createComputed(filteredTodos);

		expect(computed(state)).toEqual([
			{
				completed: false,
				id: 1,
			},
			{
				completed: false,
				id: 3,
			},
		]);

	});

});
