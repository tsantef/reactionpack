import {
	onAddTodo,
	onTextChange,
} from './Header.actions';

describe('Header Actions', () => {

	describe('#onAddTodo', () => {

		it('should add new todo', () => {
			const state = {
				newTodoText: 'Todo tex',
				todos: [],
			};

			const result = onAddTodo(state, 'Todo text');

			expect(result).toEqual({
				'newTodoText': '',
				'todos': [{
					'completed': false,
					'editText': '',
					'editing': false,
					'id': 0,
					'text': 'Todo text',
				}],
			});
		});

	});

	describe('#onTextChange', () => {

		it('should update newTodoText text', () => {
			const state = {
				newTodoText: 'Todo tex',
			};

			const result = onTextChange(state, 'Todo text');

			expect(result).toEqual({
				newTodoText: 'Todo text',
			});
		});

	});

});
