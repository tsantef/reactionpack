import React, { PropTypes } from 'react';
import Header from '../components/Header';
import MainSection from '../components/MainSection';

const App = ({ todos=[] }) => {
	return (
		<div>
			<Header todos={todos}/>
			<MainSection todos={todos} />
		</div>
	);
};

App.propTypes = {
	todos: PropTypes.array,
};

export default App;
