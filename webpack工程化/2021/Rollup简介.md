# Rollup

## 1.Rollup 介绍

- 开源类库优先选择
- 以 `ESM` 标准为目标的构建工具
- `Tree Shaking`

## 2.Rollup 配置

```js
{
    "scripts": {
        "build": "rollup -c rollup.config.js"
    }
}
```

```js
import ts from "@rollup/plugin-typescript";

export default [
  {
    input: ["./src/index.js"],
    external: ["react"],
    output: {
      file: "./dist/index.umd.js",
      format: "umd",
      name: "rollup",
    },
    plugins: [
      resolve(),
      commonjs(),
      ts(),
      json(),
      alias({
        entries: {
          a: "./a.js",
        },
      }),
      babel({
        babelHelpers: "bundled",
      }),
      replace({
        __TEST__: 123,
      }),
    ],
  },
  {
    input: ["./src/index.js"],
    output: {
      file: "./dist/index.es.js",
      format: "es",
      name: "rollup",
    },
    plugins: [resolve()],
  },
];
```

## 3.Rollup 插件

1. `commonjs`
2. `Babel`
3. `Typescript`
4. `Replace`
5. `Node Resolve`
6. `Eslint`
7. `image`
8. `strip`, 用于移除生产环境中的`console.log`之类
9. `wasm`, 用于加载`webassembly`
