# script module问题
* <script type="module">是用来加载 ES 模块的（事实的确如此），但是 <script type="module">也拥有更直接且实用的功能——加载浏览器可以处理的、使用 ES2015+ 语法的 JavaScript 文件
```html
<!-- Browsers with ES module support load this file. -->
<script type="module" src="main.js"></script>
 
<!-- Older browsers load this file (and module-supporting -->
<!-- browsers know *not* to load this file). -->
<script nomodule src="main-legacy.js"></script>
``` 