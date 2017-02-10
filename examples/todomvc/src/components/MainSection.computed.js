import _ from 'lodash';

import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters';

const TODO_FILTERS = {
	[SHOW_ALL]: () => true,
	[SHOW_ACTIVE]: (todo) => !todo.completed,
	[SHOW_COMPLETED]: (todo) => todo.completed,
};

export const completedCount = [
	({todos}) => todos,
	(todos) => _.filter(todos, { completed: true }).length,
];

export const filteredTodos = [
	({todos}) => todos,
	({filter}) => filter,
	(todos, filter) => _.filter(todos, TODO_FILTERS[filter]),
];
