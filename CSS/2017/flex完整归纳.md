#### flexDirection
* __row__ 从左到右依次排列
* __row-reverse__ 从右到左依次排列
* __column__ 从上到下排列
* __column-reverse__ 从下到到排列
#### flexWrap
* __flexWrap:nowrap__，不换行
* __flexWrap:wrap__ 一行显示不了的元素，换行显示
* __flexWrap:wrap-reverse__ 换行，第一行在下方
#### justifyContent
* __分配父容器主轴的弹性元素及周围空间
* __flex-start__(默认) 从行首开始排列
* __flex-end__ 从行尾开始排列
* __center__ 伸缩元素像每行的中点进行排列
* __space-between__ 在每行均匀分配弹性元素，相邻元素距离相同，每行第一个元素与行首对齐，每行最后一个元素与行尾对齐
* __space-around__ 在每行上均匀分配弹性元素，相邻元素距离相同，每一行第一个元素到行首的距离与每行最后一个元素到行尾的距离将会是相邻元素之间距离的一半
#### alignItems
* __在侧轴方向上与当前行上的弹性元素对齐
* __flex-start__ 元素向侧轴起点对齐
* __flex-end__ 元素向侧轴终点对齐
* __center__ 元素向侧轴居中
* __stretch__（默认） 弹性元素被在侧轴方向上拉伸到与容器相同的高度或宽度
#### alignSelf 
* __定义flex容器内被选中项目的对齐方式，注：alignSelf可以重写灵活容器的alignItems属性
* __auto__ (默认)元素继承了他的父容器align-items属性，如果没有父容器则为stretch
* __stretch__ 元素被拉伸以适应容器
* __center__ 元素位于容器的中心
* __flex-start__ 元素位于容器的开头
* __flex-end__ 元素位于容器的结尾
#### flex-grow
* 属性定义项目的放大比例
#### flex-shrink
* 属性定义项目的缩小比例
#### flex-basis
* 属性定义了在分配多余空间之前，项目占据的主轴空间（main size）
#### flex
* flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。
* 定义了一个可伸缩元素的能力，默认为0