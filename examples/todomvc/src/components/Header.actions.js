export function addTodo(state, text) {
	const todos = state.todos;

	return {
		...state,
		todos: todos.concat({
			id: todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
			completed: false,
			text,
		}),
	};
}
