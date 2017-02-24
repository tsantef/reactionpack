import {
	beginAddTodo,
	endAddTodo,
	onAddTodo,
	onTextChange,
} from './Header.actions';

describe('Header Actions', () => {

	describe('#beginAddTodo', () => {

		it('should begin todo add', () => {

			const state = {
				newTodoText: 'Todo text',
				isLoading: false,
			};

			const result = beginAddTodo(state);

			expect(result).toEqual({
				isLoading: true,
				newTodoText: 'Todo text',
			});

		});

	});

	describe('#endAddTodo', () => {

		it('should end todo add', () => {

			const state = {
				newTodoText: 'Todo text',
				isLoading: true,
			};

			const result = endAddTodo(state);

			expect(result).toEqual({
				isLoading: false,
				newTodoText: '',
			});

		});

	});

	describe('#onAddTodo', () => {

		it('should call addTodo', () => {
			const state = {
				newTodoText: 'Todo tex',
				todos: [],
			};

			const beginAddTodo  = jest.fn(() => (Promise.resolve()));
			const addTodo = jest.fn(() => (Promise.resolve()));
			const endAddTodo = jest.fn(() => (Promise.resolve()));

			const context = {
				getActions: () => ({
					beginAddTodo,
					addTodo,
					endAddTodo,
				}),
			};

			return onAddTodo.bind(context)(state).then((result) => {
				return expect(addTodo).toBeCalledWith({
					completed: false,
					editText: '',
					editing: false,
					text: 'Todo tex',
				});
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
