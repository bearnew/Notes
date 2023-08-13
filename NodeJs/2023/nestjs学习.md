# nestjs 学习

#### 4. 5 种 HTTP 传输

- `url param`: url 中参数，Nest 中使用`@param`来获取

```js
http://guang.zxg/person/1111
```

- `query`: ulr 中?后的字符串，Nest 中使用`@Query`来获取

```js
http://guang.zxg/person?name=guang&age=20
```

- `form urlencoded`
  - 类似 `query` 字符串，只不过是放在 `body` 中
  - `Nest` 中使用 `@Body` 来取，`axios` 中需要指定 `content type` 为 `application/x-www-form-urlencoded`，并且对数据用 `qs` 或者 `query-string` 库做 `url encode`
- `json`
  - `json` 格式的数据。`Nest` 中使用 `@Body` 来取，`axios` 中不需要单独指定 `content type`，`axios` 内部会处理。
- `form data`
  - 通过 `-----` 作为 `boundary` 分隔的数据
  - 主要用于传输文件，`Nest` 中要使用 `FilesInterceptor` 来处理其中的 `binary` 字段，用 `@UseInterceptors` 来启用，其余字段用 `@Body` 来取
  - `axios` 中需要指定 `content type` 为 `multipart/form-data`，并且用 `FormData` 对象来封装传输的内容。

#### 5. IOC

1. 后端对象
   - `Controller`对象：接受 `http` 请求，调用 `Service`，返回响应
   - `Service`对象：实现业务逻辑
   - `Repository`对象：实现对数据库的增删改查
2. IOC
   - 解决了后端系统的对象依赖关系错综复杂的痛点问题
   - 在 `class` 上声明依赖了啥，然后让工具去分析我声明的依赖关系，根据先后顺序自动把对象创建好了，然后组装起来
   - `Nest` 里通过 `@Controller` 声明可以被注入的 `controller`，通过 `@Injectable` 声明可以被注入也可以注入别的对象的 `provider`，然后在 `@Module` 声明的模块里引入。
   - `Nest` 还提供了 `Module` 和 `Module` 之间的 `import`，可以引入别的模块的 `provider` 来注入
