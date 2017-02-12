# ReactionPack

## Installation

```bash
npm install reactionpack --save
```

## State Container

wip

## Actions

wip

## Computed Values

ReactionPack has computed value support built in. Inspired by [Reselect](https://github.com/reactjs/reselect), computed values can be defined using an array containing one or more value selector functions and a computation function.

```
export const computedDef = [
  selectorFunc,
  <more selector functions>,
  computeFunc
]
```

### Example Usage

(Excerpt taken from the [todomvc example app](https://github.com/tsantef/reactionpack/blob/master/examples/todomvc/src/components/MainSection.computed.js))

```javascript
# Selector definitions

function getTodos(state) {
  return state.todos;
}

function getFilter(state) {
  return state.filter;
}

# Exported computed value definition
export const filteredTodos = [
  getTodos,
  getFilter,
  (todos, filter) => _.filter(todos, TODO_FILTERS[filter]),
];
```

## Use with React-Router

wip

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
