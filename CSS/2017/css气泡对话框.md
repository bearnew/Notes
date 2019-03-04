#### html
```html
<div class="bubble">
    <span class="bot"></span>
    <span class="top"></span>
    CSS “边框法”实现气泡对话框效果一
</div>
```

#### css
```css
.bubble {
	position: relative;
	width: 150px; 
	padding: 5px; 
	margin-left: 60px; 
	background: #beceeb; 
	border-radius: 5px 5px 5px 0;
}
.bubble span {
	width:0; 
	height:0; 
	font-size:0; 
	overflow:hidden; 
	position:absolute;
}
.bubble span.bot {
    border-width: 10px;
    border-style: solid;
    border-color: #ffffff #beceeb #beceeb #ffffff;
    left: -20px;
    top: 42px;
}
.bubble span.top{
    border-width: 10px 20px;
    border-style: dashed solid solid dashed;
    border-color: transparent #ffffff #ffffff transparent;
    left: -40px;
    top: 52px;
}
```