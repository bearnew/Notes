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
## 三、HTML template