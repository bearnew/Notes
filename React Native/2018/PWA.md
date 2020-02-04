# PWA
> Progress Web App 渐进式Web应用程序
 
## PWA介绍
1. web应用体验不佳
    1. 网络资源下载带来的网络延迟
    2. web应用依赖浏览器作为入口
    3. 没有好的离线使用方案
    4. 没有好的消息通知方案
2. PWA
    1. 显著提高应用加载速度
    2. web应用可以在离线环境下使用
    3. web应用能够像原生应用一样被添加到主屏
    4. web应用能够在未被激活时发起推送通知
    5. web应用与操作系统集成能力进一步提高
## PWA关键技术
1. `Web App Manifest`
    * 通过1个清单文件向浏览器暴露web应用的元数据，包括名字、icon的URL等, 以被浏览器使用
    * 比如在添加到主屏或推送通知时暴露给操作系统，从而增强web应用与操作系统的集成能力
2. `Web App Manifest`属性
    1. `scope`
        * 定义了web应用的浏览作用域，比如作用域外的URL就会打开浏览器而不会在当前PWA里继续浏览
    2. `start_url`
        * 定义1个PWA的入口页面
    3. `orientation`
        * 锁定屏幕旋转
    4. `theme_color/background_color`
        * 主题色与背景色
        * 用于配置一些可定制的操作系统UI以提高用户体验，比如Android的状态栏、任务栏等 
3. `Service Worker`
    1. web应用离线使用的第3次尝试
        * 第1次`LocalServer`
        * 第2次`Application Cache`
    2. 可编程的`Web Worker`
    3. 像一个位于浏览器与网络之间的客户端代理，可以拦截、处理、响应流经的`HTTP`请求
    4. 配合`Cache Storage API`，可以自由管理`HTTP`请求文件粒度的缓存
    5. `Service Worker`声明周期
        * ![life cycle](https://github.com/bearnew/picture/blob/master/mardown/2020/PWA/lifeCycle.PNG?raw=true)
    6. `Service Worker`缓存策略
        * ![strategy](https://github.com/bearnew/picture/blob/master/mardown/2020/PWA/strategy.PNG?raw=true) 
    7. `Service Worker`安装
        ```js
        // sw.js
        self.oninstall = e => {
            e.waitUntil(
                caches.open('installation').then(cache => cache.addAll([
                    '/',
                    './styles.css',
                    './script.js'
                ]))
            )
        }
        ```
    8. `Service Worker`使用离线缓存
        ```js
        // sw.js
        self.onfetch = e => {
            const fetched = fetch(e.request);
            const cached = caches.match(e.request);

            e.respondWith(
                fetched.catch(_ => cached)
            )
        }
        ```
    9.  
4. `Push Notification`
    1. `Push API`的出现让推送服务具备了向web应用推送消息的能力
    2. 浏览器未被打开时，`Push API`也可以通过后台进程接收推送消息并调用`Notification API`向用户发出通知
    3. example
        ```js
        // sw.js
        self.addEventListener('push', event => {
            event.waitUntil(
                self.registration.showNotification('Hey!');
            )
        })

        self.addEventListener('notificationclick', event => {
            event.notification.close();
        })

        self.addEventListener('notificationclose', event => {
            event.notification.close();
        })
        ``` 
## PWA的演变
1. web应用
    * 迭代快
    * 获取用户成本低
    * 跨平台强体验弱
    * 开发成本低
    * 适合拉新
2. 原生应用
    * 迭代慢
    * 获取用户成本高
    * 跨平台弱体验强
    * 开发成本高
    * 适合保活
3. PWA
    * 同时具备了web应用和原生应用的优点

