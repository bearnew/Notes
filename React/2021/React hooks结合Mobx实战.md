# React hooks 结合 Mobx 实战

## 1.hooks 缓存问题

- `hooks`每次都会创建全新的闭包，闭包内的变量都是全新的，因此 hooks 函数需要缓存
- 通过`React.memo`进行缓存

```js
function App() {
  const xxx = useLocalStore(() => ({}));
  return useObserver(() => {
    return <div />;
  });
}
export default React.memo(App);
```

- 通过`useLocalStore`解决
  — 会运行一次初始化函数来创建可观察储存，并在组件的一个生命周期中保留它
  - 返回对象的所有属性都会自动获得可观察性，其中的 `getter` 会被转换为计算属性，其它的方法会被绑定到储存上并自动应用 `mobx transactions`，如果初始化函数返回了一个新的类实例则会原样保留
  - `useLocalStore`作为一个不变的对象存储数据，可以保证不同时刻对同一个函数的引用保持不变，不同时刻都能引用到同一个对象或者数据，由此可以避免 `useCallback` 和 `useRef` 的过度使用,缓存雪崩的问题都可以得到解决

```js
const TodoComponent = () => {
  const todo = useLocalStore(() => ({
    title: "Test",
    done: true,
    toggle() {
      todo.done = !todo.done;
    },
  }));
  return useObserver(() => (
    <h1 onClick={todo.toggle}>
      {todo.title} {todo.done ? "[DONE]" : "[TODO]"}
    </h1>
  ));
};
```

## 2.批量异步更新的问题

```js
// 组件挂载之后，拉取数据并重新渲染。不考虑报错的情况
function AppWithHooks() {
	const [data, setData] = useState({})
	const [loading, setLoading] = useState(true)
	useEffect(async () => {
		const data = await fetchData()
		// 由于在异步回调中，无法触发批量更新，所以会导致 setData 更新一次，setLoading 更新一次
		setData(data)
		setLoading(false)
	}, [])
	return (/* ui */)
}

function AppWithMobx() {
	const store = useLocalStore(() => ({
		data: {},
		loading: true,
	}))
	useEffect(async () => {
		const data = await fetchData()
		runInAction(() => {
			// 这里借助 mobx 的 action，可以很好的做到批量更新，此时组件只会更新一次
			store.data = data
			store.loading = false
		})
	}, [])
	return useObserver(() => (/* ui */))
}

```

## 3.react hooks 結合 mobx 的用法

1. 直接使用`observer`

```js
const ArticleMeta = observer((props: any) => {
  const article = props.article;
  return <div className="article-meta">{article}</div>;
});

export default ArticleMeta;
```

2. 使用`useObserver`和`useLocalStore`

```tsx
// 子store
class ArticleStore {}
export default new ArticleStore();
```

```tsx
// store
import React from "react";
import { useLocalStore } from "mobx-react-lite";

const rootStore: RootStore = {
  articleStore,
  userStore,
};

const storeContext = React.createContext<RootStore | null>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useLocalStore(() => rootStore);
  return (
    <storeContext.Provider value={store}>{children}</storeContext.Provider>
  );
};

export const useStore = () => {
  const store = React.useContext(storeContext);
  if (!store) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error("useStore must be used within a StoreProvider.");
  }
  return store;
};
```

```tsx
// app
ReactDOM.render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.getElementById("root")
);
```

```tsx
// component
interface IProps {
	id: number;
}

const Article: React.FC<IProps> = (props) => {
  const history = useHistory();
  const {  userStore } = useStore();

  return useObserver(() => {
	  const { currentUser } = userStore;
	  return (
		  <div>{currentUser}</div>
	  )
  })
```
