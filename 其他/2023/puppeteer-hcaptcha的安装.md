# puppeteer-hcaptcha 的安装

1. 使用`npm i puppeteer-hcaptcha -S --ignore-scripts`忽略`install`脚本的执行
2. 修改`@tensorflow/tfjs-node`包中 http 请求的 proxy
3. 执行`@tensorflow/tfjs-node`中的`install`

## 查询 Ip

```js
const { data: data2 } = await axios
  .get("http://myip.ipip.net")
  .then((res) => {
    console.log(res);
    return res;
  })
  .catch((err) => {
    console.error(err.message);
    return {};
  });
```
