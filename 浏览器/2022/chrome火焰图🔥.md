# chrome 火焰图

### 1.overview

1. `FPS`: 绿色竖线越高，FPS 越高，红色代表卡顿
2. `CPU`: 面积越大，`CPU`在消耗越大，越耗性能
3. `NETWORK`: 每个时间节点网络请求和帧画面

### 2.火焰图颜色

<table>
    <tr>
        <th>color</th><th>overview</th><th>event</th><th>description</th>
    </tr>
    <tr>
        <td rowspan="5">蓝色(loading)</td><td rowspan="5">网络通信和HTML解析</td><td>Send Request</td><td>发送网络请求时触发</td>
    </tr>
    <tr>
        <td>Receive Response</td><td>响应头报文到达时触发</td>
    </tr>
    <tr>
        <td>Receive Data</td><td>请求的响应数据到达事件，如果响应数据很大（拆包），可能会多次触发该事件</td>
    </tr>
    <tr>
        <td>Finish Loading</td><td>网络请求完毕事件</td>
    </tr>
    <tr>
        <td>Parse HTML</td><td>浏览器执行HTML解析</td>
    </tr>
    <tr>
        <td rowspan="5">黄色(Scripting)</td><td rowspan="5">Javascript执行</td><td>DOMContentLoaded</td><td>当页面中的DOM内容加载并解析完毕时触发</td>
    </tr>
    <tr>
        <td>Evaluate Script</td><td>解析和执行JS</td>
    </tr>
    <tr>
        <td>Animation Frame Fired</td><td>一个定义好的动画帧发生并开始回调处理时触发</td>
    </tr>
    <tr>
        <td>Cancel Animation Frame</td><td>取消一个动画帧时触发</td>
    </tr>
    <tr>
        <td>Request Animation Frame	</td><td>requestAnimationFrame（）调用预定一个新帧</td>
    </tr>
    <tr>
        <td rowspan="4">紫色(Rendering)</td><td rowspan="4">样式计算和布局，即重排</td><td>Invalidate layout</td><td>当DOM更改导致页面布局失效时触发</td>
    </tr>
    <tr>
        <td>Recalculate style</td><td>Chrome重新计算元素样式时触发</td>
    </tr>
    <tr>
        <td>Layout</td><td>页面布局计算执行时触发</td>
    </tr>
    <tr>
        <td>Scroll</td><td>内嵌的视窗滚动时触发</td>
    </tr>
    <tr>
        <td rowspan="2">绿色(Painting)</td><td rowspan="2">样式计算和布局，即重排</td><td>Paint</td><td>合并后的层被绘制到对应显示区域后触发</td>
    </tr>
    <tr>
        <td>Composite Layers</td><td>Chrome的渲染引擎完成图片层合并时触发</td>
    </tr>
    <tr>
        <td rowspan="1">灰色(other)</td><td rowspan="1">其它事件花费的时间</td><td>-</td><td>-</td>
    </tr>
    <tr>
        <td rowspan="1">白色(Idle)</td><td rowspan="1">空闲时间</td><td>-</td><td>-</td>
    </tr>
</table>

### 3.图解

-   ![performance](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/chrome%20devtools/chrome_performance.png?raw=true)
-   ![js_time](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/chrome%20devtools/chrome_performance_js_time.png?raw=true)
