## css 3d翻转
```html
<div class="reversal">
    <p class="face">正面</p>
    <p class="back">反面</p>
</div>
```
```css
.reversal {
    width:200px;
    height:200px; 
    border: 1px solid red; 
    margin:0 auto; 
    position: relative;
}
.face,.back {
    width:200px; 
    height:200px; 
    position: absolute; 
    text-align: center;  
    line-height: 200px;   
    backface-visibility: hidden; 
    transform-style: preserve-3d; 
    transition: transform 2s; 
}
.face{transform: rotateY(0deg);}
    .back{transform: rotateY(-180deg);}
.reversal:hover .back{transform:rotateY(0deg);}
.reversal:hover .face{transform:rotateY(180deg);}
```