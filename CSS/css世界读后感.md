## css世界读后感
### 1.长度单位(https://github.com/simaQ/cssfun/issues/1)
* 相对长度单位
    * 相对字体长度单位:
        ```
        em: 以父元素为参考对象
        rem：以根元素为参考对象
        ex：义为当前字体的小写x字母的高度或者 1/2 的 1em
        ch：定义为数字0的宽度
        ```
    * 相对视区长度单位
        ```vw, vh, vmin, vmax```
* 绝对长度单位
    ```px, pt(1pt＝1/72英寸，用于印刷业), cm(厘米), mm（毫米）, pt(相当于我国新四号铅字的尺寸)```
### 2.选择器
* 属性选择器
    指含有[]的选择器，eg:```[title]{}, [title="css-world"], [title~="css-world"], [title^="css-world"], [title$="css-world"]```
* 关系选择器
    * 相邻后代选择器：>
    * 兄弟选择器：～
    * 相邻兄弟选择器：+
### 3.css包裹性
* 文字少的时候会居中，文字多的时候会居左
```css
.box {
    text-align: center;
    .content {
        display: inline-block;
        text-align: left;
    }
}
```
