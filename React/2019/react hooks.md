## React Hooks

### hooks 介绍

#### 引入 hooks 的动机

1. 复用组件之间的状态逻辑
2. 解决组件内业务逻辑过于复杂，难于理解的场景
3. 抛弃 class,拥抱 function
4. JavaScript 中闭包函数的性能是非常快
5. useEffect、useMemo、useCallback 都是自带闭包的。也就是说，每一次组件的渲染，其都会捕获当前组件函数上下文中的状态(state, props)，所以每一次这三种 hooks 的执行，反映的也都是当前的状态，你无法使用它们来捕获上一次的状态

### hooks 概要

#### 1.useState

1. `useState`等同于`this.setState`，只是`useState`不能将老的`state`和新的`state`合并到一起
2. `useState`使用初始值作为参数
   ```js
   const [age, setAge] = useState(42);
   const [todos, setTodos] = useState([{ text: "Learn Hooks" }]);
   ```

#### 2.useEffect

> 副作用，我们做数据拉取，订阅，手动改变 dom，都统称为副作用，因为他们可能影响到其他组件，并且不能在 render 中完成

1. `useEffect`添加从函数组件执行副作用的能力，它与 componentDidMount, componentDidUpdate, componentWillUnmount 在 react 类中的用途相同
2. example
   ```js
   useEffect(() => {
     document.title = "useEffect";
   });
   ```
3. 每一次 render 后，react 会运行 useEffect 中的函数
4. 在 useEffect 中返回一个函数，当组件 unmounts 时，会执行 return 中的函数

   ```js
   import React, { useState, useEffect } from "react";

   function FriendStatus(props) {
     const [isOnline, setIsOnline] = useState(null);

     function handleStatusChange(status) {
       setIsOnline(status.isOnline);
     }

     useEffect(() => {
       ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);

       return () => {
         ChatAPI.unsubscribeFromFriendStatus(
           props.friend.id,
           handleStatusChange
         );
       };
     });

     if (isOnline === null) {
       return "Loading...";
     }
     return isOnline ? "Online" : "Offline";
   }
   ```

5. 和 sueState 一样，在一个组件中，也可以多次使用 useEffect

   ```js
   function FriendStatusWithCounter(props) {
     const [count, setCount] = useState(0);
     useEffect(() => {
       document.title = `You clicked ${count} times`;
     });

     const [isOnline, setIsOnline] = useState(null);
     useEffect(() => {
       ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
       return () => {
         ChatAPI.unsubscribeFromFriendStatus(
           props.friend.id,
           handleStatusChange
         );
       };
     });

     function handleStatusChange(status) {
       setIsOnline(status.isOnline);
     }
   }
   ```

6. useEffect 加了条件，里面的函数也会运行一次
   ```js
   // 第1次count > 1为false，也会执行，第2次执行时，才会条件判断
   useEffect(() => {
     setDisplay((x) => true);
   }, [count > 1]);
   ```

#### 3.rules of hooks

1. hooks 只能在最外层使用，不能在循环中，条件语句中，嵌套函数中使用 hooks
2. 只能在 react function components 中使用 hooks
3. React 依赖 hooks 调用的顺序，因此不能使用条件语句，否则每次 render 的顺序无法一一对应，例如第一次存在 2 个 hooks，第二次满足条件存在 3 个 hooks

#### 4.building your own hooks

1. 在处理组件之间的状态逻辑时，一般使用 higher-order component 和 props 处理
2. 有了 hooks，我们可以使用 useState 和 useEffect 来处理
3. example

   ```js
   import React, { useState, useEffect } from "react";

   function useFriendStatus(friendID) {
     const [isOnline, setIsOnline] = useState(null);

     function handleStatusChange(status) {
       setIsOnline(status.isOnline);
     }

     useEffect(() => {
       ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
       return () => {
         ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
       };
     });

     return isOnline;
   }
   ```

   ```js
   function FriendListItem(props) {
     const isOnline = useFriendStatus(props.friend.id);

     return (
       <li style={{ color: isOnline ? "green" : "black" }}>
         {props.friend.name}
       </li>
     );
   }
   ```

#### 5.other hooks

1. `useContext`
   - 允许你不引入嵌套，就订阅响应上下文
   - example
     ```js
     function Example() {
       const locale = useContext(LocaleContext);
       const theme = useContext(ThemeContext);
       // ...
     }
     ```
2. `useReducer`
   - 使用 reducer 管理本地复杂组件状态
   - example
     ```js
     function Todos() {
       const [todos, dispatch] = useReducer(todosReducer);
     }
     ```

### state hook

1. useState 是一个 hook，让我们能够在 function 组件中，使用 state
2. useState 接收一个初始值作为参数
3. useState 返回一对值，一个 state 的 value 值，一个用于 setState 的方法
   ```js
   const [count, setCount] = useState(0);
   ```
4. state hook 的 advantage
   1. 直接使用 count,不需要使用 this.state.count
      ```jsx
      <p>You clicked {count} times</p>
      ```
   2. 不需要使用 this.setState()更新
      ```jsx
      <button onClick={() => setCount(count + 1)}>click me</button>
      ```
5. setCount 更新 state，是直接替换 state，this.setState 是合并新老 state

### effect hook

1. example

   ```jsx
   import React, { useState, useEffect } from "react";

   function Example() {
     const [count, setCount] = useState(0);

     useEffect(() => {
       document.title = `You clicked ${count} times`;
     });

     return (
       <div>
         <p>You clicked {count} times</p>
         <button onClick={() => setCount(count + 1)}>Click me</button>
       </div>
     );
   }
   ```

2. 每次执行 dom 更新后，会调用 useEffect 里面的函数
3. 在组件内部调用 useEffect，可以直接在 useEffect 中使用 state 变量
4. 不需要考虑 mounting 还是 updating,每一次 render 后都会调用 useEffect 中的 function
5. example

   ```js
   import React, { useState, useEffect } from "react";

   function FriendStatus(props) {
     const [isOnline, setIsOnline] = useState(null);

     useEffect(() => {
       function handleStatusChange(status) {
         setIsOnline(status.isOnline);
       }

       ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
       // Specify how to clean up after this effect:
       return function cleanup() {
         ChatAPI.unsubscribeFromFriendStatus(
           props.friend.id,
           handleStatusChange
         );
       };
     });

     if (isOnline === null) {
       return "Loading...";
     }
     return isOnline ? "Online" : "Offline";
   }
   ```

6. 当 function 组件 unmount 的时候，react 会执行 useEffect 中的 return 函数，清空 effects
7. 使用 useEffect 不需要关心 props 是否 change

   ```js
   // class
   componentDidMount() {
       ChatAPI.subscribeToFriendStatus(
       this.props.friend.id,
       this.handleStatusChange
       );
   }

   componentDidUpdate(prevProps) {
       // Unsubscribe from the previous friend.id
       ChatAPI.unsubscribeFromFriendStatus(
       prevProps.friend.id,
       this.handleStatusChange
       );
       // Subscribe to the next friend.id
       ChatAPI.subscribeToFriendStatus(
       this.props.friend.id,
       this.handleStatusChange
       );
   }

   componentWillUnmount() {
       ChatAPI.unsubscribeFromFriendStatus(
       this.props.friend.id,
       this.handleStatusChange
       );
   }
   ```

8. Effects 做性能优化
   ```js
   // class
   componentDidUpdate(prevProps, prevState) {
       if (prevState.count !== this.state.count) {
           document.title = `You clicked ${this.state.count} times`;
       }
   }
   ```
   ```js
   // 如果这次render的count和上次的count相同，react将跳过effect
   useEffect(() => {
     document.title = `You clicked ${count} times`;
   }, [count]); // Only re-run the effect if count changes
   ```
9. useEffect 的第二个参数数组如果有多个值，只要数组中的值有一个值和最新的值不同，就会重新渲染
10. 带有 cleanup 的 useEffect 同样也支持性能优化

    ```js
    useEffect(() => {
      function handleStatusChange(status) {
        setIsOnline(status.isOnline);
      }

      ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
      return () => {
        ChatAPI.unsubscribeFromFriendStatus(
          props.friend.id,
          handleStatusChange
        );
      };
    }, [props.friend.id]); // Only re-subscribe if props.friend.id changes
    ```

11. 如果我们想要根据条件，判断是否调用 useEffect，只能在 useEffect 里面加入 if
    ```js
    useEffect(function persistForm() {
      // 👍 We're not breaking the first rule anymore
      if (name !== "") {
        localStorage.setItem("formData", name);
      }
    });
    ```

### building your own hooks

1. 共同的组件逻辑可以通过自定义 hooks 封装，而不需要引入第 3 个组件通过 render props, higher-order components 实现
2. exmaple

   ```js
   import React, { useState, useEffect } from "react";

   function useFriendStatus(friendID) {
     const [isOnline, setIsOnline] = useState(null);

     useEffect(() => {
       function handleStatusChange(status) {
         setIsOnline(status.isOnline);
       }

       ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
       return () => {
         ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
       };
     });

     return isOnline;
   }
   ```

   ```js
   function FriendStatus(props) {
     const isOnline = useFriendStatus(props.friend.id);

     if (isOnline === null) {
       return "Loading...";
     }
     return isOnline ? "Online" : "Offline";
   }
   ```

   ```js
   function FriendListItem(props) {
     const isOnline = useFriendStatus(props.friend.id);

     return (
       <li style={{ color: isOnline ? "green" : "black" }}>
         {props.friend.name}
       </li>
     );
   }
   ```

3. 自定义 hooks 方法必须以 use 开头，没有 use，系统无法检测 hooks 是否违反了 rules of hooks
4. 2 个组件使用同一个 hook，并不会共享 state, 只会共享 state 相关逻辑，所有的 state 和 effects 在里面都是完全独立的

### useYourImagination

1. 自定义一个 userReducer hook 管理本地 state
2. example

   ```js
   function useReducer(reducer, initialState) {
     const [state, setState] = useState(initialState);

     function dispatch(action) {
       const nextState = reducer(state, action);
       setState(nextState);
     }

     return [state, dispatch];
   }
   ```

   ```js
   function todosReducer(state, action) {
     switch (action.type) {
       case "add":
         return [
           ...state,
           {
             text: action.text,
             completed: false,
           },
         ];
       // ... other actions ...
       default:
         return state;
     }
   }
   ```

   ```js
   function Todos() {
     const [todos, dispatch] = useReducer(todosReducer, []);

     function handleAddClick(text) {
       dispatch({ type: "add", text });
     }

     // ...
   }
   ```

### Hooks Api

#### Basic Hooks

1. useState
   1. overview
   ```js
   const [state, setState] = useState(initialState);
   setState(newState);
   ```
   2. functional updates
   ```js
   function Counter({ initialCount }) {
     const [count, setCount] = useState(initialCount);
     return (
       <>
         Count: {count}
         <button onClick={() => setCount(initialCount)}>Reset</button>
         <button onClick={() => setCount((prevCount) => prevCount + 1)}>
           +
         </button>
         <button onClick={() => setCount((prevCount) => prevCount - 1)}>-</button>
       </>
     );
   }
   ```
   3. lazy initial state(让 initial state 仅仅在初始化的时候执行)
   ```js
   const [state, setState] = useState(() => {
     const initialState = someExpensiveComputation(props);
     return initialState;
   });
   ```
   4. 如果更新一个 state hook 和现在的值相同，react 将释放，而不会渲染子组件
2. useEffect
   1. 默认情况下，effects 会在每一次 render 之后执行，但是你也可以选择在某些值发生更改时触发它
   2. 在 effect 中 return 一个 clean-up 函数，用来清空 subscription, timer
      ```js
      useEffect(() => {
        const subscription = props.source.subscribe();
        return () => {
          // Clean up the subscription
          subscription.unsubscribe();
        };
      });
      ```
   3. 如果 component 渲染多次，之前的 effect 会在执行下一次 effect 时被清空
   4. useLayoutEffect
      - useEffect 在布局和渲染完成之后激发
      - useLayoutEffect 在渲染的时候同步触发
      - 使用 useLayoutEffect 来读取 dom，然后同步更新（为了让用户不会感知到视觉上的不一致）
      - useLayoutEffect 的激发阶段与 componentDidMount 和 componentDidUpdate 相同
      - 在浏览器绘制之前，将同步刷新 useLayoutEffect 中计划的更新
   5. useEffect 第 2 个参数
      - 当第 2 个参数发生改变时，才会执行 useEffect
      - 数组中需要传递 useEffect 函数中用到的所有的值
      - example
        ```js
        // propr.source改变，subscribe才会重新创建
        useEffect(() => {
          const subscription = props.source.subscribe();
          return () => {
            subscription.unsubscribe();
          };
        }, [props.source]);
        ```
      - 第 2 个参数传[],则 useEffect 仅执行 1 次（mount）,useEffect 的回调，在 unmount 时仍然会执行
      - 推荐`exhaustive-deps`规则最为 eslint 插件，会在不正确使用 useEffect 时，发出警告
3. useContext
   - useContext 接收一个 context 对象（React.createContext 的返回值）并返回该 context 的当前值
   - 调用 useContext 的组件会在 context 值变化时重新渲染
   - 当前 context value 由最近的<MyContext.Provider>的值确定
   - 当最近的<MyContext.Provider>更新时，使用 context 值的组件将重新渲染
   - example: https://github.com/bearnew/react-hooks

#### Additional Hooks

1. useReducer
   - 和 redux 一样，接受类型为`(state, action) => newState`的 reducer,并返回与 dispatch 配对的方法
   - 处理涉及多个子值的复杂 state 逻辑，`useReducer`比`useState`更适合
   - 将 init 函数作为第 3 个参数传递，state 将被重置为初始值
   - 如果 reducer 返回了与当前相同的值，react 将不会重新渲染
   - example: https://github.com/bearnew/react-hooks
2. useCallback

   - example
     ```js
     const memoizedCallback = useCallback(() => {
       doSomething(a, b);
     }, [a, b]);
     ```
   - 返回一个 memoized 回调
   - 仅当第 2 个参数数组中有值发生变化时，第 1 个参数的回调才执行，类似于 shouldComponentUpdate, 避免不必要的渲染
   - `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`.
   - `useCallback` 将返回 fn 函数而不调用它
   - 能充分利用一个函数式组件多次 `render` 时产生的相同功能的 `callback`
   - `callback` 能不受闭包限制，访问到这个函数式组件内部最新的状态

     ```js
     function Form() {
       const [text, updateText] = useState("");
       const textRef = useRef();

       useLayoutEffect(() => {
         textRef.current = text; // 将 text 写入到 ref
       });

       const handleSubmit = useCallback(() => {
         const currentText = textRef.current; // 从 ref 中读取 text
         alert(currentText);
       }, [textRef]); // handleSubmit 只会依赖 textRef 的变化。不会在 text 改变时更新

       return (
         <>
           <input value={text} onChange={(e) => updateText(e.target.value)} />
           <ExpensiveTree onSubmit={handleSubmit} />
         </>
       );
     }
     ```

3. useMemo

   - 与`useCallback`相同，第 2 个参数数组有值发生变化时，第 1 个参数函数才会执行
   - 传递给`useMemo`的函数在`render`期间执行
   - 不要在`useMemo`中做任何在渲染时不必做的事情，渲染时的副作用应该放在 useEffect 中执行
   - 第 2 个参数如果没有提供一个`array`,每次`render`都会执行 useMemo 中的函数
   - 函数中涉及到的每 1 个值，都应该在数组中出现
   - `useMemo`将调用 fn 函数并返回其结果

   ```js
   interface ChildProps {
       name: { name: string; color: string };
       onClick: Function;
   }
   const Child = ({ name, onClick}: ChildProps): JSX.Element => {
       console.log('子组件?')
       return(
           <>
               <div style={{ color: name.color }}>我是一个子组件，父级传过来的数据：{name.name}</div>
               <button onClick={onClick.bind(null, '新的子组件name')}>改变name</button>
           </>
       );
   }
   const ChildMemo = memo(Child);

   const Page = (props) => {
       const [count, setCount] = useState(0);
       const [name, setName] = useState('Child组件');

       return (
           <>
               <button onClick={(e) => { setCount(count+1) }}>加1</button>
               <p>count:{count}</p>
               <ChildMemo
                   //使用useMemo，返回一个和原本一样的对象，第二个参数是依赖性，当name发生改变的时候，才产生一个新的对象
                   name={
                       useMemo(()=>({
                           name,
                           color: name.indexOf('name') !== -1 ? 'red' : 'green'
                       }), [name])
                   }
                   onClick={ useCallback((newName: string) => setName(newName), []) }
                   {/* useCallback((newName: string) => setName(newName),[]) */}
                   {/* 这里使用了useCallback优化了传递给子组件的函数，只初始化一次这个函数，下次不产生新的函数
               />
           </>
       )
   }
   ```

4. useRef
   - example
     ```jsx
     function TextInputWithFocusButton() {
       const inputEl = useRef(null);
       const onButtonClick = () => {
         // `current` points to the mounted text input element
         inputEl.current.focus();
       };
       return (
         <>
           <input ref={inputEl} type="text" />
           <button onClick={onButtonClick}>Focus the input</button>
         </>
       );
     }
     ```
   - `useRef`返回一个可变的`ref`对象
   - `useRef`可以在其`.current`属性中保存可变值
   - `.current`上的属性变化，不会`re-render`
5. useImperativeHandle
   - 命令式`hooks`，给 ref 添加`focus`函数，并传递给子组件
   - example
     ```js
     // 子组件
     function FancyInput(props, ref) {
         const inputRef = useRef();
         useImperativeHandle(ref, () => ({
             focus: () => {
                 inputRef.current.focus();
             }
         }));
         return <input ref={inputRef} ... />;
     }
     FancyInput = forwardRef(FancyInput);
     ```
     ```js
     // 父组件
     <FancyInput ref={fancyInputRef} />;
     fancyInputRef.current.focus();
     ```
   - 在父组件中通过 ref 调用子组件的方法
6. useLayoutEffect
   - 与`useEffect`相同
   - 在`dom`变化后，同步触发
   - 可以使用`useLayouEffect`在 dom 中读取布局，并且同步重新渲染
   - 在浏览器重新绘制之前，将同步执行`useLayoutEffect`中的更新
7. useDebugValue

   - 用于在`React DevTools`中同步展示自定义的`hooks`标签
   - example

     ```js
     function useFriendStatus(friendID) {
       const [isOnline, setIsOnline] = useState(null);

       // ...

       // Show a label in DevTools next to this Hook
       // e.g. "FriendStatus: Online"
       useDebugValue(isOnline ? "Online" : "Offline");

       return isOnline;
     }
     ```

     ```js
     useDebugValue(date, (date) => date.toDateString());
     ```

8. `useTransition`
   - 在某些 UI 交互场景，我们并不想马上将变更立即应用到页面上
   - 通过短暂的延时, 减少加载状态的展示频率太快造成的闪动
   - `useTransition` 也可以用于包裹低优先级更新, 以便能够立即渲染更重要的更新
   - `example`

```jsx
// ⚛️ 导入 useTransition
import React, { Suspense, useState, useTransition } from "react";

function App() {
  const [showPage2, setShowPage2] = useState(false);
  // ⚛️ useTransition 接收一个超时时间，返回一个 startTransition 函数，以及一个 pending
  const [startTransition, pending] = useTransition({ timeoutMs: 10000 });

  const handleClick = () => {
    // ⚛️ 将可能触发 Suspense 挂起的状态变更包裹在 startTransition 中
    startTransition(() => {
      setShowPage2(true);
    });
  };

  return (
    <div className="App">
      <div>
        <button onClick={handleClick}>切换</button>
        {/_ ⚛️ pending 表示处于待定状态, 你可以进行一些轻微的提示 _/}
        {pending && <span>切换中...</span>}
      </div>
      <div className="page">
        <Suspense fallback={<div>Loading ...</div>}>
          {!showPage2 ? <Page1 /> : <Page2 />}
        </Suspense>
      </div>
    </div>
  );
}
```
