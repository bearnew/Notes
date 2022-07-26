# React Suspense

1. `Suspense` 组件捕获任何由子组件抛出的 `Promise`
2. 定义 `fallback` 来决定后备的渲染组件。
3. `Suspense`示例

```js
const initialResource = fetchProfileData(0);

function App() {
    const [resource, setResource] = useState(initialResource);
    return (
        <>
            <button
                onClick={() => {
                    const nextUserId = getNextId(resource.userId);
                    setResource(fetchProfileData(nextUserId));
                }}
            >
                Next
            </button>
            <ProfilePage resource={resource} />
        </>
    );
}

function ProfilePage({ resource }) {
    return (
        <Suspense fallback={<h1>Loading profile...</h1>}>
            <ProfileDetails resource={resource} />
            <Suspense fallback={<h1>Loading posts...</h1>}>
                <ProfileTimeline resource={resource} />
            </Suspense>
        </Suspense>
    );
}

function ProfileDetails({ resource }) {
    const user = resource.user.read();
    return <h1>{user.name}</h1>;
}

function ProfileTimeline({ resource }) {
    const posts = resource.posts.read();
    return (
        <ul>
            {posts.map((post) => (
                <li key={post.id}>{post.text}</li>
            ))}
        </ul>
    );
}
```

4. `Suspense`实现原理

```js
// create fetcher
var cached = {};
export const createFetcher = (promiseTask) => {
    let ref = cached;
    return () => {
        const task = promiseTask();
        task.then((res) => {
            ref = res;
        });
        if (ref === cached) {
            throw task;
        }
        return ref;
    };
};
```

```js
// Loading相等于suspense
// 1. 当我们调用一个带有createFetcher的render函数时，捕获抛出的Promise并渲染「加载中...」字样
// 2. 执行Promise.then操作，切换loading态，渲染我们带有createFetcher的render函数
// 3. 巧妙的制造了一个小循环，检查直到promise resolve以后，渲染子组件
export class Loading extends React.Component {
    private _mounted: boolean = false;
    state = {
        error: false
    };

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
      }

    componentDidCatch(error) {
        if (this._mounted) {
            if (typeof error.then === 'function') {
                this.setState({ error: true });
                error.then(() => {
                    if (this._mounted) {
                        this.setState({ error: false })
                    }
                });
            }
        }
    }
    componentDidMount() {
        this._mounted = true;
    }
    componentWillUnmount() {
        this._mounted = false;
    }

    render() {
        const { children } = this.props;
        const { error } = this.state;

        return children(error)
    }
}
```

```js
export var fetchSometingApi = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("加载完毕，这是你要的一段数据");
        }, 3000);
    });
};
const getData = createFetcher(fetchSometingApi);

const FangZheng = ({ name }) => {
    return <h1>{getData()}!</h1>;
};

class App extends React.Component {
    render() {
        return (
            // <Loading>
            //     {(isLoading: boolean) => isLoading ? '加载中' : <FangZheng />}
            // </Loading>
            <React.Suspense fallback={"加载中"}>
                <FangZheng />
            </React.Suspense>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));
```
