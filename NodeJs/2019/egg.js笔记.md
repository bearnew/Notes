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
