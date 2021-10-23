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
