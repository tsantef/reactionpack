import _ from 'lodash';
import { fakeApi } from '../util';

function setTodo(state, todo) {
	const todosById = state.todosById;
	return {
		...state,
		todosById: {
			...todosById,
			[todo.id]: todo,
		},
	};
}

function setAllTodos(state, changes) {
	const todosById = state.todosById;
	return {
		...state,
		todosById: _.mapValues(todosById, (todo) => ({
			...todo,
			...changes,
		})),
	};
}

export function onBeginEdit(state, todo) {
	return setTodo(state, {
		...todo,
		editing: true,
		editText: todo.text,
	});
}

export function onEndEdit(state, todo) {
	const {
		onSaveTodo,
		onDeleteTodo,
	} = this.getActions();

	if (_.size(todo.text) === 0) {
		return onDeleteTodo(state, todo);
	}

	todo.text = todo.editText;

	return onSaveTodo(todo).then((state) => {
		return setTodo(state, {
			...todo,
			editing: false,
			editText: null,
		});
	});
}

export function onTextChange(state, todo, editText) {
	return setTodo(state, {
		...todo,
		editText,
	});
}

export function beginSaveTodo(state, todo) {
	return setTodo(state, {
		...todo,
		isLoading: true,
	});
}

export function endSaveTodo(state, todo) {
	return setTodo(state, {
		...todo,
		isLoading: false,
	});
}

export function saveTodo(state, todo) {
	return setTodo(state, {
		...todo,
		..._.pick(todo, 'text', 'completed'),
	});
}

export function onSaveTodo(state, todo) {
	const {
		beginSaveTodo,
		saveTodo,
		endSaveTodo,
	} = this.getActions();
	return beginSaveTodo(todo).then(() => {
		return fakeApi(todo).then((todo) => {
			return saveTodo(todo).then(() => {
				return endSaveTodo(todo);
			});
		});
	});
}

export function onDeleteTodo(state, todo) {
	const {
		beginSaveTodo,
	} = this.getActions();
	const todosById = state.todosById;

	return beginSaveTodo(todo).then(() => {
		return fakeApi(todo).then((state) => {
			return {
				...state,
				todosById: _.omit(todosById, todo.id),
			};
		});
	});
}

export function onCompleteTodo(state, todo) {
	const {
		beginSaveTodo,
		saveTodo,
		endSaveTodo,
	} = this.getActions();

	return beginSaveTodo(todo).then(() => {
		const completedTodo = {
			...todo,
			completed: !todo.completed,
		};
		return fakeApi(completedTodo).then((todo) => {
			return saveTodo(todo).then(() => {
				return endSaveTodo(todo);
			});
		});
	});
}

export function beginCompleteAll(state) {
	return setAllTodos(state, { isLoading: true });
}

export function endCompleteAll(state) {
	return setAllTodos(state, { isLoading: false });
}

export function completeAll(state, completed) {
	return setAllTodos(state, { completed });
}

export function onCompleteAll() {
	const {
		beginCompleteAll,
		completeAll,
		endCompleteAll,
	} = this.getActions();

	const {
		completedCount,
		todos,
	} = this.getComputed();

	return beginCompleteAll().then(() => {
		return fakeApi(todos).then((todos) => {
			return completeAll(completedCount !== todos.length).then(() => {
				return endCompleteAll();
			});
		});
	});
}

export function onClearCompleted(state) {
	const todosById = state.todosById;
	return {
		...state,
		todosById: _.pickBy(todosById, { completed: false }),
	};
}

export function onSetFilter(state, filter) {
	return fakeApi().then(() => {
		return {
			...state,
			filter: filter,
		};
	});
}
