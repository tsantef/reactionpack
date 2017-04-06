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

Every ReactionPack must have one state container component. The state container uses the components internal state to store the tree of state for nested connected components. To define the state container use the following function:

`createStateContainer(Component, [initialState])`

### Arguments

* Component (React Component) - the component to be used as the root state container
* initialState (object) - (optional) Initial state tree object

### Returns

* Component (React Component) - a new wrapped component that hosts the app's root state container.

### Example Usage

```javascript
import { createStateContainer } from 'reactionpack';

const AppContainer = createStateContainer(App, { initialState });

render(
  <AppContainer />,
  document.getElementById('root')
);
```

## Component Development

### Connecting Component State to Props

`connectToProps(Component, [actions], [computedValues], [namespace])`

#### Arguments

* Component (React Component)
* actions (object) - (optional) key names map to properties
* computedValues (object) - (optional) key names map to properties
* namespace (string) - (optional) the base name in state where the components state is managed

#### Returns

* Component (React Component) - a new component with actions and computed values bound to props.

#### Example Usage

```javascript
import { connectToProps } from 'reactionpack';

const ConnectedPage = connectToProps(Page, actions, computedValues);
```

#### Props Override Rules

Props are composed in the following priority order from highest to lowest.

* prop passed in from owner component
* computed value from bound computed function
* action bound function
* state value from state container (if defined in propTypes)
* component default props

### Actions

Actions are either synchronous returning an object or null, or asynchronous returning a promise. Actions that call other actions should call them via `getActions` and not directly. Example: `this.getActions().someAction()`.

```javascript
// Returns a state changes
actionName(state, [value, ...]) {
  return {
    ...state
    someValue: value
  }
}

// Returns a promise
actionName(state, [value, ...]) {
  return fetchApiStuff(value).then((res) => {
    return {
      ...this.getState();
      things: res.things;
    }
  })
}

// Returns the result of another action
actionName(state, [value, ...]) {
  ...
  return this.getActions().anotherAction(value);
}
```

#### Return Values

Actions should return one of three types of values: An object representing the new state, a promise, or null.

* (object): Container state will be replaced with returned object.
* Promise: Container state will be updated with the resolved object.
* `null`: No state change required

#### Action Context

Actions are bound with functions in context for accessing other actions, computed values, default values, and the current state.

* this.getActions()
* this.getComputed()
* this.getDefaults()
* this.getState()

### Computed Values

ReactionPack has computed value support built in. Inspired by [Reselect](https://github.com/reactjs/reselect), computed values can be defined using an array containing one or more value selector functions and a computation function.

```javascript
export const computedDef = [
  selectorFunc,
  <more selector functions>,
  computeFunc
]
```

#### Example Usage

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

### Component Folder Structure

The recommend folder structure for components looks like the following:

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

## Unit Testing

### Actions

#### Synchronous actions

When testing synchronous actions (those that do not return a promise) simply call the action function directly.

```javascript
const todo = {
  id: 1,
  completed: false,
  text: 'Some todo',
  editText: null,
  editing: false,
};

const state = {
  todosById: {
    1: todo,
  },
};

const result = onBeginEdit(state, todo);

expect(result).toEqual({
  todosById: {
    1: {
      id: 1,
      completed: false,
      text: 'Some todo',
      editText: 'Some todo',
      editing: true,
    },
  },
});
```

#### Asynchronous actions

When testing asynchronous actions use the `mockActions` helper. The helper binds all actions as a unit and then test individual actions as methods on the returned object. Mock out other actions on this object as needed.

`mockActions(actions)`

```javascript
import { mockActions } from 'reactionpack';
...
const todo = {
  id: 1,
  completed: false,
  text: 'Some todo',
  editing: false,
};

const mockedActions = mockActions(actions);

mockedActions.saveTodo = jest.fn(() => Promise.resolve({})); // Mock out action called by `onSaveTodo`

return mockedActions.onSaveTodo(todo).then((result) => {
  return expect(mockedActions.saveTodo).toBeCalledWith(todo);
});

```

### Computed Values

When testing computed value definitions use the `createComputed` helper to build a the compute function.

`createComputed(computedValueDefintion)`

```javascript
const state = {
  todos: [{
    id: 1,
    completed: false,
  }, {
    id: 2,
    completed: true,
  }],
};

const computeCompletedCount = createComputed(completedCount);

expect(computeCompletedCount(state)).toEqual(1);
```

## Troubleshooting QAs

### Why are my actions or computed values in not being passed in as props?

Make sure all action and computed value names are defined in the component's propTypes. If not they will be ignored by the connected component. Added the following eslint rule to help prevent this problem going forward: `react/prop-types: 1`

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

ReactionPack can be used with the Redux DevTools Chrome extension. To do this import and pass the `installDevTools` function to state container:

```javascript
import { installDevTools } from 'reactionpack';

render(
  <AppContainer installDevTools={installDevTools} />,
  document.getElementById('root')
);
```
