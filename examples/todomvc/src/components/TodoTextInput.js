import React, { PropTypes } from 'react';
import classnames from 'classnames';

const TodoTextInput = ({
	editing,
	newTodo,
	placeholder,
	text,
	onSave,
	onTextChange,
}) => {
	const handleSubmit = (e) => {
		const text = e.target.value.trim();
		if (e.which === 13) {
			onSave(text);
		}
	};

	const handleChange = (e) => {
		onTextChange(e.target.value);
	};

	const handleBlur = (e) => {
		if (!newTodo) {
			onSave(e.target.value);
		}
	};

	return (
		<input
			className={classnames({
				edit: editing,
				'new-todo': newTodo,
			})}
			type='text'
			placeholder={placeholder}
			autoFocus='true'
			value={text}
			onBlur={handleBlur}
			onChange={handleChange}
			onKeyDown={handleSubmit}
		/>
	);
};

TodoTextInput.propTypes = {
	editing: PropTypes.bool,
	newTodo: PropTypes.bool,
	placeholder: PropTypes.string,
	text: PropTypes.string.isRequired,
	onSave: PropTypes.func.isRequired,
	onTextChange: PropTypes.func.isRequired,
};

export default TodoTextInput;
