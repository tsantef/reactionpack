import _ from 'lodash';

export function onBeginEdit(state, editTodo) {
	const todos = state.todos;
	return {
		...state,
		todos: todos.map((todo) => ({
			...todo,
			editing: todo.id === editTodo.id ? true : todo.editing,
			editText: todo.id === editTodo.id ? todo.text : todo.editText,
		})),
	};
}

export function onTextChange(state, editTodo, text) {
	const todos = state.todos;
	return {
		...state,
		todos: todos.map((todo) => ({
			...todo,
			editText: todo.id === editTodo.id ? text : todo.editText,
		})),
	};
}

export function onSaveTodo(state, editTodo, text) {
	if (_.size(text) === 0) {
		return onDeleteTodo(state, editTodo);
	}
	const todos = state.todos;
	return {
		...state,
		todos: todos.map((todo) => ({
			...todo,
			text: todo.id === editTodo.id ? text : todo.text,
			editing: todo.id === editTodo.id ? false : todo.editing,
			editText: todo.id === editTodo.id ? null : todo.editText,
		})),
	};
}

export function onCompleteTodo(state, completedTodo) {
	const todos = state.todos;
	return {
		...state,
		todos: todos.map((todo) => ({
			...todo,
			completed: todo.id === completedTodo.id ? !todo.completed : todo.completed,
		})),
	};
}

export function onDeleteTodo(state, deletedTodo) {
	const todos = state.todos;
	return {
		...state,
		todos: _.reject(todos, { id: deletedTodo.id }),
	};
}

export function onCompleteAll(state) {
	const todos = state.todos;
	return {
		...state,
		todos: todos.map((todo) => ({
			...todo,
			completed: true,
		})),
	};
}

export function onClearCompleted(state) {
	const todos = state.todos;
	return {
		...state,
		todos: _.reject(todos, { completed: true }),
	};
}

export function onSetFilter(state, filter) {
	return {
		...state,
		filter: filter,
	};
}
