# transform的副作用（transform会限制子元素的宽度）
## 1.transform提高元素的垂直地位
```css
.ml-60 { margin-left: -60px; }
.transform { -ms-transform: scale(1); transform: scale(1); }
```
```html
<!-- mm2覆盖mm1 -->
<p>
    <img src="mm1.jpg">
    <img src="mm2.jpg" class="ml-60">
</p>
<!-- mm1覆盖mm2 -->
<p>
    <img src="mm1.jpg" class="transform">
    <img src="mm2.jpg" class="ml-60">
</p>
```
## 2.transform使position:fixed元素absolute化
## 3.无论是overflow容器还是嵌套子元素，只要有transform属性，就会hidden溢出的absolute元素
```css
.overflow { width: 191px; height: 191px; border: 2px solid #beceeb; overflow: hidden; }
.overflow img { position: absolute; }
.transform { -webkit-transform: scale(1); -ms-transform: scale(1); transform: scale(1); }
```
```html
<p><strong>图片自身transform</strong></p>
<div class="overflow">
    <img src="mm1.jpg" class="transform" />
</div>
<p><strong>overflow容器transform</strong></p>
<div class="overflow transform">
    <img src="mm1.jpg" />
</div>
<p><strong>overflow和图片之间内嵌元素transform</strong></p>
<div class="overflow">
    <div class="transform">
        <img src="mm1.jpg" />
    </div>
</div>
```
## 4.transform限制absolute的100%宽度大小
```css
.demo { position: relative; }
.container { width: 191px; height: 191px; border: 2px solid #beceeb; }
.container img {  position: absolute; height: 191px; width: 100%; }
.transform { -webkit-transform: scale(1); -ms-transform: scale(1); transform: scale(1); }
```
```html
<p><strong>容器不含transform</strong></p>
<div class="container">
    <img src="mm1.jpg" />
</div>
<p><strong>容器transform</strong></p>
<div class="container transform">
    <img src="mm1.jpg" />
</div>

```