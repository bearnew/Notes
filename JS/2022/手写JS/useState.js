// // useState
// const fiberStates = {}; // 当前组件所有states
// let curr; // 当前state指针
// const useState = (initialState) => {
//     // state: 取链表里保存的或初始值
//     const state = fiberStates[curr] || initialState;
//     // setState
//     const setState = (newState) => {
//         fiberStates[curr] = newState;
//         render(); // 进入渲染流程
//     };

//     curr = curr.next;
//     return [state, setState];
// };

let _state = [],
    _index = 0;
function useState(initialState) {
    let curIndex = _index; // 记录当前操作的索引
    _state[curIndex] =
        _state[curIndex] === undefined ? initialState : _state[curIndex];
    const setState = (newState) => {
        _state[curIndex] = newState;
        ReactDOM.render(<App />, rootElement);
    };
    _index += 1; // 下一个操作的索引
    return [_state[curIndex], setState];
}

const [count, setCount] = useState(1);
setCount(2);
const [obj, setObj] = useState({ a: 1 });
setObj({ a: 2 });
console.log("222222", _state);
