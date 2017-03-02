# ReactionPack [![npm version](https://badge.fury.io/js/reactionpack.svg)](http://badge.fury.io/js/reactionpack) [![Build Status](https://travis-ci.org/tsantef/reactionpack.svg?branch=master)](https://travis-ci.org/tsantef/reactionpack) [![Coverage Status](https://coveralls.io/repos/github/tsantef/reactionpack/badge.svg?branch=master)](https://coveralls.io/github/tsantef/reactionpack?branch=master)


ReactionPack offers a simple way to decouple actions and state changes from view components. With ReactionPack properly built components are stateless, use only props, and are easily unit testable.

This state management package draws heavily from Redux but attempts to simplify development for small and large applications. The major difference with this library is that there are no reducers or constants to worry about. Actions return with state changes eliminating the need for constants and reducers. Additionally asynchronous actions and computed values are first class citizens with no need for external packages.

#### Key Features:

* Zen mode component development _(**Stateless**, simple, organized, and testable. See: [Component Development](#component-development))_
* **No Redux** _(No constants and reducers, just actions)_
* **No Thunk** _(Actions are natively asynchronous. See: [Actions](#actions))_
* **No Reselect** _(Built in support for computed values. See: [Computed Values](#computed-values))_
* Small package size

#### Examples:
* TodoMVC [source](https://github.com/tsantef/reactionpack/tree/master/examples/todomvc/src) and [demo](https://tsantef.github.io/reactionpack/examples/todomvc/)
* TodoMVC Async Actions [source](https://github.com/tsantef/reactionpack/tree/master/examples/todomvc-async/src) and [demo](https://tsantef.github.io/reactionpack/examples/todomvc-async/)

## Installation

```bash
npm install reactionpack --save
```

## State Container

`createStateContainer(Component, [initialState])`

### Arguments

* Component - The component to be used as the root state container
* initialState - (optional) Initial state object

### Returns

* (Component) Returns a new component that serves as the app's root state container.

```javascript
import { createStateContainer } from 'reactionpack';

const AppContainer = createStateContainer(App);
```

## Component Development

### Folder Structure

Components should have a folder structure like the following:

```
Component/
├── actions.js  (Action functions get mapped to props by name)
├── actions.spec.js
├── computed-values.js  (Computed value definitions get mapped to props by name)
├── computed-values.spec.js
├── index.js  (Returns the connected component)
├── View.jsx  (Stateless view component)
└── View.spec.js
```

### Connecting Components

`connectToProps(Component, [actions, [computed]])`

#### Arguments

* Component
* [actions] (object) - key names map to properties
* [computed values] (object) - key names map to properties

#### Returns

* (Component) Returns a new component with actions and computed values bound to props.

```javascript
import { connectToProps } from 'reactionpack';

const ConnectedPage = connectToProps(Page, actions, computedValues);
```

### Props Override Rules

Props are overrided in the following priority from highest to lowest.

* prop passed in from owner component
* computed value from bound computed function
* action bound function
* state value from state container (if defined in propTypes)
* component default props

## Actions

Actions are async out of the gate and can return with state changes or a promises.

```javascript
// Return state changes
actionName(state, [value, ...]) {
  return {
    ...state
    someValue: value
  }
}

// Return promises
actionName(state, [value, ...]) {
  return fetchApiStuff(value).then((res) => {
    return {
      ...this.getState();
      things: res.things;
    }
  })
}
```

### Return Values

Actions can return three kinds of values: A object representing the new state, a promise, or null.

* (object): Container state will be replaced with returned object.
* Promise: Container state will be updated with the resolved object.
* `null`: No state change required

### Action Context

* this.getActions()
* this.getComputed()
* this.getDefaults()
* this.getState()

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

## Unit Testing

### Action Helper

wip

### Computed Value Helper

wip

## Use with React-Router

```javascript
// App.jsx
...
export default connectToProps(App, actions, computed);

// ./pages/home.jsx && /pages/about.jsx
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

*NOTE: Only partially supported WIP*

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
