import React from 'react';
import { connectToProps } from '../../../../lib';

import TodoTextInput from './TodoTextInput';

import * as actions from './Header.actions';

const Header = ({
	newTodoText='',
	isLoading=false,
	onAddTodo,
	onTextChange,
}) => {
	return (
		<header className='header'>
			<h1>todos</h1>
			<div className={isLoading ? 'loading' : ''}>
				<TodoTextInput
					newTodo
					text={newTodoText}
					onEndEdit={onAddTodo}
					onTextChange={onTextChange}
					placeholder='What needs to be done?'
				/>
			</div>
		</header>
	);
};

Header.propTypes = {
	newTodoText: React.PropTypes.string,
	isLoading: React.PropTypes.bool,
	todosById: React.PropTypes.object,
	onAddTodo: React.PropTypes.func.isRequired,
	onTextChange: React.PropTypes.func.isRequired,
};

export default connectToProps(Header, actions);
