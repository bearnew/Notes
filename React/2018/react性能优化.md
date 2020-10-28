## 性能优化
1. dns预读取
```
<link rel="dns-prefetch" href="http://www.spreadfirefox.com/">
```
2. https://mp.weixin.qq.com/s/78xr6T5O6HKTVlIBu1UvnQ
3. 动态引入```react-loadable```
4. 懒加载```react-lazyload```
5. 动态链接库的生成和引用
```new webpack.DllPlugin```
```new webpack.DllReferencePlugin```
6. 使用`why-did-you-render`查找需要优化的点
7. 使用`react.pureComponent`（相当于`使用shouldComponentUpdate`）优化class，使用`React.memo`优化函数组件
8. css优化
* 加载性能： 提取公共css，组件css在组件中引入，打包到head标签中
* 解析性能： 
    * 让属性尽可能多的继承，而不是覆盖
    * css选择器从右向左解析，合理利用嵌套
    * css书写顺序，避免回流重绘（待验证）
    ```
    （1）展示类型及文档流相关：display float visibility clear
    
    （2）定位信息：position top right bottom left z-index

    （3）元素尺寸：width height overflow
    
    （4）边距边框：margin padding border outline list-style
    
    （5）文字样式：font-family   font-size   font-style   font-weight   font-varient   color   
    
    （6）文本属性：text-align   vertical-align   text-wrap   text-transform   text-indent    text-decoration   letter-spacing    word-spacing    white-space   text-overflow
    
    （7）背景：background
    
    （8）css3中新增属性：content   box-shadow   border-radius  transform……
    ```
    * 动画使用3d效果开启GPU硬件加速
    ```
    transform: translateZ(0);
    -webkit-transform: translate3d(250px,250px,250px)
    rotate3d(250px,250px,250px,-120deg)
    scale3d(0.5, 0.5, 0.5);
    ```
    * 加入stylelint,csslint
    
__参考__ 

https://mp.weixin.qq.com/s/KxJttCVuCoIrm9RAjRBrdg

https://zhuanlan.zhihu.com/p/37148975