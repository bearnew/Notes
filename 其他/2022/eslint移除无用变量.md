# eslint移除无用变量
```json
{
    "plugins": [
        "unused-imports"
    ],
    "rules": {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "off",
		"unused-imports/no-unused-imports": "error",
		"unused-imports/no-unused-vars": [
			"warn",
			{ "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" }
		]
    }
}
```
```js
// eslint配置位置，默认在根目录
{"eslint.workingDirectories": ["normalH5"]}
```
```js
// 全量修复
npx eslint --fix --ext .js,.jsx,.ts,.tsx src
```
# eslint和prettier冲突
1. `eslint`既负责了代码质量检测，又负责了一部分的格式美化工作,格式化部分的部分规则和 `prettier`不兼容
2. `eslint-config-prettier` 的作用是关闭`eslint`中与`prettier`相互冲突的规则。
3. `eslint-plugin-prettier` 的作用是赋予`eslint`用`prettier`格式化代码的能力
```js
// 安装依赖
yarn add eslint-config-prettier eslint-plugin-prettier -D

// .eslintrc
{
   // 其余的配置
 - "extends": ["eslint:recommended", "standard"]
 + "extends": ["eslint:recommended", "standard",  "plugin:prettier/recommended"]
  // 其余的配置
}
```
```js
// node_modules/eslint-plugin-prettier/eslint-plugin-prettier.js
module.exports = {
  // plugin:prettier/recommended 就是加载这个
  configs: {
    recommended: {
      extends: ['prettier'], // 通过 eslint-config-prettier 关闭eslint和prettier 相冲突的规则
      plugins: ['prettier'], // 加载 eslint-plugin-prettier，赋予 eslint 用 prettier 格式化文档的功能
      rules: {
        'prettier/prettier': 'error', // 让代码文件中不符合prettier格式化规则的都标记为错误，结合vscode-eslint插件便可以看到这些错误被标记为红色，当运行eslint --fix 命令时，将自动修复这些错误
        'arrow-body-style': 'off', // arrow-body-style 和 prefer-arrow-callback: 这两个规则在eslint 和 prettier 中存在不可解决的冲突，所以关闭掉。
        'prefer-arrow-callback': 'off',
      },
    },
  },
  // 其他的
}
```