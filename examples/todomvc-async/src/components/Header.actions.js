import _ from 'lodash';
import { fakeApi } from '../util';

export function beginAddTodo(state, todo) {
	return {
		...state,
		isLoading: true,
	};
}

export function endAddTodo(state, todo) {
	return {
		...state,
		newTodoText: '',
		isLoading: false,
	};
}

export function addTodo(state, todo) {
	const todosById = state.todosById;
	const id = _.keys(todosById).reduce((maxId, id) => Math.max(id, maxId), -1) + 1;
	return {
		...state,
		todosById: {
			...todosById,
			[id]: {
				...todo,
				id,
			},
		},
	};
}

export function onAddTodo({newTodoText}) {
	const {
		beginAddTodo,
		addTodo,
		endAddTodo,
	} = this.getActions();

	return beginAddTodo().then(() => {
		const todo = {
			completed: false,
			text: newTodoText,
			editing: false,
			editText: '',
		};
		return fakeApi(todo).then((todo) => {
			return addTodo(todo).then(() => {
				return endAddTodo();
			});
		});
	});
}

export function onTextChange(state, newTodoText) {
	return {
		...state,
		newTodoText,
	};
}
