## 原理
* defer, 整个页面渲染完成（dom结构完全生成），按照defer脚本申明顺序执行脚本
* async, 下载完即中断渲染，立即执行，多个async是不能保证加载顺序的
* module, 等同于defer属性，```<script type="module" src="foo.js" async></script>```等同于async属性
* module的优点
    * 模块在模块作用域中运行，模块内部的顶层变量，外部不可见
    * 同一个模块加载多次，只会执行一次
* ![加载方式](https://github.com/bearnew/picture/blob/master/mardown/2019-07-11/script-load.png?raw=true)
* 不同类型 script 的执行顺序及其是否阻塞解析 HTML

|script 标签|	JS 执行顺序|	是否阻塞解析 HTML|
|:----:|:----:|:----:|
| \<script> |	在 HTML 中的顺序 |	阻塞 |
| \<script async> |	网络请求返回顺序 |	可能阻塞，也可能不阻塞 |
| \<script defer> |	在 HTML 中的顺序 |	不阻塞 |