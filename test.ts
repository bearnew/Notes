// useState
const fiberStates = {}; // 当前组件所有states
let curr = 0; // 当前state指针
const useState = (initialState) => {
    // state: 取链表里保存的或初始值
    const state = fiberStates[curr] || initialState;
    // setState
    const setState = (newState) => {
      fiberStates[curr] = newState;
      curr =
        // render(); // 进入渲染流程
    };

    curr += 1;
    return [state, setState];
};

const [count, setCount] = useState(1);
const [obj, setObj] = useState({ a: 1 });

console.log("111111", count, obj);
setCount(2);
setObj({ a: 2 });
console.log("111111", count, obj);
