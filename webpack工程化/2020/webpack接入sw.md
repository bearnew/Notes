# webpack 接入 sw

## 1.使用`workbox`插件

```js
new WorkboxPlugin.GenerateSW({
  swDest: "assets/js/sw.js",
  // 这些选项帮助快速启用 ServiceWorkers
  // 不允许遗留任何“旧的” ServiceWorkers
  clientsClaim: true, // 立即接管
  skipWaiting: true, // 新 Service Worker 安装成功后需要进入等待阶段，skipWaiting: true 将使其跳过等待，安装成功后立即接管网站。
  cleanupOutdatedCaches: true, // 尝试删除老版本缓存
  inlineWorkboxRuntime: true,
  // inlineWorkboxRuntime: false,
  // importScripts: ['https://cdn.test.com/assets/js/workbox.js'],
  exclude: [/index.html/],
});
```

## 2.注册主域名路由

```js
// express
app.get("/sw.js", function (req, res, next) {
  try {
    res.sendFile("sw.js", { root: "static/dist/assets/js" });
  } catch {
    next();
  }
});
```

## 3.注册 sw

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

## 4.scope

- `scope` 的域名不能超过默认的注册作用域的范围，比如 `./a/b/sw.js` 的默认注册作用域为 `/a/b`，那 `scope` 不能设为 `/a`，浏览器会报错

* `Service Worker` 有自己的作用域，它是一个 `URL path` 地址，指的是 `Servcie Worker` 能够控制的页面的范围，例如：某个 `Service Worker` 的作用域为 `https://somehost/a/b/`， 那这个 `Service Worker` 能控制 `https://somehost/a/b/` 目录下的所有页面
* `Service Worker `可以处理这些页面里面的资源请求和网络请求，然后通过 `Service Worker` 自身的调度机制构建离线缓存策略。如果页面不在 `Service Worker` 的作用域范围内，`Service Worker` 就无法处理页面的任何资源或请求。

```html
<script>
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./a/b/sw.js", {
        // 手动指定一个作用域
        scope: "/a/b/c/",
      })
      .then((reg) => {
        console.log(reg.scope);
        // http://127.0.0.1:8000/a/b/c/
      });
  }
</script>
```

- 注销污染的`sw`

```js
<script>
  if ('serviceWorker' in navigator)
  {navigator.serviceWorker.getRegistrations().then((regs) => {
    for (let reg of regs) {
      // 注销掉不是当前作用域的所有的 Service Worker
      if (reg.scope !== "https://127.0.0.1:8000/a/") {
        reg.unregister();
      }
    }
    // 注销掉污染 Service Worker 之后再重新注册自己作用域的 Service Worker
    navigator.serviceWorker.register("./a-sw.js");
  })}
</script>
```
