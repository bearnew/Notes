## BFC
1. Box, css布局的基本单位
    block-level-box: display: block|list-item|table
    inline-level-box: display: inline|inline-block|inline-table
2. BFC是块级格式化上下文，是一个独立的渲染区域，只有Block-level box参与
3. BFC布局规则
    1. 内部的Box会在垂直方向，一个接一个地放置。
    2. Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠
    3. 每个元素的margin box的左边， 与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
    4. BFC的区域不会与float box重叠。
    5. BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
    6. 计算BFC的高度时，浮动元素也参与计算
4. 哪些元素会生成BFC
    1. 根元素
    2. float属性不为none
    3. position为absolute或fixed
    4. display为inline-block tabbel-cell table-caption flex inline-flex\
    5. overflow不为visible
z-index值不为auto的flex项(父元素display:flex|inline-flex).
元素的opacity值不是1.
元素的transform值不是none.
元素mix-blend-mode值不是normal.
元素的filter值不是none.
元素的isolation值是isolate.
will-change指定的属性值为上面任意一个。
元素的-webkit-overflow-scrolling设为touch.
1. BFC的作用
    1. 自适应两栏布局
    2. 清除浮动
    3. 阻止margin重叠