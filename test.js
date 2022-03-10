let _state = [],
    _index = 0;
function useState(initialState) {
    console.log(_index, initialState);
    let curIndex = _index; // 记录当前操作的索引
    _state[curIndex] =
        _state[curIndex] === undefined ? initialState : _state[curIndex];
    const setState = (newState) => {
        _state[curIndex] = newState;
        // ReactDOM.render(<App />, rootElement);
        // _index = 0; // 每更新一次都需要将_index归零，才不会不断重复增加_state
    };
    _index += 1; // 下一个操作的索引
    return [_state[curIndex], setState];
}

const [count, setCount] = useState(1);
setCount(2);
const [obj, setObj] = useState({ a: 1 });
setObj({ a: 2 });
console.log("222222", _state);
