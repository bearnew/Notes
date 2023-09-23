# VSCode 技巧

## 基本技巧

1. Ctrl+alt+L 将相同的单词全部选中
2. 左侧 outline 可以查看目录
3. 左侧 timeline 查看代码编辑使劲阿信啊
4. alt+鼠标出现多个光标
5. alt + shift + 鼠标拖动出现多个光标
6. 显示代码行数

## Markdown Preview Enhance

1. 使用 TOC 添加目录
2. 自定义预览 CSS。
   - `Markdown Preview Enhanced: Customize Css`
3. 插入表格
   - `Markdown Preview Enhanced: Insert Table`
4. 增加 class
   ```javascript {.class1 .class}
   function add(x, y) {
     return x + y;
   }
   ```
5. 代码行数
   ```javascript {.line-numbers}
   function add(x, y) {
     return x + y;
   }
   ```
6. emoji
   - :smile:
   - :car:
   - :house:
7. 高亮代码

```javascript {highlight=10}

```

```javascript {highlight=10-20}

```

```javascript {highlight=[1-10,15,20-22]}

```

```js{highlight=[1-3]}
function Graph() {
  this.numbers = [
    [1, 2],
    [2, 3],
    [3, 1],
  ];
}
```
