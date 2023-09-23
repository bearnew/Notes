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

8. 标记

- ==marked==

9. 上标

- 30^th^

10. 下标

- H~2~O

11. 脚注

- Content [^1]
- [^1]: Hi! This is a footnote

12. 缩略（去掉\）

- \*[HTML]: Hyper Text Markup Language
- \*[W3C]: World Wide Web Consortium
- The HTML specification
- is maintained by the W3C.

13. 表格合并

- 在`settings.json`中设置`"markdown-preview-enhanced.enableExtendedTableSyntax": true`

  | 1   | 2   |
  | --- | --- |
  | >   | 1   |
  | 2   | 5   |
  | 3   | ^   |

14. 打开``渲染数学表达式

- $...$ 或者 \(...\) 中的数学表达式将会在行内显示。
- $$...$$ 或者 \[...\] 或者 ```math 中的数学表达式将会在块内显示。
- $f(x) = sin(x) + 12$
- $$\sum_{n=1}^{100} n$$

15. 图像

- https://shd101wyy.github.io/markdown-preview-enhanced/#/zh-cn/diagrams
- @import "你得文件"

16. Code Chunk(支持代码的运行结果)

- ` "markdown-preview-enhanced.enableScriptExecution"`开启执行

```bash {cmd=true}
ls .
```

```javascript {cmd="node"}
const date = Date.now();
console.log(date.toString());
```

```gnuplot {cmd=true output="html"}
set terminal svg
set title "Simple Plots" font ",20"
set key left box
set samples 50
set style data points

plot [-10:10] sin(x),atan(x),cos(atan(x))
```
