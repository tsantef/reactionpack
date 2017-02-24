import React, { PropTypes } from 'react';
import Header from '../components/Header';
import MainSection from '../components/MainSection';

const App = ({ todosById={} }) => {
	return (
		<div className='todoapp'>
			<Header />
			<MainSection />
		</div>
	);
};

App.propTypes = {
	todosById: PropTypes.object,
};

export default App;
