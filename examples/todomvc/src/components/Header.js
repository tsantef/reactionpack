import React from 'react';
import { connectToProps } from 'reactionpack';

import TodoTextInput from './TodoTextInput';

import * as actions from './Header.actions';

const Header = ({
	newTodoText='',
	onAddTodo,
	onTextChange,
}) => {
	return (
		<header className='header'>
			<h1>todos</h1>
			<TodoTextInput
				newTodo
				text={newTodoText}
				onSave={onAddTodo}
				onTextChange={onTextChange}
				placeholder='What needs to be done?'
			/>
		</header>
	);
};

Header.propTypes = {
	newTodoText: React.PropTypes.string,
	todos: React.PropTypes.array.isRequired,
	onAddTodo: React.PropTypes.func.isRequired,
	onTextChange: React.PropTypes.func.isRequired,
};

export default connectToProps(Header, actions);
