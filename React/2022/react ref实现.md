# React Ref实现
## 1.react流程
1. 通过 jsx 写的代码会编译成 render function，执行产生 vdom，也就是 React Element 对象的树。
2. react 分为 render 和 commit 两个阶段:
3. render 阶段会递归做 vdom 转 fiber，beginWork 里递归进行 reconcile、reconcileChildren，completeWork 里创建 dom，记录增删改等 tag 和其他 effect
4. commit 阶段遍历 effect 链表，做三轮处理，这三轮分别叫做 before mutation、mutation、layout，mutation 阶段会根据 tag 做 dom 增删改。
## 2.ref实现原理
1. beginWork 处理到原生标签也就是 HostComponent 类型的时候，如果有 ref 属性会在 flags 里加一个标记。
2. completeWork 处理 fiber 节点的时候，flags 不是默认值的 fiber 节点会被记录到 effect 链表里，通过 firstEffect、lastEffefct、nextEffect 来记录这条链表。
3. commit 阶段会处理 effect 链表，在 mutation 阶段操作 dom 之前会清空 ref，在 layout 阶段会设置 ref，也就是把 fiber.stateNode 赋值给 ref.current。
4. react 并不关心 ref 是哪里创建的，用 createRef、useRef 创建的，或者 forwardRef 传过来的都行，甚至普通对象也可以，createRef、useRef 只是把普通对象 Object.seal 了一下。
5. forwarRef 是创建了单独的 vdom 类型，在 beginWork 处理到它的时候做了特殊处理，也就是把它的 ref 作为第二个参数传递给了函数组件，这就是它 ref 转发的原理。
6. useImperativeHandle 的底层实现就是 useEffect，只不过执行的函数是它指定的，bind 了传入的 ref 和 create 函数，这样在 layout 阶段调用 hook 的 effect 函数的时候就可以更新 ref 了。


