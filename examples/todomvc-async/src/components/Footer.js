import React from 'react';
import classnames from 'classnames';

import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters';

const FILTER_TITLES = {
	[SHOW_ALL]: 'All',
	[SHOW_ACTIVE]: 'Active',
	[SHOW_COMPLETED]: 'Completed',
};

const Footer = ({
	activeCount,
	completedCount,
	filter: selectedFilter,
	onClearCompleted,
	onShow,
}) => {
	const itemWord = activeCount === 1 ? 'item' : 'items';

	return (
		<footer className='footer'>
			<span className='todo-count'>
				<strong>{activeCount || 'No'}</strong> {itemWord} left
			</span>
			<ul className='filters'>
				{[ SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED ].map((filter) =>
					<li key={filter}>
						<a className={classnames({ selected: filter === selectedFilter })}
							style={{ cursor: 'pointer' }}
							onClick={() => onShow(filter)}>
							{FILTER_TITLES[filter]}
						</a>
					</li>
				)}
			</ul>
			{ completedCount > 0 ?
				<button
					className='clear-completed'
					onClick={onClearCompleted}
				>
					Clear completed
				</button>
			: null }
		</footer>
	);
};

Footer.propTypes = {
	activeCount: React.PropTypes.number.isRequired,
	completedCount: React.PropTypes.number.isRequired,
	filter: React.PropTypes.string.isRequired,
	onClearCompleted: React.PropTypes.func.isRequired,
	onShow: React.PropTypes.func.isRequired,
};

export default Footer;
