# linux和windows文本换行不一致修复
1. .prettierrc.js
```js
{
    endOfLine: 'lf'
}
```
2. .gitattributes
```js
* text=auto eol=lf
```