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
