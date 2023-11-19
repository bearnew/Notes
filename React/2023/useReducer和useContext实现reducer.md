# userReducer 和 useContext 实现 reducer

# reducer

```js
export const IReducer = (
  state: { todos: string[] },
  action: { type: string, payload: string },
) => {
  const { type, payload } = action;
  switch (type) {
    case "add":
      return {
        todos: [...state.todos, payload],
      };
  }
};
```

# Context

```js
export const IContext = React.createContext<{
    state: { todos: string[] },
    dispatch: React.Dispatch<any>
}>({
    state: { todos: [] },
    dispatch: () => {}
})
```

# Parent Component

```js
function Parent() {
    const [state, dispatch] = useReducer(IReducer, { todos: [] })
    return (
        <IContext.Provider value={{ state, dispatch }}>
            <Child>
        </IContext.Provider>
    )
}
```

# Child Component

```js
function Child() {
  const { state, dispatch } = useContext(IContext);
  return (
    <div>
      {state.todos.map((todo) => todo)}
      <button
        onClick={() => {
          dispatch({ type: "add", payload: `I'm a todo` });
        }}></button>
    </div>
  );
}
```
