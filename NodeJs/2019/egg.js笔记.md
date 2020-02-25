# egg.js笔记
#### 1.扩展
* 我们可以通过定义`app/extend/{application,context,request,response}.js`来扩展 Koa 中对应的四个对象的原型
```js
// app/extend/context.js
module.exports = {
    get isIOS() {
        const iosReg = /iphone|ipad|ipod/i;
        return iosReg.test(this.get('user-agent'));
    },
};
```
```js
// app/controller/home.js
exports.handler = ctx => {
    ctx.body = ctx.isIOS
        ? 'Your operating system is iOS.'
        : 'Your operating system is not iOS.';
};
```
#### 2.框架内置基础对象
1. Application
    * 一个应用中只会实例化一个，继承自`Koa.Application`
    * 可以挂载一些全局的方法和对象，可以轻松的在插件或者应用中扩展`Application`事件
    * 事件
    ```js
    // app.js
    module.exports = app => {
        app.once('server', server => {
            // websocket
        });
        app.on('error', (err, ctx) => {
            // report error
        });
        app.on('request', ctx => {
            // log receive request
        });
        app.on('response', ctx => {
            // ctx.starttime is set by framework
            const used = Date.now() - ctx.starttime;
            // log total cost
        });
    };
    ```
    * 获取方式
    ```js

    ```