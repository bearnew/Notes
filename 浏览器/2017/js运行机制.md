来源：
https://juejin.im/post/5a6547d0f265da3e283a1df7
https://www.cnblogs.com/wmhuang/p/11156367.html
https://zhuanlan.zhihu.com/p/140700610
#### 1. 进程和线程
+ __进程__
* 进程是cpu资源分配的最小单位（是能拥有资源和独立运行的最小单位）
* 进程是程序的一次执行过程，是程序执行过程中分配和管理资源的基本单位
* 进程可理解为正在执行的应用程序
* 进程启动后，获得CPU分配的内存空间，得到内存后，使用线程进行调度
* 应用程序为了满足功能，启动的进程会创建另外的辅助进程来处理其他任务，创建出的新的进程拥有全新的独立的内存空间
* 主进程与辅助进程之间通过IPC(inter process Communication)通行
* 很多应用程序都会采用多进程的方式来工作
* 当其中一个进程挂掉了之后，不会影响到其他进程的执行，只需要重启挂掉的进程就可以恢复运行。

![image](https://user-gold-cdn.xitu.io/2018/1/21/1611938b2d7c9377?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
+ __线程__
* 线程是cpu调度的最小单位（线程是建立在进程基础上的一次程序运行单位，一个进程中有多个线程）
* 与同属一个进程的其他线程共享进程所拥有的全部资源
* 线程可理解为应用程序中的代码执行器
__tips:__
+ 不同进程之间也可以通信，不过代价较大
+ 单线程和多线程，都是指在一个进程内的单和多（核心还是属于一个进程）
#### 2. 浏览器是多进程的
+ 系统给浏览器的进程分配了资源（cpu,内存）
+ 每打开一个Tab页，就创建了一个独立的浏览器进程。

![image](https://user-gold-cdn.xitu.io/2018/1/21/1611938b2d813f16?imageView2/0/w/1280/h/960/format/webp/ignore-error/1) 
#### 3. 浏览器包含的进程

1. __Browser进程__
>> 浏览器的主进程（负责协调，主控），只有一个。
+ 负责浏览器界面显示，与用户交互。如前进，后退、地址栏、书签栏等。
+ 负责各页面的管理，创建和销毁其他进程。
+ 将Renderer进程得到的内存中的Bitmap，绘制到用户界面上。
+ 网络资源的管理，下载，文件的访问等。
2. __第三方插件进程__
>> 每种类型的插件对应一个进程，仅当使用该插件时才创建。
3. __GPU进程__
>> 最多一个，用于3D绘制，负责整个应用程序的GPU任务
4. __Renderer进程__
>> 内部是多线程，负责页面渲染，脚本执行，事件处理 

__tips:__
浏览器有时会将多个进程合并（如打开多个空白标签页后，多个空白标签页会合并成一个进程）
![image](https://user-gold-cdn.xitu.io/2018/1/21/1611938b32460672?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

#### 4. 浏览器线程
1. `Browser Process` 划分出不同的工作线程
    * `UI thread`：控制浏览器上的按钮及输入框；
    * `network thread`：处理网络请求，从网上获取数据；
    * `storage thread`：控制文件等的访问；
2. 炫耀进程
    * 一个主线程（main thread）
    * 多个工作线程（work thread）
    * 一个合成器线程（compositor thread）
    * 多个光栅化线程（raster thread） 
3. GUI渲染线程
    * 负责渲染浏览器界面，解析HTML, CSS, 构建DOM树和RenderObject树，布局和绘制
    * 界面Repaint(重绘)或Reflow(回流)时，线程会执行
    * GUI渲染线程与JS引擎线程互斥，JS引擎执行时，GUI会被挂起，js引擎空闲后，GUI才会被执行
4. JS引擎线程
    * 负责解析javascript脚本，运行代码
    * 1个进程始终只有1个JS线程在运行js程序
    * js执行时间过长，会阻塞GUI的渲染线程

#### 5. 浏览器渲染流程
1. 流程
    1. 解析`html`建立`dom`树
    2. 解析`css`生成`CSSOM`规则树（css加载会阻塞render树渲染）
    3. 将`DOM`树与`CSSOM`树一起生成`render`树
    4. 绘制render树，绘制页面像素信息
2. 事件触发
    * DOM加载完成，不包括样式表、图片，DOMContentLoaded事件会触发(`dom ready`)
    * 所有DOM,样式表，脚本，图片加载完成，onload事件触发(`page load`)
3. 普通图层和复合图层
    1. 浏览器默认只有1个复合图层
    2. 其他render树绘制都会按普通图层渲染
    3. GPU（硬件加速）方式，可以声明一个新的复合图层
    4. 新的复合图层会脱离普通文档流，单独分配资源
    5. GPU方式
        1. translate3d, translateZ
        2. opacity/过渡动画（动画执行中，才会创建复合图层）
        3. will-change(提前告诉浏览器，有哪些属性需要变化，达到页面优化)
        4. <video>, <iframe>, <canvas>, <webgl>, 等元素
4. 进程的流程
    * 首先，当我们是要浏览一个网页，我们会在浏览器的地址栏里输入URL，这个时候Browser Process会向这个URL发送请求，获取这个URL的HTML内容，然后将HTML交给Renderer Process，
    * Renderer Process解析HTML内容，解析遇到需要请求网络的资源又返回来交给Browser Process进行加载，同时通知Browser Process，
    * 需要Plugin Process加载插件资源，执行插件代码。
    * 解析完成后，Renderer Process计算得到图像帧，并将这些图像帧交给GPU Process，GPU Process将其转化为图像显示屏幕。

 

#### 6.渲染事件
1. 白屏时间
    * 白屏时间 = 地址栏输入网址后回车 - 浏览器出现第一个元素
    * 影响白屏时间的因素：网络，服务端性能，前端页面结构设计。
2. 首屏时间
    * 首屏时间 = 地址栏输入网址后回车 - 浏览器第一屏渲染完成
    * 影响首屏时间的因素：白屏时间，资源下载执行时间。
3. 可交互时间
    * js执行完成，事件绑定完成，用户可交互的时间
4. 事件执行顺序
    * ![event order](https://github.com/bearnew/picture/blob/master/mardown/2020/%E6%B5%8F%E8%A7%88%E5%99%A8/timing-overview.png?raw=true)
    * `navigationStart`: 表示从上一个文档卸载结束时的 unix 时间戳，如果没有上一个文档，这个值将和 fetchStart 相等。
    * `unloadEventStart`: 表示前一个网页（与当前页面同域）unload 的时间戳，如果无前一个网页 unload 或者前一个网页与当前页面不同域，则值为 0。
    * `unloadEventEnd`: 返回前一个页面 unload 时间绑定的回掉函数执行完毕的时间戳。
    * `redirectStart`: 第一个 HTTP 重定向发生时的时间。有跳转且是同域名内的重定向才算，否则值为 0。
    * `redirectEnd`: 最后一个 HTTP 重定向完成时的时间。有跳转且是同域名内部的重定向才算，否则值为 0。
    * `fetchStart`: 浏览器准备好使用 HTTP 请求抓取文档的时间，这发生在检查本地缓存之前。
    * `domainLookupStart/domainLookupEnd`: DNS 域名查询开始/结束的时间，如果使用了本地缓存（即无 DNS 查询）或持久连接，则与 fetchStart 值相等
    * `connectStart`: HTTP（TCP）开始/重新 建立连接的时间，如果是持久连接，则与 fetchStart 值相等。
    * `connectEnd`: HTTP（TCP） 完成建立连接的时间（完成握手），如果是持久连接，则与 fetchStart 值相等。
    * `secureConnectionStart`: HTTPS 连接开始的时间，如果不是安全连接，则值为 0。
    * requestStart: HTTP 请求读取真实文档开始的时间（完成建立连接），包括从本地读取缓存。
    * responseStart: HTTP 开始接收响应的时间（获取到第一个字节），包括从本地读取缓存。
    * responseEnd: HTTP 响应全部接收完成的时间（获取到最后一个字节），包括从本地读取缓存。
    * domLoading: 开始解析渲染 DOM 树的时间，此时 Document.readyState 变为 loading，并将抛出 readystatechange 相关事件。
    * domInteractive: 完成解析 DOM 树的时间，Document.readyState 变为 interactive，并将抛出 readystatechange 相关事件，注意只是 DOM 树解析完    成，这时候并没有开始加载网页内的资源。
    * domContentLoadedEventStart: DOM 解析完成后，网页内资源加载开始的时间，在 DOMContentLoaded 事件抛出前发生。
    * domContentLoadedEventEnd: DOM 解析完成后，网页内资源加载完成的时间（如 JS 脚本加载执行完毕）。
    * domComplete: DOM 树解析完成，且资源也准备就绪的时间，Document.readyState 变为 complete，并将抛出 readystatechange 相关事件。
    * loadEventStart: load 事件发送给文档，也即 load 回调函数开始执行的时间。
    * loadEventEnd: load 事件的回调函数执行完毕的时间。