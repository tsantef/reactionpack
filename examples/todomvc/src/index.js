import React from 'react';
import { render } from 'react-dom';
import { createStateContainer, installDevTools } from 'reactionpack';
import App from './containers/App';
import 'todomvc-app-css/index.css';

const AppContainer = createStateContainer(App);

function onNextState(state, action) {
	const stateContainer = document.getElementById('state');
	stateContainer.textContent = JSON.stringify(state, null, 2);
}

render(
	<AppContainer onNextState={onNextState} installDevTools={installDevTools}/>,
	document.getElementById('root')
);
