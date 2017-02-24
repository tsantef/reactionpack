import _ from 'lodash';

import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters';

const TODO_FILTERS = {
	[SHOW_ALL]: () => true,
	[SHOW_ACTIVE]: (todo) => !todo.completed,
	[SHOW_COMPLETED]: (todo) => todo.completed,
};

// Selectors

function getTodosById({todosById}) {
	return todosById;
}

function getFilter({filter}) {
	return filter;
}

// Composed Computed Values

export const todos = [
	getTodosById,
	(todosById) => {
		return _.values(todosById);
	},
];

export const completedCount = [
	getTodosById,
	(todosById) => _.filter(todosById, { completed: true }).length,
];

export const activeCount = [
	getTodosById,
	(todosById) => _.filter(todosById, { completed: false }).length,
];

export const filteredTodos = [
	getTodosById,
	getFilter,
	(todosById, filter) => _.filter(todosById, TODO_FILTERS[filter]),
];
