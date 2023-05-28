# gatsby

## 1.gatsby 由哪些组成

1. `Data Sources`
   1. CMS 内容文件管理
   2. Markdown
   3. Data(APIs, Databases, YAML, JSON, CSV,)
2. `GraphQL` 查询数据
   - 本地`GraphQL`服务器
3. `React`生成页面
4. `Deploy`

## 2.gatsby 做了哪些事情

1. SSR
2. Route-based Code Splitting
3. Modern APIs
   1. `IntersectionObserver`提前感知 link 是否出现在视窗，使用`<link ref="prefetch" />`去加载
   2. `image`使用`srcset`

## 3.gatsby 简单搭建

1. 安装`gatsby-cli`

```js
npm i gatsby-cli -D
```

2. 初始化项目

```js
npx gatsby new gatsby-starter-blog https://github.com/gatsbyjs/gatsby-starter-blog
```

3. `github pages`服务

```js
npm install gh-pages -D
```

4. 配置`gatsby.config.js`中配置无前缀

```js
module.exports = {
  pathPrefix: "/",
};
```

5. 添加`script`构建命令

```js
"deploy": "gatsby build --prefix-paths && npx gh-pages -d public",
```
