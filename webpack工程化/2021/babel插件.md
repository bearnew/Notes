# babel 插件

- AST 在线生成： https://astexplorer.net/

```js
// my-babel-plugin.js
module.exports = ({ types: t }) => {
  return {
    visitor: {
      Identifier(path) {
        const parentIsIf = t.isIfStatement(path.parentPath);
        const isDebug = path.node.name === "DEBUG";
        if (isDebug && parentIsIf) {
          // 把Identifier转换成string
          const stringNode = t.stringLiteral("DEBUG");
          path.replaceWith(stringNode);
        }
      },

      StringLiteral(path, state) {
        const parentIsIf = t.isIfStatement(path.parentPath);
        const isDebug = path.node.value === "DEBUG";
        if (isDebug && parentIsIf) {
          // 控制在prod下才能移除
          if (process.env.NODE_ENV === "production" && state.opts.isRemove) {
            path.parentPath.remove();
          }
        }
      },
    },
  };
};
```

```js
// index.js
const { transformSync } = require("@babel/core");
const code = `
    if (DEBUG) {
        console.log('babel plugin test');
    }
`;

const babelConfig = {
  plugins: [
    [
      "./my-babel-plugin.js",
      {
        isRemove: true,
      },
    ],
  ],
};
const output = transformSync(code, babelConfig);
console.log(output);
```
