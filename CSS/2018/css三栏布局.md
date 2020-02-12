#### 中间自适应，两边固定(圣杯布局)
![image](https://github.com/bear-new/picture/blob/master/mardown/2018-05-26/layout1.PNG?raw=true)
##### 1.用margin和float实现
__css__:
```css
<style>
    .container div {
        height: 200px;
        line-height: 200px;
        text-align: center;
    }
    .left {
        float: left;
        width: 100px;
        background: yellow;
    }
    .right {
        float: right;
        width: 100px;
        background: green;
    }
    .center {
        margin: 0 100px;
        background: #ccc;
    }
</style>
```
__html__
```html
<!--非float元素在float元素前面时，float元素会被排斥，移动到下一行, 所以此处center放最后-->
<div class="container">
    <div class="left">left</div>
    <div class="right">right</div>
    <div class="center">center</div>
</div>
```
##### 2.用float，margin负值实现
__css__
```css
<style>
    /* 为了保证三列布局的元素没有重叠 */
    .container {
        margin: 0 100px;
    }

    .container div {
        height: 200px;
        line-height: 200px;
        text-align: center;
        float: left;
    }

    .left {
        position: relative;
        left: -100px;
        width: 100px;
        margin-left: -100%;
        background: yellow;
    }

    .right {
        position: relative;
        right: -100px;
        width: 100px;
        margin-left: -100px;
        background: green;
    }

    .center {
        width: 100%;
        background: #ccc;
    }
</style>
```
__html__
```html
<div class="container">
    <div class="center">center</div>
    <div class="left">left</div>
    <div class="right">right</div>
</div>
```
##### 3.用float，margin负值实现, 不使用left和right定位，使用inner div实现
> 淘宝的双飞翼布局
__css__
```css
.left,
.center,
.right {
    height: 200px;
    line-height: 200px;
    text-align: center;
    float: left;
}

.left {
    width: 100px;
    margin-left: -100%;
    background: yellow;
}

.right {
    width: 100px;
    margin-left: -100px;
    background: green;
}

.center {
    width: 100%;
    background: #ccc;
}

.inner {
    margin: 0 100px;
    background: lightcoral;
}
```
__html__
```html
<div class="container">
    <div class="center">
        <div class="inner">center</div>
    </div>
    <div class="left">left</div>
    <div class="right">right</div>
</div>
```
##### 4.用flex实现
__css__
```css
<style>
    .container {
        display: flex;
    }
    .container div {
        height: 200px;
        line-height: 200px;
        text-align: center;
    }
    .left {
        width: 100px;
        background: yellow;
    }
    .right {
        width: 100px;
        background: green;
    }
    .center {
        flex: 1;
        background: #ccc;
    }
</style>
```
__html__
```html
<div class="container">
    <div class="left">left</div>
    <div class="center">center</div>
    <div class="right">right</div>
</div>
```
#### 中间固定，两边自适应
![image](https://github.com/bear-new/picture/blob/master/mardown/2018-05-26/layout2.PNG?raw=true)
##### 1. 用margin和float实现
__css__
```css
<style>
    * {
        margin: 0;
        padding: 0;
        text-align: center;
    }
    .container {
        padding: 0 100px;
    }
    .left {
        float: left;
        width: 50%;
        margin-left: -100px;
        background: yellow;
    }
    .right {
        float: right;
        width: 50%;
        margin-right: -100px;
        background: green;
    }
    .center {
        float: left;
        width: 200px;
        background: #ccc;
    }
</style>
```
__html__
```html
<div class="container">
    <div class="left">left</div>
    <div class="center">center</div>
    <div class="right">right</div>
</div>
```
##### 2. 用flex实现
__css__
```css
<style>
    * {
        margin: 0;
        padding: 0;
        text-align: center;
    }
    .container {
        display: flex;
    }
    .left {
        flex: 1;
        background: yellow;
    }
    .right {
        flex: 1;
        background: green;
    }
    .center {
        width: 200px;
        background: #ccc;
    }
</style>
```
__html__
```html
<div class="container">
    <div class="left">left</div>
    <div class="center">center</div>
    <div class="right">right</div>
</div>
```