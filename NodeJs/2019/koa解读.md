## koa解读

1. koa优点
    * 完美解决了异步组合问题（回调地狱）
    * 解决了异步异常捕获问题
    * 无内置中间件，轻巧，灵活

2. context
    * ctx.req: node的request对象
    * ctx.res: node的response对象
    * ctx.request: koa的request对象
    * ctx.response: koa的response对象
    