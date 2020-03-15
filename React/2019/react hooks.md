## React Hooks
### hooks介绍
#### 引入hooks的动机
1. 复用组件之间的状态逻辑
2. 解决组件内业务逻辑过于复杂，难于理解的场景
3. 抛弃class,拥抱function
### hooks概要
#### 1.useState
1. `useState`等同于`this.setState`，只是`useState`不能将老的`state`和新的`state`合并到一起
2. `useState`使用初始值作为参数
    ```js
    const [age, setAge] = useState(42);
    const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
    ```
#### 2.useEffect
> 副作用，我们做数据拉取，订阅，手动改变dom，都统称为副作用，因为他们可能影响到其他组件，并且不能在render中完成
1. `useEffect`添加从函数组件执行副作用的能力，它与componentDidMount, componentDidUpdate, componentWillUnmount在react类中的用途相同
2. example
    ```js
    useEffect(() => {
        document.title = 'useEffect'
    })
    ```
3. 每一次render后，react会运行useEffect中的函数
4. 在useEffect中返回一个函数，当组件unmounts时，会执行return中的函数
    ```js
    import React, { useState, useEffect } from 'react';

    function FriendStatus(props) {
    const [isOnline, setIsOnline] = useState(null);

    function handleStatusChange(status) {
        setIsOnline(status.isOnline);
    }

    useEffect(() => {
        ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);

        return () => {
        ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
        };
    });

    if (isOnline === null) {
        return 'Loading...';
    }
    return isOnline ? 'Online' : 'Offline';
    }
    ```
5. 和sueState一样，在一个组件中，也可以多次使用useEffect
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
                ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
            };
        });

        function handleStatusChange(status) {
            setIsOnline(status.isOnline);
        }
    }
    ```
#### 3.rules of hooks
1. hooks只能在最外层使用，不能在循环中，条件语句中，嵌套函数中使用hooks
2. 只能在react function components中使用hooks
3. React依赖hooks调用的顺序，因此不能使用条件语句，否则每次render的顺序无法一一对应
#### 4.building your own hooks
1. 在处理组件之间的状态逻辑时，一般使用higher-order component和props处理
2. 有了hooks，我们可以使用useState和useEffect来处理
3. example
    ```js
        import React, { useState, useEffect } from 'react';

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
                <li style={{ color: isOnline ? 'green' : 'black' }}>
                {props.friend.name}
                </li>
            );
        }
    ```
#### 5.other hooks
1. `useContext`
    * 允许你不引入嵌套，就订阅响应上下文
    * example
        ```js
        function Example() {
            const locale = useContext(LocaleContext);
            const theme = useContext(ThemeContext);
            // ...
        }
      ```
2. `useReducer`
    * 使用reducer管理本地复杂组件状态
    * example
        ```js
        function Todos() {
            const [todos, dispatch] = useReducer(todosReducer);
        }
        ```
### state hook
1. useState是一个hook，让我们能够在function组件中，使用state
2. useState接收一个初始值作为参数
3. useState返回一对值，一个state的value值，一个用于setState的方法
    ```js
    const [count, setCount] = useState(0);
    ```
4. state hook的advantage
    1. 直接使用count,不需要使用this.state.count
        ```jsx
        <p>You clicked {count} times</p>
        ```
    2. 不需要使用this.setState()更新
        ```jsx
        <button onClick={() => setCount(count + 1)}>click me</button>
        ```
5. setCount更新state，是直接替换state，this.setState是合并新老state

### effect hook
1. example
    ```jsx
    import React, { useState, useEffect } from 'react';

    function Example() {
        const [count, setCount] = useState(0);

        useEffect(() => {
            document.title = `You clicked ${count} times`;
        });

        return (
            <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
            </div>
        );
    }
    ```
2. 每次执行dom更新后，会调用useEffect里面的函数
3. 在组件内部调用useEffect，可以直接在useEffect中使用state变量
4. 不需要考虑mounting还是updating,每一次render后都会调用useEffect中的function
5. example
    ```js
    import React, { useState, useEffect } from 'react';

    function FriendStatus(props) {
        const [isOnline, setIsOnline] = useState(null);

        useEffect(() => {
            function handleStatusChange(status) {
            setIsOnline(status.isOnline);
            }

            ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
            // Specify how to clean up after this effect:
            return function cleanup() {
                ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
            };
        });

        if (isOnline === null) {
            return 'Loading...';
        }
        return isOnline ? 'Online' : 'Offline';
    }
    ```
6. 当function组件unmount的时候，react会执行useEffect中的return函数，清空effects
7. 使用useEffect不需要关心props是否change
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
8. Effects做性能优化
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
9. useEffect的第二个参数数组如果有多个值，只要数组中的值有一个值和最新的值不同，就会重新渲染
10. 带有cleanup的useEffect同样也支持性能优化
    ```js
    useEffect(() => {
        function handleStatusChange(status) {
            setIsOnline(status.isOnline);
        }

        ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
        return () => {
            ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
        };
    }, [props.friend.id]); // Only re-subscribe if props.friend.id changes
    ```
11. 如果我们想要根据条件，判断是否调用useEffect，只能在useEffect里面加入if
    ```js
    useEffect(function persistForm() {
        // 👍 We're not breaking the first rule anymore
        if (name !== '') {
        localStorage.setItem('formData', name);
        }
    });
    ```
### building your own hooks
1. 共同的组件逻辑可以通过自定义hooks封装，而不需要引入第3个组件通过render props, higher-order components实现
2. exmaple
    ```js
        import React, { useState, useEffect } from 'react';

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
                return 'Loading...';
            }
            return isOnline ? 'Online' : 'Offline';
        }
    ```
    ```js
        function FriendListItem(props) {
            const isOnline = useFriendStatus(props.friend.id);

            return (
                <li style={{ color: isOnline ? 'green' : 'black' }}>
                {props.friend.name}
                </li>
            );
        }
    ```
3. 自定义hooks方法必须以use开头，没有use，系统无法检测hooks是否违反了rules of hooks
4. 2个组件使用同一个hook，并不会共享state, 只会共享state相关逻辑，所有的state和effects在里面都是完全独立的
### useYourImagination
1. 自定义一个userReducer hook管理本地state
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
                case 'add':
                return [...state, {
                    text: action.text,
                    completed: false
                }];
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
                dispatch({ type: 'add', text });
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
        function Counter({initialCount}) {
            const [count, setCount] = useState(initialCount);
            return (
                <>
                Count: {count}
                <button onClick={() => setCount(initialCount)}>Reset</button>
                <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
                <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
                </>
            );
        }
    ```
    3. lazy initial state(让initial state仅仅在初始化的时候执行)
    ```js
        const [state, setState] = useState(() => {
            const initialState = someExpensiveComputation(props);
            return initialState;
        });
    ```
    4. 如果更新一个state hook和现在的值相同，react将释放，而不会渲染子组件
2. useEffect
    1. 默认情况下，effects会在每一次render之后执行，但是你也可以选择在某些值发生更改时触发它
    2. 在effect中return一个clean-up函数，用来清空subscription, timer
        ```js
        useEffect(() => {
            const subscription = props.source.subscribe();
            return () => {
                // Clean up the subscription
                subscription.unsubscribe();
            };
        });
        ```
    3. 如果component渲染多次，之前的effect会在执行下一次effect时被清空
    4. useLayoutEffect
        * useEffect在布局和渲染完成之后激发
        * useLayoutEffect在渲染的时候同步触发
        * 使用useLayoutEffect来读取dom，然后同步更新（为了让用户不会感知到视觉上的不一致）
        * useLayoutEffect的激发阶段与componentDidMount和componentDidUpdate相同
        * 在浏览器绘制之前，将同步刷新useLayoutEffect中计划的更新
    5. useEffect第2个参数
        * 当第2个参数发生改变时，才会执行useEffect
        * 数组中需要传递useEffect函数中用到的所有的值
        * example
            ```js
            // propr.source改变，subscribe才会重新创建
            useEffect(
                () => {
                    const subscription = props.source.subscribe();
                    return () => {
                    subscription.unsubscribe();
                    };
                },
                [props.source],
            );
            ```
        * 第2个参数传[],则useEffect仅执行1次（mount）,useEffect的回调，在unmount时仍然会执行
        * 推荐`exhaustive-deps`规则最为eslint插件，会在不正确使用useEffect时，发出警告
    
3. useContext
    * useContext接收一个context对象（React.createContext的返回值）并返回该context的当前值
    * 调用useContext的组件会在context值变化时重新渲染
    * 当前context value由最近的<MyContext.Provider>的值确定
    * 当最近的<MyContext.Provider>更新时，使用context值的组件将重新渲染
    * example: https://github.com/bearnew/react-hooks

#### Additional Hooks
1. useReducer
    * 和redux一样，接受类型为`(state, action) => newState`的reducer,并返回与dispatch配对的方法
    * 处理涉及多个子值的复杂state逻辑，`useReducer`比`useState`更适合
    * 将init函数作为第3个参数传递，state将被重置为初始值
    * 如果reducer返回了与当前相同的值，react将不会重新渲染
    * example: https://github.com/bearnew/react-hooks
2. useCallback
    * example
        ```js
           const memoizedCallback = useCallback(
                () => {
                    doSomething(a, b);
                },
                [a, b],
            ); 
        ```
    * 返回一个memoized回调
    * 仅当第2个参数数组中有值发生变化时，第1个参数的回调才执行，类似于shouldComponentUpdate, 避免不必要的渲染
    * `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`.
    * `useCallback` 将返回 fn 函数而不调用它
3. useMemo
    * 与`useCallback`相同，第2个参数数组有值发生变化时，第1个参数函数才会执行
    * 传递给`useMemo`的函数在`render`期间执行
    * 不要在`useMemo`中做任何在渲染时不必做的事情，渲染时的副作用应该放在useEffect中执行
    * 第2个参数如果没有提供一个`array`,每次`render`都会执行useMemo中的函数
    * 函数中涉及到的每1个值，都应该在数组中出现
    * `useMemo`将调用 fn 函数并返回其结果
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
    * example
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
    * `useRef`返回一个可变的`ref`对象
    * `useRef`可以在其`.current`属性中保存可变值
    * `.current`上的属性变化，不会`re-render`
5. useImperativeHandle
    * example
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
        <FancyInput ref={fancyInputRef} />
        fancyInputRef.current.focus()
        ```
    * 在父组件中通过ref调用子组件的方法
6. useLayoutEffect
    * 与`useEffect`相同
    * 在`dom`变化后，同步触发
    * 可以使用`useLayouEffect`在dom中读取布局，并且同步重新渲染
    * 在浏览器重新绘制之前，将同步执行`useLayoutEffect`中的更新
7. useDebugValue
    * 用于在`React DevTools`中同步展示自定义的`hooks`标签
    * example
        ```js
            function useFriendStatus(friendID) {
                const [isOnline, setIsOnline] = useState(null);

                // ...

                // Show a label in DevTools next to this Hook
                // e.g. "FriendStatus: Online"
                useDebugValue(isOnline ? 'Online' : 'Offline');

                return isOnline;
            }
        ```
        ```js
            useDebugValue(date, date => date.toDateString());
        ```
