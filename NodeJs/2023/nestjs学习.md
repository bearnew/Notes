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
