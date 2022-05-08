# vite 实践经验

1. 配置`decorator`后仍然报错，编译完成后，注释`decorator`业务代码再打开，报错消失

```js
plugins: [
    react({
        jsxRuntime: "classic",
        babel: {
            plugins: [
                ["@babel/plugin-proposal-decorators", { legacy: true }],
                ["@babel/plugin-proposal-class-properties", { loose: true }],
            ],
        },
    });
]
```
