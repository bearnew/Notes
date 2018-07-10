#### 中间自适应，两边固定
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
    .container div {
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
##### 3.用flex实现
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