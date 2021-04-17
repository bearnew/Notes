# React RFC Server Components

## ServerComponent 是什么

1. `Server Components`是在服务端运行的`React`组件
2. `SSR`将组件在服务端渲染填充的`HTML`字符串，并在客户端`hydrate`后使用
3. `Server Components`运行环境是服务端，像客户端的普通组件一样
4. `Note`是请求并缓存数据的容器组件，`NoteEditor`是渲染`note`数据并执行用户交互的交互组件

```js
// waterfall请求-渲染模式
// 等待Note请求note成功后才能开始渲染
function Note(props) {
  const [note, setNote] = useState(null);
  useEffect(() => {
    fetchNote(props.id).then((noteData) => {
      setNote(noteData);
    });
  }, [props.id]);

  if (note === null) {
    return "Loading";
  } else {
    return <NoteEditor note={note} />;
  }
}
```

5. 在服务端运行需要进行数据请求的容器组件，在客户端运行交互组件

## ServerComponent 的意义

1. `ServerComponent`在服务端运行，天然更接近各种 IO（请求数据库、读取文件、缓存...）
2. 从数据库直接获取数据，借助`Suspense`，采用同步的写法

```js
function Note(props) {
  const note = db.notes.get(props.id);
  if (note === null) {
    return "Loading";
  }
  return <NoteEditor note={note} />;
}
```

3. `ServerComponent`会将`Note`组件及其从`IO`请求到的数据序列化为类似`JSX`的数据结构，以流的形式传递给前端
4. 客户端在运行时直接获取到填充了数据的流，并借助`Concurrent Mode`执行流式渲染。

## 0 打包体积

1. 组件`NoteWithMarkdown`在客户端渲染，有`206K`的体积
2. 将组件`NoteWithMarkdown`标记为`ServerComponent`，将引入并解析 MD 这部分逻辑放在服务端执行，从而减少了前端项目的打包体积

```js
import marked from "marked";
import sanitizeHtml from "sanitize-html";

function NoteWithMarkdown({ text }) {
  const html = sanitizeHtml(marked(text));
  return <>{html}</>;
}
```

## 自动代码分割

1. 通过使用`React.lazy`实现组件的动态`important`

## ServerComponent 的使用

```js
// Note.client.js
import fetchData from "./fetchData";
import NoteEditor from "./NoteEditor";

function Note(props) {
  const { id, isEditing } = props;
  const note = fetchData(id);

  return (
    <div>
      <h1>{note.title}</h1>
      <section>{note.body}</section>
      {isEditing ? <NoteEditor note={node} /> : null}
    </div>
  );
}
```

```js
// Note.server.js
import db from "db.server";
import NoteEditor from "./NoteEditor";

function Note(props) {
  const { id, isEditing } = props;
  const note = db.posts.get(id);

  return (
    <div>
      <h1>{note.title}</h1>
      <section>{note.body}</section>
      {isEditing ? <NoteEditor note={node} /> : null}
    </div>
  );
}
```
