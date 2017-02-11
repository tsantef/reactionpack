import React from 'react';
import classnames from 'classnames';
import TodoTextInput from './TodoTextInput';

const TodoItem = ({
	editText,
	todo,
	onBeginEdit,
	onCompleteTodo,
	onDeleteTodo,
	onSaveTodo,
	onTextChange,
}) => {

	function handleBeginEdit() {
		onBeginEdit(todo);
	}

	function handleCompleteTodo() {
		onCompleteTodo(todo);
	}

	function handleDeleteTodo() {
		onDeleteTodo(todo);
	}

	function handleTextChange(text) {
		onTextChange(todo, text);
	}

	function handleSave(text) {
		onSaveTodo(todo, text);
	}

	return (
		<li className={classnames({
			completed: todo.completed,
			editing: todo.editing,
		})}>
			{ todo.editing ?
				<TodoTextInput
					text={todo.editText}
					editing={todo.editing}
					onSave={handleSave}
					onTextChange={handleTextChange}
				/>
			:
				<div className='view'>
					<input className='toggle'
						type='checkbox'
						checked={todo.completed}
						onChange={handleCompleteTodo} />
					<label onDoubleClick={handleBeginEdit}>
						{todo.text}
					</label>
					<button className='destroy' onClick={handleDeleteTodo} />
				</div>
			}
		</li>
	);
};

TodoItem.propTypes = {
	editing: React.PropTypes.bool,
	editText: React.PropTypes.string,
	todo: React.PropTypes.object.isRequired,
	onBeginEdit: React.PropTypes.func.isRequired,
	onCompleteTodo: React.PropTypes.func.isRequired,
	onDeleteTodo: React.PropTypes.func.isRequired,
	onSaveTodo: React.PropTypes.func.isRequired,
	onTextChange:  React.PropTypes.func.isRequired,
};

export default TodoItem;
