import {
	onBeginEdit,
	onTextChange,
	onSaveTodo,
	onCompleteTodo,
	onDeleteTodo,
	onCompleteAll,
	onClearCompleted,
	onSetFilter,
} from './MainSection.actions';

import { SHOW_ALL, SHOW_COMPLETED } from '../constants/TodoFilters';

describe('MainSection Actions', () => {

	describe('#onBeginEdit', () => {

		it('should begin edit on todo', () => {
			const state = {
				todos: [{
					id: 1,
					completed: false,
					text: 'Some todo',
					editing: false,
				}],
			};

			const result = onBeginEdit(state, {
				id: 1,
			});

			expect(result).toEqual({
				todos: [{
					id: 1,
					completed: false,
					text: 'Some todo',
					editText: 'Some todo',
					editing: true,
				}],
			});
		});

	});

	describe('#onTextChange', () => {

		it('should update edit text', () => {
			const state = {
				todos: [{
					id: 1,
					completed: false,
					text: 'Some todo',
					editing: true,
				}],
			};

			const result = onTextChange(state, {
				id: 1,
			}, 'New text');

			expect(result).toEqual({
				todos: [{
					id: 1,
					completed: false,
					text: 'Some todo',
					editText: 'New text',
					editing: true,
				}],
			});
		});

	});

	describe('#onSaveTodo', () => {

		it('should save todo text and turn of edit', () => {
			const state = {
				todos: [{
					id: 1,
					completed: false,
					text: 'Some todo',
					editing: true,
				}],
			};

			const result = onSaveTodo(state, {
				id: 1,
			}, 'New text');

			expect(result).toEqual({
				todos: [{
					id: 1,
					completed: false,
					text: 'New text',
					editText: null,
					editing: false,
				}],
			});
		});

	});

	describe('#onCompleteTodo', () => {

		it('should mark todo as complete', () => {
			const state = {
				todos: [{
					id: 1,
					completed: false,
					text: 'Some todo',
					editText: null,
					editing: false,
				}],
			};

			const result = onCompleteTodo(state, {
				id: 1,
			});

			expect(result).toEqual({
				todos: [{
					id: 1,
					completed: true,
					text: 'Some todo',
					editText: null,
					editing: false,
				}],
			});
		});

	});

	describe('#onDeleteTodo', () => {

		it('should delete todo', () => {
			const state = {
				todos: [{
					id: 1,
					completed: false,
					text: 'Some todo',
					editText: null,
					editing: false,
				}],
			};

			const result = onDeleteTodo(state, {
				id: 1,
			});

			expect(result).toEqual({
				todos: [],
			});
		});

	});

	describe('#onCompleteAll', () => {

		it('should mark all todos as complete', () => {
			const state = {
				todos: [{
					id: 1,
					completed: false,
				}, {
					id: 2,
					completed: false,
				}],
			};

			const result = onCompleteAll(state);

			expect(result).toEqual({
				todos: [{
					id: 1,
					completed: true,
				}, {
					id: 2,
					completed: true,
				}],
			});
		});

	});

	describe('#onClearCompleted', () => {

		it('should delete all completed todos', () => {
			const state = {
				todos: [{
					id: 1,
					completed: true,
				}, {
					id: 2,
					completed: true,
				}, {
					id: 3,
					completed: false,
				}],
			};

			const result = onClearCompleted(state);

			expect(result).toEqual({
				todos: [{
					id: 3,
					completed: false,
				}],
			});
		});

	});

	describe('#onSetFilter', () => {

		it('should begin edit on todo', () => {
			const state = {
				'filter': SHOW_ALL,
			};

			const result = onSetFilter(state, SHOW_COMPLETED);

			expect(result).toEqual({
				'filter': SHOW_COMPLETED,
			});
		});

	});

});
