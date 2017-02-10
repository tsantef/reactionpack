import _ from 'lodash';

export function editTodo(state, id, text) {
	const todos = state.todos;
	return {
		...state,
		todos: todos.map((todo) => ({
			...todo,
			text: todo.id === id ? text : todo.text,
		})),
	};
}

export function completeTodo(state, id) {
	const todos = state.todos;
	return {
		...state,
		todos: todos.map((todo) => ({
			...todo,
			completed: todo.id === id ? !todo.completed : todo.completed,
		})),
	};
}

export function deleteTodo(state, id) {
	const todos = state.todos;
	return {
		...state,
		todos: _.reject(todos, { id }),
	};
}

export function completeAll(state) {
	const todos = state.todos;
	return {
		...state,
		todos: todos.map((todo) => ({
			...todo,
			completed: true,
		})),
	};
}

export function clearCompleted(state) {
	const todos = state.todos;
	return {
		...state,
		todos: _.reject(todos, { completed: true }),
	};
}

export function setFilter(state, filter) {
	return {
		...state,
		filter: filter,
	};
}
