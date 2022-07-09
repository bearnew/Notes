# webkit 技术内幕

## 一.浏览器和浏览器内核

#### 1.浏览器特性

-   网络
-   资源管理：缓存资源、避免重复下载资源
-   网页浏览：将资源转变成可视化的结果
-   多页面管理：多页面相互之间影响和安全
-   插件和扩展
-   账户和同步：历史信息、书签同步服务器
-   安全机制
-   开发者工具

#### 2.H5 规范

| 类别       | 具体规范                                                                   |
| :--------- | :------------------------------------------------------------------------- |
| 存储       | Application cache, Local storage, Indexed DB                               |
| 连接       | web sockets，server-sent 事件                                              |
| 文件访问   | File Api, File system, FileWriter, ProgressEvents                          |
| 语义       | 各种新元素，media ,structural, 国际化, link relation,属性，form, microdata |
| 音频和视频 | HTML5 Video, Web Audio, WebRTC, Video track                                |
| 3D 和图形  | Canvas 2D,3D CSS 变换，WebGL,SVG                                           |
| 展示       | CSS3 2D/3D 变换，转换(transition),WebFonts 等                              |
| 性能       | Web worker, HTTP caching                                                   |
| 其他       | 触控和鼠标, shadow dom, css masking                                        |

#### 3.User Agent

1. 表明身份，服务器根据不同的 user-agent 返回不同的内容
2. 浏览器为了获得所有的内容，将主流浏览器的标识信息都添加进去

```js
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36
```

3. 修改`User-Agent`
    1. 在快捷方式上加上`--user-agent="xxx"`
    2. 在`network -> network conditions -> User agent`里面修改

#### 4.渲染引擎

1. ![渲染引擎](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/webkit%E6%8A%80%E6%9C%AF%E5%86%85%E5%B9%95/%E6%B8%B2%E6%9F%93%E5%BC%95%E6%93%8E%E5%88%86%E5%B1%82.PNG?raw=true)
2. ![渲染步骤](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/webkit%E6%8A%80%E6%9C%AF%E5%86%85%E5%B9%95/%E6%B8%B2%E6%9F%93%E5%BC%95%E6%93%8E%E6%AD%A5%E9%AA%A4.PNG?raw=true)
3. ![webkit架构](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/webkit%E6%8A%80%E6%9C%AF%E5%86%85%E5%B9%95/webkit%E5%A4%A7%E6%A8%A1%E5%9D%97.PNG?raw=true)

## 二、WebKit 架构和模块

1. ![chromium多线程](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/webkit%E6%8A%80%E6%9C%AF%E5%86%85%E5%B9%95/chromium%E5%A4%9A%E7%BA%BF%E7%A8%8B.PNG?raw=true)
2. ![chromium模块](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/webkit%E6%8A%80%E6%9C%AF%E5%86%85%E5%B9%95/chromium%E6%A8%A1%E5%9D%97.PNG?raw=true)
3. ![webkit架构和模块](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/webkit%E6%8A%80%E6%9C%AF%E5%86%85%E5%B9%95/webkit%E6%9E%B6%E6%9E%84%E5%92%8C%E6%A8%A1%E5%9D%97.PNG?raw=true)
