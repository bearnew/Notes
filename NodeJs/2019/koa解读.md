## koa解读

1. koa优点
    * 完美解决了异步组合问题（回调地狱）
    * 解决了异步异常捕获问题
    * 无内置中间件，轻巧，灵活

2. context
    * ctx.req: node的request对象
    * ctx.res: node的response对象
    * ctx.request: koa的request对象
        * request.origin
        * request.host
        * request.url
        * request.header
        * request.method
        * request.querystring
        * request.query
        * request.body
        * request.fresh
    * ctx.response: koa的response对象
        * response.status
        * response.message
        * response.body
        * response.length
        * response.type
        * reponse.redirect
        * reponse.lastModified
        * response.etag
3. koa1中间件原理
