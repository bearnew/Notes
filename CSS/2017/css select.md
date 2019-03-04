#### select
```html
<select>
	<option value="" disabled selected hidden>所属分公司</option>  
	<option>成华区分公司</option>
	<option>成华区分公司</option>
	<option>成华区分公司</option>
</select>
```

```css
select {
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    border: 1px #eee solid;
    border-radius: 5px;
    /*很关键：将默认的select选择框样式清除*/
    appearance:none;
    -moz-appearance:none;
    -webkit-appearance:none;
    /*为下拉小箭头留出一点位置，避免被文字覆盖*/
    padding-left: 5px;
    padding-right: 14px;
    background: url("../images/triangle.jpg") no-repeat scroll right center transparent;
    background-size: 2rem 100%; 
}
select:focus {
    outline: none;
}
```