# web component
## 一、自定义元素
### 1.扩展原生元素
* `<button>`元素对应`HTMLButtonElement`接口，类`MyButton`继承此接口，并且新增了单击事件的默认响应，即弹窗提示`Hello my-button`
* 然后使用`customElements.define`API进行注册，这个API有三个参数。第一个参数是`string`类型，指定扩展元素的`name`，对应扩展原生元素`is`属性的取值。这个参数的命名必须包括连字符`-`，否则会报错，这是为了与原生元素的标记进行区分。第二个参数是一个构造函数，即自定义元素的逻辑实体。构造函数的命名建议使用首字母大写的驼峰式命名并且与name的语义保持一致。第三个参数仅对扩展原生元素有效，前文提到`HTMLElement`接口与元素的对多对关系，必须通过`extends`指定被扩展的原生元素名称。
```js
class MyButton extends HTMLButtonElement {
    constructor() {
        super();
        this.addEventListener('click', e => alert('Hello my-button'));
    }
}

customElements.define('my-button', MyButton, { extends: 'button' });
```
```html
<button is='my-button'>Button</button>
```
### 2.新建独立元素
```js
class CircularRing extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        const size = this.getAttribute('radius') * 2;
        const innerColor = this.getAttribute('inner-color');
        const styles = `
            width: $(size)px;
            height: $(size)px;
            background-color: $(innerColor);
        `;
        this.innerHtTMl = '<div style="${styles}"></div>';
    }
}

customElements.define('circular-ring', CircularRing);
```
```html
<circular-ring radius="50" border-width="2" border-color="red" inner-color="yellow">
    <div style="width: 100px; height: 100px; box-sizing: border-box; background-color: yellow; border-radius: 50%; border: solid 2px red;">
</circular-ring>
```
```css
/* :defined伪类元素选择器代表自定义元素被注册后的状态 */
/* 使用:not伪元素选择器实现反向选择 */
circular-ring:not(:defined)::after {
    display: block;
    content: '';
    width: 100px;
    height: 100px;
    background-color: #dddddd;
}
```
### 3.生命周期
* ![lifecycle](https://github.com/bearnew/picture/blob/master/markdown_v2/2021/webcomponent/lifecycle.jpeg?raw=true)
* `connectedCallback`: 当元素被加入HTML文档后，即与`document`建立链接进入`connected`状态后被一次性触发
* `disconnectedCallback`: 与`connectedCallback`相反，当元素被从`HTML`文档中删除进入`disconnected`状态后被一次性触发。
* `attributeChangeCallback`: 监听元素属性的变化，每次改变后均触发
* `adoptedCallback`: 元素被从当前`document`移动到其他`document`后被触发，比如把`iframe`的元素移动到主文档中
## 二、Shadow Dom
* `Shadow Dom`可以创建一个与全局隔离的独立作用域，全局作用域和独立作用域的`css`和`javascript`互不影响。
* `iframe`封装了一个完整的执行上下文，`shadow dom`封装了一个较轻量的局部作用域
* `Shadow DOM`所在的子树作为全局`DOM Tree`的一部分被称为`Shadow Tree`
* 缺点：代码过于臃肿，缺乏良好的可读性和可复用性
* 当`attachShadow`的参数`mode`为`true`时返回一个`ShadowRoot`对象，它是一个`Document Fragment`，可以使用绝大多数的`DOM API`，如`querySelector`和`innerHTML`
* 使用`Shadow Dom`前，`HTML`结构被注入`<my-dialog>`节点，`css`被注入`<head>`，改造后`css`和`html`结构均被注入`<my-dialog>`的`shadowRoot`中
```js
class MyDialog extends HTMLElement {
    constructor() {
        super();
        this._style = `
            .my-dialog__wrapper {
                background-color: #fff;
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 0 20px;
                border: 1px solid #000;
                border-radius: 2px;
                overflow: hidden;
                display: none;
            }
            .my-dialog__wrapper[open='true'] {
                display: block;
            }
        `
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._close = this._close.bind(this);
    }
    get open() {
        if (this.$wrapper&&this.$wrapper.hasAttribute('open')) {
            return JSON.parse(this.$wrapper.getAttribute('open'));
        }
        return false;
    }
    set open(status) {
        this.$wrapper.setAttribute('open', status);
    }
    connectedCallback() {
        console.log('connectedCallback');
        const title = this.getAttribute('title');
        const content = this.getAttribute('content');
        this._shadowRoot.innerHTML = `
            <style>${this._style}</style>
            <div class='my-dialog__wrapper' open=${this.open}>
                <div class='my-dialog__head'>
                    <button class='my-dialog__close'>&times;</button>
                    <h2 class='my-dialog__title'>${title}</h2>
                </div>
                <div class='my-dialog__body'>
                    <div class='my-dialog__content'>${content}</div>
                </div>
            </div>
        `;
        this.$wrapper = this._shadowRoot.querySelector('.my-dialog__wrapper');
        this.$closeBtn = this.__shadowRoot.querySelector('.my-dialog__close');
        this.$closeBtn.addEventListener('click', this._close, false);
    }
}

customElements.define('my-dialog', MyDialog);

document.getElementById('btn-open-dialog').addEventListener('click', ev => {
    if (!$dialog) {
        createDialog();
    }
    $dialog.open = true;
}, false);

function createDialog() {
    const $dialog = document.createElement('my-dialog');
    $dialog.setAttribute('title', 'My Dialog Title');
    $dialog.setAttribute('content', 'My Dialog content');
    $dialog.setAttribute('name', Math.random());
    
    document.body.appendChild($dialog);
}
``` 
```html
<button class="btn" id="btn-open-dialog">open dialog</button>
```
## 三、HTML template
* `<template>`元素自身以及其内部的所有元素均不会被渲染，视觉上不可见。使用浏览器的开发者工具会发现，`<template>`的默认样式仅有`display: none`，其内部元素被一个`DocumentFragment`包裹，没有任何样式。
* `<template>`内部的所有元素在被激活之前不会被解析、图片不会被加载、`audio`和`video`不会被播放，`js`不会被执行
* `<template>`内部的所有元素均不存在于文档空间中，无法使用`document.querySelector`来获取它们
* 使用`importNode`或`cloneNode`激活`<template>`
* `web components`规范的`slot`与`Vue`的`slot`使用方法一致
```js
connectedCallback() {
    this._tpl = document.querySelector('#my-dialog-tpl');
    this._shadowRoot.appendChild(document.importNode(this._tpl.content, true));
    const title = this.getAttribute('title');
    const content = this.getAttribute('content');
    if (title) {
        const titleNode = document.createTextNode(title);
        this.__shadowRoot.querySelector('.my-dialog__title').appendChild(titleNode);
    }
}

```
```html
<template id='my-dialog-tpl'>
    <slot name="title"></slot>
</template>
```
## 四、使用多文件模式组织web component
* `my-dialog.tpl`存放html template, `my-dialog.js`, `my-dialog.css`
* runtime.js
```js
function initComponent(name, data) {
    const { template, style, script } = data;
    const $template = document.createElement('template');
    $template.setAttribute('id', `${name}-tpl`);
    $template.innerHTML = `<style>${style}</style>${template}`;
    document.body.appendChild($template);
    eval(javascript);
}
```
* compile.js
```js
function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf-8', (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
}

const readFiles = [
    readFile(sourceJsFileNames);
    readFile(sourceCSSFileNames);
    readFile(sourceTplFileNames);
]

Promise.all(readFiles).then(list => {
    const [ script, style, template ] = list;
    return { script, style, template };
}).then(data => {
    return `initComponent("${componentName}", ${JSON.stringify(data)})`;
}).then(content => {
    fs.writeFile(distFileName, content, err => {
        if (err) { throw err }
    })
})
```
* 在`index.html`中引入`runtime.js`和编译后的`my-dialog.js`即可
```html
<script src="runtime.js"></script>
<script src="dist/my-dialog.js"></script>
```  