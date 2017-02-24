import React from 'react';
import { connectToProps } from '../../../../lib';
import TodoItem from './TodoItem';
import Footer from './Footer';
import { SHOW_ALL } from '../constants/TodoFilters';

import * as actions from './MainSection.actions';
import * as computed from './MainSection.computed';

const MainSection = ({
	todos,
	completedCount,
	activeCount,
	filter=SHOW_ALL,
	filteredTodos,
	onBeginEdit,
	onEndEdit,
	onTextChange,
	onCompleteTodo,
	onCompleteAll,
	onSetFilter,
	onClearCompleted,
	onDeleteTodo,
}) => {
	return (
		<section className='main'>
			{ todos.length ?
				<input
					className='toggle-all'
					type='checkbox'
					checked={completedCount === todos.length}
					onChange={onCompleteAll}
					/>
			: null }
			<ul className='todo-list'>
				{filteredTodos.map((todo) =>
					<div key={todo.id} className={todo.isLoading ? 'loading' : ''}>
						<TodoItem
							key={todo.id}
							todo={todo}
							onBeginEdit={onBeginEdit}
							onTextChange={onTextChange}
							onEndEdit={onEndEdit}
							onCompleteTodo={onCompleteTodo}
							onDeleteTodo={onDeleteTodo}
						/>
				</div>
				)}
			</ul>
			{ todos.length ?
				<Footer
					completedCount={completedCount}
					activeCount={activeCount}
					filter={filter}
					onClearCompleted={onClearCompleted}
					onShow={onSetFilter}
				/>
			: null }
		</section>
	);
};

MainSection.propTypes = {
	todos: React.PropTypes.array.isRequired,
	todosById: React.PropTypes.object,
	filter: React.PropTypes.string,
	activeCount: React.PropTypes.number.isRequired,
	filteredTodos: React.PropTypes.array.isRequired,
	completedCount: React.PropTypes.number.isRequired,
	onEndEdit: React.PropTypes.func.isRequired,
	onTextChange: React.PropTypes.func.isRequired,
	onClearCompleted: React.PropTypes.func.isRequired,
	onBeginEdit: React.PropTypes.func.isRequired,
	onCompleteTodo: React.PropTypes.func.isRequired,
	onDeleteTodo: React.PropTypes.func.isRequired,
	onCompleteAll: React.PropTypes.func.isRequired,
	onSetFilter: React.PropTypes.func.isRequired,
};

export default connectToProps(MainSection, actions, computed);
