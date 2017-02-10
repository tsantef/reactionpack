import React, { Component, PropTypes } from 'react'
import { connectToProps } from '../../../../lib';
import TodoItem from './TodoItem'
import Footer from './Footer'
import { SHOW_ALL } from '../constants/TodoFilters'

import * as actions from './MainSection.actions';
import * as computed from './MainSection.computed';

export default connectToProps(class MainSection extends Component {
	static propTypes = {
		todos: PropTypes.array.isRequired,
		filter: PropTypes.string,
		completedCount: PropTypes.number.isRequired,
		clearCompleted: PropTypes.func.isRequired,
		editTodo: PropTypes.func.isRequired,
		completeTodo: PropTypes.func.isRequired,
		deleteTodo: PropTypes.func.isRequired,
		completeAll: PropTypes.func.isRequired,
		setFilter: PropTypes.func.isRequired,
  }

  renderToggleAll(completedCount) {
		const { todos, completeAll } = this.props
    if (todos.length > 0) {
      return (
        <input className="toggle-all"
               type="checkbox"
               checked={completedCount === todos.length}
               onChange={completeAll} />
      )
    }
  }

  renderFooter(completedCount) {
    const { todos, filter=SHOW_ALL, setFilter, clearCompleted } = this.props
    const activeCount = todos.length - completedCount

    if (todos.length) {
      return (
        <Footer completedCount={completedCount}
                activeCount={activeCount}
                filter={filter}
                onClearCompleted={clearCompleted}
                onShow={setFilter} />
      )
    }
  }

  render() {
    const {
			completedCount,
			filteredTodos,
			editTodo,
			completeTodo,
			deleteTodo
		} = this.props

    return (
      <section className="main">
        {this.renderToggleAll(completedCount)}
        <ul className="todo-list">
          {filteredTodos.map(todo =>
            <TodoItem key={todo.id} todo={todo} editTodo={editTodo} completeTodo={completeTodo} deleteTodo={deleteTodo} />
          )}
        </ul>
        {this.renderFooter(completedCount)}
      </section>
    )
  }
}, actions, computed);
