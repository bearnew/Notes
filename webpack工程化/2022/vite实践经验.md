# vite 实践经验

1. 配置业务代码`decorator`

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

1. 使用`@anatine/esbuild-decorators`处理`npm`包中的`es`语法
2. `esbuildOptions`配置预编译的配置

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

5. 最佳实践

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";
import reactCssModule from "vite-plugin-react-css-modules";
import NodeGlobalsPolyfillPlugin from "@esbuild-plugins/node-globals-polyfill";
import { generateUniqueCls } from "./build/utils/uniqueCls";

export default defineConfig({
    plugins: [
        reactCssModule({
            context: WORK_SPACE,
            generateScopedName: function (localName, resourcePath) {
                return generateUniqueCls(resourcePath, localName);
            },
            filetypes: {
                ".scss": {
                    syntax: "postcss-scss",
                    plugins: ["postcss-nested", "autoprefixer"],
                },
            },
            exclude: "node_modules",
            removeImport: false,
            autoResolveMultipleImports: true,
            handleMissingStyleName: "ignore",
        }),
        react({
            jsxRuntime: "classic",
            babel: {
                plugins: [
                    ["@babel/plugin-proposal-decorators", { legacy: true }],
                    [
                        "@babel/plugin-proposal-class-properties",
                        { loose: true },
                    ],
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            "@App": path.resolve(__dirname, "./src"),
        },
    },
    // build: {
    //     rollupOptions: {
    //         input: []
    //     }
    // },
    esbuild: {
        include: /\.(tsx?|jsx?)$/,
        exclude: [],
        loader: "tsx",
    },
    server: {
        open: "/index.html",
        host: "www.test.com",
        port: 3000,
        proxy: {
            "/api": {
                // 此处使用远端的ip
                // target: 'http://150.158.221.61',
                // rewrite: path => path.replace(/^\/proxy\/api/, '')
                target: "http://www.test.com:5000",
                secure: false,
                changeOrigin: true,
            },
        },
        https: !!process.env.VITE_USE_HTTPS,
    },
    css: {
        modules: {
            generateScopedName: function (localName, resourcePath) {
                return generateUniqueCls(resourcePath, localName);
            },
        },
    },
    optimizeDeps: {
        entries: [],
        exclude: [],
        esbuildOptions: {
            loader: {
                ".js": "tsx",
            },
            define: {
                global: "globalThis",
            },
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    process: true,
                    define: {
                        "process.env.BROWSER": "true",
                        "process.env.IS_VITE_DEV": "true",
                    },
                }),
            ],
        },
    },
});
```
