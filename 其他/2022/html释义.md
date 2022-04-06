# html 释义

1. 文档类型声明

    - 保证浏览器以标准模式渲染我们的文档。否则浏览器会以兼容模式渲染我们的文档。在兼容下，排版会模拟 Navigator 4 与 Internet Explorer 5 的非标准行为。

    - eg

    ```html
    <!DOCTYPE html>
    ```

2. html 标签为根元素
    - dir 是一个指示元素中文本方向的枚举属性,ltr 的值含义是 left to right，表示文本从左到右书写。lang 定义了元素的语言类型,en 的值含义是英语。dir 和 lang 都是全局属性。
    - eg
    ```html
    <meta charset="utf-8" />
    ```
3. `meta` 是元数据标签
    - `charset` 指定文档的字符编码为'utf-8'
    - `name` 为全局属性，表明元数据名称，`content` 包含了元素的值，与 `name` 形成键值对映射
    - `viewport` 是 `css` 提供的元数据名称，为的初始大小提供指示，仅仅用于移动设备。`width` 定义视口的宽度，`device-width` 就是设备宽度；
    - `initial-scale`表示初始的缩放比例(纵向屏幕是 device-width 与 viewport 的缩放比例，横向则是 device-height); maximum-scale 定义缩放的最大值（取值为 0.0-10.0),user-scalable 指定用户是否可以缩放界面，0 表示无法缩放（iOS 10 开始，Safari iOS 默认忽略此规则）;
    - [viewport-fit=cover 用来适应 iponeX 的刘海屏，缩放视口去填充设备。](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
    - eg
    ```html
    <meta
        name="viewport"
        content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0,viewport-fit=cover"
    />
    ```
4. `preconnect`
    - preconnect 向浏览器提示用户可能需要来自目标资源源的资源
    - eg
    ```html
    <link rel="preconnect" href="//abs.twimg.com" />
    ```
5. `dns-prefetch`
    - 尝试在请求资源之前解析域名,节省 dns 解析时间。
    - eg
    ```html
    <link rel="dns-prefetch" href="//abs.twimg.com" />
    ```
6. `preload`
    - preload 指示预先获取和缓存对应资源,as 表示资源类型，crossorigin 是跨域资源共享属性, anonymous 将 credentials mode 设置为 same-origin，同域的请求会带上 Credentials。
    - Credentials 是指 HTTP cookies，TLS client certificates，authentication entries (for HTTP authentication)
    - eg
    ```html
    <link
        rel="preload"
        as="script"
        crossorigin="anonymous"
        href="https://abs.twimg.com/responsive-web/client-web/vendors~main.251a14e5.js"
        nonce="ODlhNDZiYmMtZGNiOC00MDcxLTg5MmYtMTg2Y2NkYjVhOTg2"
    />
    ```
7. `property`
    - property 表示同意网页内容被其他网站引用,og 是开放图协议，site_name 就是网站名称了。
    - eg
    ```html
    <meta property="og:site_name" content="Twitter" />
    ```
8. `apple-mobile-web-app-title`是将 web 应用添加到苹果启动图标上的名称。
    - eg
    ```html
    <meta name="apple-mobile-web-app-title" content="Twitter" />
    ```
9. `apple-mobile-web-app-status-bar-style`
    - apple-mobile-web-app-status-bar-style 是苹果特定的元标记,设置 Web 应用程序状态栏的样式
    - eg
    ```html
    <meta name="apple-mobile-web-app-status-bar-style" content="white" />
    ```
