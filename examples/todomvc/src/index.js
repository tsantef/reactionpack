import React from 'react';
import { render } from 'react-dom';
import { createStateContainer } from '../../../lib';
import App from './containers/App';
import 'todomvc-app-css/index.css';

const AppContainer = createStateContainer(App);

function onNextState(state, action) {
	if (window.devToolsExtension) {
		window.devToolsExtension.send({ type: action }, state);
	}
}

render(
	<AppContainer onNextState={onNextState} />,
	document.getElementById('root')
);
