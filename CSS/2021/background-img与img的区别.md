# background-img 与 img 的区别

1. html 代码会被优先解析，而 css 代码则是在 html 解析完之后再执行，这也无形中告知我们，img 方法会比 background 方法更快速的显示图片
2. 对图片进行动画操作，background 对 GPU 的消耗更大，background 的页面会出现卡顿
3. img 语义清晰，对 seo 的支持更好
4. background 可以结合`css sprite`优化页面加载速度
5. 重要图片建议使用`img`,在页面加载时可以优先展示
