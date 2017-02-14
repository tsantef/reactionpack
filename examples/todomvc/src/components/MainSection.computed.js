import _ from 'lodash';

import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters';

const TODO_FILTERS = {
	[SHOW_ALL]: () => true,
	[SHOW_ACTIVE]: (todo) => !todo.completed,
	[SHOW_COMPLETED]: (todo) => todo.completed,
};

// Selectors

function getTodos({todos}) {
	return todos;
}

function getFilter({filter}) {
	return filter;
}

// Composed Computed Values

export const completedCount = [
	getTodos,
	(todos) => _.filter(todos, { completed: true }).length,
];

export const activeCount = [
	getTodos,
	(todos) => _.filter(todos, { completed: false }).length,
];

export const filteredTodos = [
	getTodos,
	getFilter,
	(todos, filter) => _.filter(todos, TODO_FILTERS[filter]),
];
