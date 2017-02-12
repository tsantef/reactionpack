# ReactionPack

## Installation

```bash
npm install reactionpack --save
```

## State Container

`createStateContainer(Component)`

### Arguments

* Component

### Returns

* (Component) Return s new component that server as the app's root state container.

```javascript
import { createStateContainer } from 'reactionpack';

const AppContainer = createStateContainer(App);
```

## Connected Components

`connectToProps(Component, [actions, [computed]])`

### Arguments

* Component
* [actions] (object) - key names map to properties
* [computeds] (object) - key names map to properties

### Returns

* (Component) Returns a new component with actions and computeds bound to props.

```javascript
import { connectToProps } from 'reactionpack';

const ConnectedPage = connectToProps(Page, actions, computeds);
```

## Actions

actionName(state, [value, ...]) {
  return {
    ...state
    someValue: value
  }
}

### Return Values

Actions can return three kinds of values: A object represting the new state, a promise, or null.

* (object): Container state will be replaced with returned object.
* Promise: Container state will be updated with the resolved object.
* `null`: No state change

### Action Context

wip

## Computed Values

ReactionPack has computed value support built in. Inspired by [Reselect](https://github.com/reactjs/reselect), computed values can be defined using an array containing one or more value selector functions and a computation function.

```javascript
export const computedDef = [
  selectorFunc,
  <more selector functions>,
  computeFunc
]
```

### Example Usage

(Excerpt taken from the [todomvc example app](https://github.com/tsantef/reactionpack/blob/master/examples/todomvc/src/components/MainSection.computed.js))

```javascript
// Selector definitions
function getTodos(state) {
  return state.todos;
}

function getFilter(state) {
  return state.filter;
}

// Exported computed value definition
export const filteredTodos = [
  getTodos,
  getFilter,
  (todos, filter) => _.filter(todos, TODO_FILTERS[filter]),
];
```

## Use with React-Router

```javascript
// App.jsx
...
export default connectToProps(App, actions, computed);

// ./pages/home.jsx / /pages/about.jsx
export default connectToProps(Home, actions, computed);

// Routes.jsx
import { createStateContainer } from 'reactionpack';

import App from './app';
import Home from './pages/home';
import About from './pages/about';

const Routes = (
  <Route path='/' component={createStateContainer(App)}>
    <Route path='/home' component={Home} />
    <Route path='/about' component={About} />
  </Route>
);
```

## Redux DevTools Extension

ReactionPack can be used with the Redux DevTools Chrome extension. To do this, forward state changes to the extension by passing in an `onNextState` handler to the state container component:

```javascript
function onNextState(state, action) {
  if (window.devToolsExtension) {
    window.devToolsExtension.send({ type: action }, state);
  }
}

render(
  <AppContainer onNextState={onNextState} />,
  document.getElementById('root')
);
```
