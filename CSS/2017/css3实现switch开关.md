### css3实现switch开关
```html
<div class="switch-wrapper">  
    <input id="checked" type="checkbox" class="switch" />  
    <label for="checked"></label>  
</div> 
```

```css
.switch-wrapper {
    width: 45px;
}
.switch{   
    display:none;  
}   
label{   
    position:relative;   
    display: block;   
    padding: 1px;   
    border-radius: 24px;   
    height: 22px;   
    margin-bottom: 15px;   
    background-color: #eee;   
    cursor: pointer;   
    vertical-align: top;   
    -webkit-user-select: none;   
}   
label:before{   
    content: '';   
    display: block;   
    border-radius: 24px;   
    height: 22px;   
    background-color: #9E9E9E;   
    -webkit-transform: scale(1, 1);   
    -webkit-transition: all 0.3s ease;   
}   
label:after{   
    content: '';   
    position: absolute;   
    top: 50%;     
    left: 50%;     
    margin-top: -11px;     
    margin-left: -11px;   
    width: 22px;   
    height: 22px;   
    border-radius: 22px;   
    background-color: white;   
    box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.08);   
    -webkit-transform: translateX(-9px);   
    -webkit-transition: all 0.3s ease;   
}   
.switch:checked~label:after{   
    -webkit-transform: translateX(9px);   
}   
.switch:checked~label:before{   
    background-color:green;   
}  
```