import React from 'react';
import { connectToProps } from '../../../../lib';

import TodoTextInput from './TodoTextInput';

import * as actions from './Header.actions';

const H = React.createClass({
	propTypes: {
		newTodoText: React.PropTypes.string,
		todos: React.PropTypes.array.isRequired,
		onAddTodo: React.PropTypes.func.isRequired,
		onTextChange: React.PropTypes.func.isRequired,
	},

	render: function() {
		const {
			newTodoText,
			onAddTodo,
			onTextChange,
		} = this.props;
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
	},
});

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

export default connectToProps(H, actions);
