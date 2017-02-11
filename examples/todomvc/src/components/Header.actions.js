export function onAddTodo(state, text) {
	const todos = state.todos;
	if (text.length !== 0) {
		return {
			...state,
			todos: todos.concat({
				id: todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
				completed: false,
				text,
				editing: false,
				editText: '',
			}),
			newTodoText: '',
		};
	}
}

export function onTextChange(state, newTodoText) {
	return {
		...state,
		newTodoText,
	};
}
