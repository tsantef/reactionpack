import {
	onBeginEdit,
	onEndEdit,
	onTextChange,
	beginSaveTodo,
	endSaveTodo,
	saveTodo,
	beginCompleteAll,
	endCompleteAll,
	onClearCompleted,
	onSetFilter,
} from './MainSection.actions';

import * as actions from './MainSection.actions';

import { mockActions } from 'reactionpack';

import { SHOW_ALL, SHOW_COMPLETED } from '../constants/TodoFilters';

jest.mock('../util');
const mockUtil = require('../util');

describe('MainSection Actions', () => {

	beforeEach(() => {
		mockUtil.fakeApi = jest.fn((obj) => Promise.resolve(obj));
	});

	describe('#onBeginEdit', () => {

		it('should begin edit on todo', () => {
			const todo = {
				id: 1,
				completed: false,
				text: 'Some todo',
				editText: null,
				editing: false,
			};

			const state = {
				todosById: {
					1: todo,
				},
			};

			const result = onBeginEdit(state, todo);

			expect(result).toEqual({
				todosById: {
					1: {
						id: 1,
						completed: false,
						text: 'Some todo',
						editText: 'Some todo',
						editing: true,
					},
				},
			});
		});

	});

	describe('#onEndEdit', () => {

		it('should end edit on todo', () => {
			const todo = {
				id: 1,
				completed: false,
				text: 'Some tod',
				editText: 'Some todo',
				editing: true,
			};

			const state = {
				todosById: {
					1: todo,
				},
			};

			const onSaveTodo  = jest.fn(() => (Promise.resolve(state)));

			const context = {
				getActions: () => ({
					onSaveTodo,
				}),
			};

			return onEndEdit.bind(context)(state, todo).then((result) => {
				return expect(result).toEqual({
					todosById: {
						1: {
							id: 1,
							completed: false,
							text: 'Some todo',
							editText: null,
							editing: false,
						},
					},
				});
			});

		});

	});

	describe('#onTextChange', () => {

		it('should update edit text', () => {
			const todo = {
				id: 1,
				completed: false,
				text: 'Some todo',
				editing: true,
			};

			const state = {
				todosById: {
					1: todo,
				},
			};

			const result = onTextChange(state, todo, 'New text');

			expect(result).toEqual({
				todosById: {
					1: {
						id: 1,
						completed: false,
						text: 'Some todo',
						editText: 'New text',
						editing: true,
					},
				},
			});
		});

	});

	describe('#beginSaveTodo', () => {

		it('should begin edit on todo', () => {
			const todo = {
				id: 1,
				completed: false,
				text: 'Some todo',
				editText: null,
				editing: true,
			};

			const state = {
				todosById: {
					1: todo,
				},
			};

			const result = beginSaveTodo(state, todo);

			expect(result).toEqual({
				todosById: {
					1: {
						id: 1,
						completed: false,
						text: 'Some todo',
						editText: null,
						editing: true,
						isLoading: true,
					},
				},
			});
		});

	});

	describe('#endSaveTodo', () => {

		it('should begin edit on todo', () => {
			const todo = {
				id: 1,
				completed: false,
				text: 'Some todo',
				editText: null,
				editing: true,
			};

			const state = {
				todosById: {
					1: todo,
				},
			};

			const result = endSaveTodo(state, todo);

			expect(result).toEqual({
				todosById: {
					1: {
						id: 1,
						completed: false,
						text: 'Some todo',
						editText: null,
						editing: true,
						isLoading: false,
					},
				},
			});
		});

	});

	describe('#saveTodo', () => {

		it('should save todo', () => {
			const todo = {
				id: 1,
				completed: false,
				text: 'Some todo',
				editText: null,
				editing: false,
			};

			const state = {
				todosById: {
					1: todo,
				},
			};

			const result = saveTodo(state, todo);

			expect(result).toEqual({
				todosById: {
					1: {
						id: 1,
						completed: false,
						text: 'Some todo',
						editText: null,
						editing: false,
					},
				},
			});
		});

	});

	describe('#onSaveTodo', () => {

		it('should save todo text and turn of edit', () => {
			const todo = {
				id: 1,
				completed: false,
				text: 'Some todo',
				editing: false,
			};

			const mockedActions = mockActions(actions);
			mockedActions.saveTodo = jest.fn(() => Promise.resolve({}));

			return mockedActions.onSaveTodo(todo).then((result) => {
				return expect(mockedActions.saveTodo).toBeCalledWith(todo);
			});
		});

	});

	describe('#onDeleteTodo', () => {

		it('should delete todo', () => {
			const todo = {
				id: 1,
				completed: false,
				text: 'Some todo',
				editing: false,
			};

			const mockedActions = mockActions(actions);
			mockedActions.beginSaveTodo = jest.fn(() => Promise.resolve({}));

			return mockedActions.onDeleteTodo(todo).then((result) => {
				expect(mockedActions.beginSaveTodo).toBeCalledWith(todo);
				expect(mockUtil.fakeApi).toBeCalledWith(todo);
				return null;
			});
		});

	});

	describe('#onCompleteTodo', () => {

		it('should mark todo as complete', () => {
			const todo = {
				id: 1,
				completed: false,
				text: 'Some todo',
				editText: null,
				editing: false,
			};

			const mockedActions = mockActions(actions);
			mockedActions.saveTodo = jest.fn(() => Promise.resolve({}));

			return mockedActions.onCompleteTodo(todo).then((result) => {
				return expect(mockedActions.saveTodo).toBeCalledWith({
					...todo,
					completed: true,
				});
			});

		});

	});

	describe('#beginCompleteAll', () => {

		it('should begin edit on todo', () => {
			const todo = {
				id: 1,
				completed: false,
				text: 'Some todo',
				editText: null,
				editing: true,
				isLoading: false,
			};

			const state = {
				todosById: {
					1: todo,
				},
			};

			const result = beginCompleteAll(state, todo);

			expect(result).toEqual({
				todosById: {
					1: {
						...todo,
						isLoading: true,
					},
				},
			});
		});

	});

	describe('#endCompleteAll', () => {

		it('should begin edit on todo', () => {
			const todo = {
				id: 1,
				completed: false,
				text: 'Some todo',
				editText: null,
				editing: true,
				isLoading: true,
			};

			const state = {
				todosById: {
					1: todo,
				},
			};

			const result = endCompleteAll(state, todo);

			expect(result).toEqual({
				todosById: {
					1: {
						...todo,
						isLoading: false,
					},
				},
			});
		});

	});

	describe('#onCompleteAll', () => {

		it('should mark all todos as complete', () => {
			const todo = {
				id: 1,
				completed: false,
				text: 'Some todo',
				editText: null,
				editing: false,
			};

			const computeds = {
				completedCount: 1,
				todos: [todo],
			};

			const mockedActions = mockActions(actions, computeds);
			mockedActions.beginCompleteAll = jest.fn(() => Promise.resolve({}));
			mockedActions.completeAll = jest.fn(() => Promise.resolve({}));
			mockedActions.endCompleteAll = jest.fn(() => Promise.resolve({}));

			return mockedActions.onCompleteAll(todo).then((result) => {
				expect(mockedActions.beginCompleteAll).toHaveBeenCalledTimes(1);
				expect(mockUtil.fakeApi).toHaveBeenCalledWith([todo]);
				expect(mockedActions.completeAll).toHaveBeenCalledWith(false);
				expect(mockedActions.endCompleteAll).toHaveBeenCalledTimes(1);
				return null;
			});
		});

	});

	describe('#onClearCompleted', () => {

		it('should delete all completed todos', () => {
			const state = {
				todosById: {
					1: {
						id: 1,
						completed: true,
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

			const result = onClearCompleted(state);

			expect(result).toEqual({
				todosById: {
					3: {
						id: 3,
						completed: false,
					},
				},
			});
		});

	});

	describe('#onSetFilter', () => {

		it('should begin edit on todo', () => {
			const state = {
				'filter': SHOW_ALL,
			};

			return onSetFilter(state, SHOW_COMPLETED).then((result) => {
				return expect(result).toEqual({
					'filter': SHOW_COMPLETED,
				});
			});

		});

	});

});
