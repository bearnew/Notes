# webpack接入sw
## 1.使用`workbox`插件
```js
new WorkboxPlugin.GenerateSW({
    swDest: 'assets/js/sw.js',
    // 这些选项帮助快速启用 ServiceWorkers
    // 不允许遗留任何“旧的” ServiceWorkers
    clientsClaim: true, // 立即接管
    skipWaiting: true, // 新 Service Worker 安装成功后需要进入等待阶段，skipWaiting: true 将使其跳过等待，安装成功后立即接管网站。
    cleanupOutdatedCaches: true, // 尝试删除老版本缓存
    inlineWorkboxRuntime: true,
    // inlineWorkboxRuntime: false,
    // importScripts: ['https://cdn.test.com/assets/js/workbox.js'],
    exclude: [/index.html/]
})
```
## 2.注册主域名路由
```js
// express
app.get('/sw.js', function (req, res, next) {
    try {
        res.sendFile('sw.js', { root: 'static/dist/assets/js' });
    } catch {
        next();
    }
});
```
## 3.注册sw
```js
<script>
try {
    if (navigator && navigator.serviceWorker) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js').then(function(registration) {
                console.log('SW registered: ', registration);
                window.__cartoonEventRecord(130074);
            }).catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
        });
    }
} catch(err) {
    console.error(err);
}
</script>
```