import React, {
	PropTypes,
	Component
} from 'react'
import { connectToProps } from '../../../../lib';
import TodoTextInput from './TodoTextInput'

import * as actions from './Header.actions';

export default connectToProps(class Header extends Component {
	static propTypes = {
		addTodo: PropTypes.func.isRequired,
		todos: PropTypes.array.isRequired,
	}

	handleSave = text => {
		if (text.length !== 0) {
			this.props.addTodo(text)
		}
	}

	render() {
		return (
			<header className="header">
				<h1>todos</h1>
				<TodoTextInput newTodo
					onSave={this.handleSave}
					placeholder="What needs to be done?" />
			</header>
		)
	}
}, actions);
