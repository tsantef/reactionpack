import React from 'react';
import { render } from 'react-dom';
import { createStateContainer } from '../../../lib';
import App from './containers/App';
import 'todomvc-app-css/index.css';

const AppContainer = createStateContainer(App);

render(
	<AppContainer />,
	document.getElementById('root')
);
