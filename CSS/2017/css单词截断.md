##### word-break
+ word-break: break-all
> 单词放不下就换下一行显示，允许单词内换行 
+ word-break: keep-all
> 单词放不下换下一行显示，再放不下，溢出容器也不换行

##### word-wrap
+ normal
> 单词太长，换行显示，再超过一行就溢出显示。（与word-break:keep-all类似）
+ break-word
> 单词太长，先尝试换行，换行后还是太长，单词内换行

##### white-space
+ nowrap 
> 文本不会换行，文本会在在同一行上继续，直到遇到 <br> 标签为止。
##### 更多用法，请参考
> https://simmin.github.io/2017/03/23/css-wrap/