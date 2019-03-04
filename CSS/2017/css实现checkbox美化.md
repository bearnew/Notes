#### html 
```html
<label><input type="checkbox"><span></span></label>
```
#### css
```css
input[type="checkbox"]{
    appearance: none; 
    -webkit-appearance: none;
    outline: none;
    display:none
}

label{
    width:100px;
    height:100px;
    display:inline-block;
    cursor:pointer;
}
label input[type="checkbox"]+span{
    width:20px;
    height:20px;
    display:inline-block;
    background:url(http://sandbox.runjs.cn/uploads/rs/216/0y89gzo2/checkbox_01.gif)  no-repeat;background-position:0 0;
}
label input[type="checkbox"]:checked + span{
    background-position:0 -21px
}
```