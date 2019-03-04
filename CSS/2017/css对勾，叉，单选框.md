### CSS实现对勾
```css
.select-checked-box {
    margin-top: 15px;
    border-radius: 50%;
    border:1px #933D4A solid;
    padding: 0 8px;
    position: relative;
    margin-right: 10px;
}

.select-checked {
    position: absolute;
    top: -2px;
    border-bottom: 3px solid #933D4A;
    border-right: 3px solid #933D4A;
    background-color: transparent;
    height: 7px;
    width: 3px;
    transform: rotate(45deg);
    transform-origin: -35% 30%;
}
```
### CSS实现叉
```css
.close-box {
	width: 30px;
	height: 30px;
	border-radius: 50%;
	background-color: #eee;
}
.close {
	position: relative;
    display: inline-block;
    width: 20px;
    height: 20px;
    overflow: hidden;
    top: 5px;
    left: 5px;
}
.close::before,.close::after{
	position: absolute;
	content: '';
	top: 50%;
	left: 0;
	margin-top: -1px;
	background: #FFF;
	width: 100%;
	height: 3px;
}
.close::before{
	-webkit-transform:rotate(45deg);
	-moz-transform:rotate(45deg);
	-ms-transform:rotate(45deg);
	-o-transform:rotate(45deg);
}
.close::after{
	-webkit-transform:rotate(-45deg);
	-moz-transform:rotate(-45deg);
	-ms-transform:rotate(-45deg);
	-o-transform:rotate(-45deg);
}
```
### CSS实现单选框
```css
/*单选框*/
.circle {
    display: inline-block;
    width:12px;
    height:12px;
    border-radius: 50%;
    border: 1px solid #FA8A48;
}

/*选中单选框*/
.selected-circle {
    display: inline-block;
    background-color: #FA8A48;
    width:12px;
    height:12px;
    border-radius: 50%;
    border: 1px solid #FA8A48;
    box-shadow: 0px 0px 0px 1.5px #fff inset;
}
```