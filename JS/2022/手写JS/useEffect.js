const lastDepsBox = [];
const lastClearCallbacks = [];
let index = 0;

const useEffect = (callback, deps) => {
    const lastDeps = lastDepsBox[index];
    const changed =
        !lastDeps || // 首次渲染，肯定触发
        !deps || // deps不传，次次触发
        deps.some((dep, index) => dep !== lastDeps[index]); // 正常比较

    if (changed) {
        lastDepsBox[index] = deps;
        if (lastClearCallbacks[index]) {
            // 清除函数
            lastClearCallbacks[index]();
        }
        lastClearCallbacks[index] = callback();
    }
    index++;
};
