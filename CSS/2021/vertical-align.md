# vertical-align
* line-height和子元素的vertical-align共同作用影响元素高度。
* 默认元素的基线与父元素的基线对齐，即vertical-align: baseline;，此时父元素heignt等于line-height。
* vertical-align属性变化，例 修改成`middle`，此时对齐方式为x的中心，而文字实际是下沉淀的，因此会撑开父元素的高度，height自然会大于line-height。
* 对`vertical-align: middle`元素的父元素设置`line-height: 1`, 此时就不会撑开祖元素的高度