# Grid网格布局
## 1. Grid布局的优势
* 固定或弹性的轨道尺寸
* 定位项目
* 创建额外的轨道来保存内容
* 对齐控制
* 控制重叠内容(z-index)
## 2. Grid vs Flexbox
* Flexbox是一维布局，只能在一条直线上放置内容区块
* Grid是一个二维布局，可将内容区块放置到任何地方
## 3. Grid概念
* Grid Container 网格容器
    * `display: grid`, 所有网格项的父元素
* Grid Item
    * 网格项，网格容器的子元素
* Grid Line
    * 网格线，组成网格项的分界线
* Grid Track
    * 网格线之间的网格轨道
* Grid Cell
    * 网格单元
* Grid Area
    * 网格区域，网格线包围的总空间
* fr(单位)
    * 剩余空间分配数
* gr(单位)
    * 网格数
```css
.container {
    display: grid;
    /* grid-template-columns: 100px 40% auto 1fr; */
    /* grid-template-columns: 100px [name1 name2] 40% auto 1fr; */
    /* grid-template-columns: 100px 100px 100px 100px; */
    /* grid-template-columns: repeat(4, 100px); */
    /* grid-template-columns: 100px fit-content(200px) fit-content(300px); */
    /* grid-template-columns: minmax(500px, 600px); */
    grid-template-columns: repeat(auto-fill, minmax(100px, 200px));
    grid-template-rows: 100px auto;
    /* grid-template-areas: "header header header header"
        "main main . sidebar"
        "footer footer footer footer"; */
    /* gap: 5px; */
    grid-column-gap: 5px;
    grid-row-gap: 5px;
    /* justify-items: center;
    align-items: center; */
    justify-content: space-between;
}

.item {
    background: green;
}

.item:first-of-type {
    /* grid-column-start: 2;
    grid-column-end: 2;
    grid-row-start: 4;
    grid-row-end: 2; */
    grid-column-start: 2;
    grid-column-end: span 2;
}
```
```html
<div class="container">
    <div class="item">One</div>
    <div class="item">Two</div>
    <div class="item">Three</div>
    <div class="item">Four</div>
    <div class="item">Five</div>
    <div class="item">One</div>
    <div class="item">Two</div>
    <div class="item">Three</div>
    <div class="item">Four</div>
    <div class="item">Five</div>
    <div class="item">One</div>
    <div class="item">Two</div>
    <div class="item">Three</div>
    <div class="item">Four</div>
    <div class="item">Five</div>
</div>
``` 
## 4.Grid属性
1. `display`
> 当元素设置了网格，flex也一样，column, float, clear, vertical-align都无效 
    * grid, 生成块级网格
    * inline-grid, 生成行内网格
    * subgrid, 继承父网格列 行的大小
3. `grid-template`
    * `grid-template-columns`， 定义每一列的宽度
        * track-size, 可以使用css长度(px, em)、百分比或者分数(用fr单位)
        * line-name, 可以选择任何名字，网格线名字
    * `grid-template-rows`, 定义每一行的高度
        * track-size, 可以使用css长度(px, em)、百分比或者分数(用fr单位)
        * line-name, 可以选择任何名字，网格线名字 
    * `grid-template-areas`, 定义网格区域
        * <grid-area-name>, 使用grid-area属性设置的网格区域的名称
        * '.': 点号代表一个空网格单元
        * none: 没有定义网格区域
    * `grid-template`简写
        * none: 将三个属性都设置为初始值
        * subgrid: 把`grid-template-rows`和`grid-template-columns`设置为subgrid, 并且`grid-template-areas`设置为初始值
        * grid/template-rows/grid-template-columns, 与此同时，设置grid-template-areas为none
4. `gap`
    * `grid-column-gap`
    * `grid-rows-gap`
    * 简写为<grid-row-gap>/<grid-clomun-gap>
5. `items`
    * `justify-items`, 沿着行轴对齐网格内的内容
        * start, 左对齐
        * end, 右对齐
        * center, 内容位于网格区域的中间位置
        * stretch, 内容宽度占据整个网格区域空间
    * `align-items`, 沿着竖轴对齐网格内的内容
        * start, 左对齐
        * end, 右对齐
        * center, 内容位于网格区域的中间位置
        * stretch, 内容宽度占据整个网格区域空间
    * 简写为`place-items`, <align-items>/<justify-items> 
6. `content`
    * `justify-content`, 设置网格容器内的网格内容沿着行轴对齐网格的对齐方式
        * start, 左对齐
        * end, 右对齐
        * center, 内容位于网格区域的中间位置
        * stretch, 内容宽度占据整个网格区域空间
        * space-around, 边缘间隙为中间间隙宽度的一半
        * space-between, 外边缘无间隙
        * space-evenly, 边缘间隙和中间间隙相同
    * `align-content`, 设置网格容器内的网格内容沿着竖轴对齐网格的对齐方式
        * start, 左对齐
        * end, 右对齐
        * center, 内容位于网格区域的中间位置
        * stretch, 内容宽度占据整个网格区域空间
        * space-around, 边缘间隙为中间间隙宽度的一半
        * space-between, 外边缘无间隙
        * space-evenly, 边缘间隙和中间间隙相同 
7. `grid-auto`
    * `grid-auto-column`, 指定自动生成的网格轨道（隐式网络轨道）的大小
        * track-size, 可以使用css长度(px, em)、百分比或者分数(用fr单位)
    * `grid-auto-rows`, 指定自动生成的网格轨道（隐式网络轨道）的大小
        * track-size, 可以使用css长度(px, em)、百分比或者分数(用fr单位)
    * `grid-auto-flow`
        * row, 依次填充每行，根据需要添加新行
        * column， 依次填充每列，根据需要添加新列
        * dense，如果后面出现较小的grid item, 尝试在网格中填充空洞  
8. `grid`
> 所有属性的简写
    * none
    * [grid-template-rows]/[grid-template-columns]
    * [grid-auto-flow][<grid-auto-rows>/<grid-auto-columns>]
## 5.CSS函数
1. repeat
    * 重复次数
        * 【number】, 确定确切的重复次数
        * 【auto-fill】, 以网格项为准自动填充
        * 【auto-fit】, 以网格容器为准自动填充
    * 值
        * 【length】, 非负长度
        * 【percentage】, 百分比
        * 【flex】， fr非负维度
2. fit-content, 网格内容适配
    * 【length】, 非负长度
    * 【percentage】, 百分比
    * 【flex】， fr非负维度
3. minmax(), 定义一个长度范围的闭区间
    * 【length】, 非负长度
    * 【percentage】, 百分比
    * 【flex】， fr非负维度
## 6.网格项上的属性
1. start/end, 使用特定的网格线确定grid item的位置
    * grid-column-start
        * [line], 用数字指定相应编号的网格线
        * span [number], 网格项将跨越指定数量的网格轨道
        * span [name], 网格项将跨越一些轨道，直到碰到指定命名的网格线
        * auto, 自动布局，或者自动跨越
    * grid-column-end
    * grid-row-start
    * grid-row-end
    * 可使用`grid-column`和`grid-row`简写
2. grid-area
    ```css
    .item-a {
        grid-area: row1-start / 2 / 3 / five;
    }
    <!-- 等价于 -->
    .item-a {
        grid-column-start: 2;
        grid-column-end: five;
        grid-row-start: row1-start;
        grid-row-end: 3;
    }
    ``` 
3. self, 单独的网格项的对齐方式
    * start
    * end
    * center
    * stretch
    ```css
    .item {
        justify-self: center
    }
    ```