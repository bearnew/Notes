// 首先为以参数的形式为connect注入一些方法
export function createConnect({
    // connectAdvanced为react-redux暴露出的api
    connectHOC = connectAdvanced,
} = {}) {
    // connect方法
    return function connect(
        // 接受的四个参数
        mapStateToProps,
        mapDispatchToProps,
        mergeProps,
        {
            pure = true,  // 是否就行浅比较的配置
            strictEqual,  // 判断object引用, strictEqual(a, b)=> a === b
            shallowEqual, // 浅比较，上面介绍了
            ...extraOptions  // 其他配置项
        } = {}
    ) {
        // 一系列的方法执行，对三个参数的类型做了容错处理
        // 分别初始化了各自的参数mapStateToProps,mapDispatchToProps,mergeProps，注入了一些内部的默认参数和方法
        // 他们大致是这样的function： 
        // (dispatch, options) => initProxySelector() => mapToPropsProxy() => props
        const initMapStateToProps = match(...args)
        const initMapDispatchToProps = match(...args)
        const initMergeProps = match(...args)
        // 返回值由执行connectAdvanced获取,并传入初始化的initMapStateToProps等参数和pure等配置项
        return connectAdvanced(selectorFactory, {
            initMapStateToProps,
            initMapDispatchToProps,
            initMergeProps,
            pure,
            ...extraOptions
        })
    }
}

// 直接执行createConnect方法返回connect
export default createConnect()