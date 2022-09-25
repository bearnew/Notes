# script error
1. 受浏览器同源策略限制，未知跨域脚本执行错误时，抛出的错误信息为 `Script error`，导致开发者无法定位具体错误。
2. 为了获取详细错误信息及堆栈，一般解法是给 `Script` 标签配置 `crossorigin` 属性，同时对应脚本服务端需配置 `Access-Control-Allow-Origin` 响应头。
