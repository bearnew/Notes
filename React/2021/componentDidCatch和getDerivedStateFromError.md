## componentDidCatch

- 总是在浏览器中被调用
- 在 DOM 已更新的“提交阶段”期间调用
- 应该用于错误报告之类的东西

## getDerivedStateFromError

- 在服务器端渲染期间也称为
- 当 DOM 尚未更新时，在“提交阶段”之前调用
- 应该用于呈现后备 UI
