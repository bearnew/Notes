## 在html中使用react
* 需要使用babel.min.js在浏览器中将jsx编译成js
* script type为text/babel或text/jsx
* jsx是使用xhr来加载文件，chrome中不允许使用xhr（XMLHttpRequest）加载file://开头的url文件
* 只能直接将jsx代码写到script标签里，或者搭建本地服务器
* example
```html
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>test</title>
        <style>
        </style>
    </head>
    <body>
        <div id="root"></div>
        <script crossorigin src="https://unpkg.com/react@16.9.0/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@16.9.0/umd/react-dom.development.js"></script>
        <script crossorigin src="https://cdn.bootcss.com/babel-standalone/6.10.3/babel.min.js"></script>
        <script type="text/jsx">
            const { useState } = React;
            function Example() {
            // Declare a new state variable, which we'll call "count"
                const [count, setCount] = useState(0);

                return (
                    <div>
                    <p>You clicked {count} times</p>
                    <button onClick={() => setCount(count + 1)}>
                        Click me
                    </button>
                    </div>
                );
            }

            ReactDOM.render(
                <Example />,
                document.getElementById('root')
            )
        </script> 
    </body>
    </html>
```