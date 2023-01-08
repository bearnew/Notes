# web性能
> https://www.cnblogs.com/strick/p/17008198.html
## 1.新指标
- `First Input Delay(FID)`首次输入延迟
- `Interaction to Next Paint(INP)`对输入的响应速度
## 2.在[Google Search Console](https://www.cnblogs.com/strick/p/17008198.html)查看页面情况
## 3.检测阻塞渲染的请求
```js
performance.getEntriesByType('resource').filter(r => r.renderBlockingStatus === 'blocking')
```
## 4.网站测试速度
- debugbear.com/test