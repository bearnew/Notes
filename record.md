## vant 文档分析

1. 支持版本切换
   - 提前部署好老版本文档站点
   - 只支持大版本的切换
     - v4: https://vant-contrib.gitee.io/vant/#/zh-CN
     - v3: https://vant-contrib.gitee.io/vant/v3/#/zh-CN
     - v2: https://vant-contrib.gitee.io/vant/v2/#/zh-CN/
     - v1: https://vant-contrib.gitee.io/vant/v1/#/en-US/intro
   - 不支持版本之间`changeLog`查看
2. 支持中英文切换
   1. 每个组件都包含 README.md 和 README.zh-CN.md 两个文件
   2. 通过`vite-plugin-md`将 README.md 和 README.zh-CN.md 渲染成`vue`组件， 放到 2 个不同的路由页面
   3. 切换中英文只需切换路由
3. demo 演示
   1. 每个组件文件下方都有个`demo`文件
   2. `demo`中的常量使用`key`值，渲染时根据中英文设置在 Map 对象中查找对应的语言的字符串
   3. 使用脚本遍历文件夹生成`vue route`，渲染到`demo`演示的区域
   4. 不支持在线代码编辑
   5. demo 和 markdown 文件分开编写
