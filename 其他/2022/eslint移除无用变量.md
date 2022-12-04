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