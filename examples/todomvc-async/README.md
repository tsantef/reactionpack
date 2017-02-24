# TodoMVC Using ReactionPack


```
components
├── Footer.js
├── Header.actions.js
├── Header.js     <----- connectToProps(Header, actions)
├── MainSection.actions.js
├── MainSection.computed.js
├── MainSection.js    <----- connectToProps(Header, actions, computeds)
├── TodoItem.js
└── TodoTextInput.js
constants
└── TodoFilters.js
containers
└── App.js
index.js    <----- createStateContainer(App)
```
