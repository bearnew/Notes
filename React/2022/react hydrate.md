# react hydrate
> https://juejin.cn/post/7122111668053606437
1. `ReactDom.render`流程
    1. 调用document.createElement为HostComponent类型的 fiber 节点创建真实的 DOM 实例。或者调用document.createTextNode为HostText类型的 fiber 节点创建真实的 DOM 实例
    2. 将 fiber 节点关联到真实 dom 的__reactFiber$rsdw3t27flk(后面是随机数)属性上。
    3. 将 fiber 节点的pendingProps 属性关联到真实 dom 的__reactProps$rsdw3t27flk(后面是随机数)属性上
    4. 将真实的 dom 实例关联到fiber.stateNode属性上：fiber.stateNode = dom。
    5. 遍历 pendingProps，给真实的dom设置属性，比如设置 id、textContent 等
2. `ReactDOM.hydrate`流程
    1. React 在 render 阶段，构造 workInProgress 树时，同时按相同的顺序遍历真实的 DOM 树，判断当前的 workInProgress fiber 节点和同一位置的 dom 实例是否满足hydrate的条件
    2. React 在 render 阶段构造HostComponent或者HostText类型的 fiber 节点时，会首先调用 tryToClaimNextHydratableInstance(workInProgress) 方法尝试给当前 fiber 混合(hydrate)DOM 实例
    3. 如果当前 fiber 不能被混合，那当前节点的所有子节点在后续的 render 过程中都不再进行hydrate，而是直接创建 dom 实例。
    4. 等到当前节点所有子节点都调用completeUnitOfWork完成工作后，又会从当前节点的兄弟节点开始尝试混合。
3. `hydrate`目的
    - hydrate的终极目标就是，在构造 workInProgress 树的过程中，尽可能的复用当前浏览器已经存在的 DOM 实例以及 DOM 上的属性，这样就无需再为 fiber 节点创建 DOM 实例，同时对比现有的 DOM 的attribute以及 fiber 的pendingProps，找出差异的属性。然后将 dom 实例和 fiber 节点相互关联(通过 dom 实例的__reactFiber$以及__reactProps$，fiber 的 stateNode 相互关联)
