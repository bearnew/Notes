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

2. 使用`@anatine/esbuild-decorators`处理`decorator`包中的`es`语法
3. `esbuildOptions`配置预编译的配置

```js
 optimizeDeps: {
    esbuildOptions: {
        loader: {
            // npm第3方包的js文件也走tsx编译，用于处理`<div></div>`和`@test`等写法
            '.js': 'tsx'
        },
        define: {
            global: 'globalThis'
        },
        plugins: [
            GlobalsPolyfills({
                process: true,
                define: {
                    'process.env.BROWSER': JSON.stringify(true),
                }
            }),
            ChangeLazyloadRequire(),
            {
                // 解决无法解析的js中的组件写法<div></div>
                name: 'load-js-files-as-tsx',
                setup(build) {
                    build.onLoad({ filter: /\.*\.js$/ }, args => ({
                        // i modified the regex here
                        loader: 'jsx',
                        contents: fs.readFileSync(args.path, 'utf8')
                    }));
                }
            },
            esbuildDecorators()
        ]
    }
},
```

4. 控制台报错`No matching export for import typescript interface`

-   写法问题
