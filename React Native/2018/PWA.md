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
4. 
