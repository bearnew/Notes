## componentDidCatch

- 总是在浏览器中被调用
- 在 DOM 已更新的“提交阶段”期间调用
- 应该用于错误报告之类的东西

## getDerivedStateFromError

- 在服务器端渲染期间也称为
- 当 DOM 尚未更新时，在“提交阶段”之前调用
- 应该用于呈现后备 UI

## 错误边界无法捕获的异常

1. 事件处理器中的异常；
   - 处理方法： 使用 try/catch 代码进行捕获
2. 异步任务异常，如 setTiemout，ajax 请求异常等；
   - 处理方法：使用全局事件 window.addEventListener 捕获
3. 异常边界组件自身内的异常；
   - 处理方法：将边界组件和业务组件分离，各司其职，不能在边界组件中处理逻辑代码，也不能在业务组件中使用 didcatch

## ErroryBoundary 组件

```js
import React from "react";

interface IProps {
  FallbackElement?: React.ElementType<{ error: Error }>;
  onError?: (error: Error, info: React.ErrorInfo) => void;
  children: React.ReactNode;
}

interface IState {
  error: Error | null;
}

class ErroryBoundary extends React.Component<IProps, IState> {
  state: IState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    console.error("语法错误：", error);
    console.error("错误组件：", errorInfo);
  }

  render(): React.ReactNode {
    const { FallbackElement } = this.props;
    const { error } = this.state;

    if (!!error) {
      return React.isValidElement(FallbackElement) ? FallbackElement : null;
    }

    return this.props.children;
  }
}

export default ErroryBoundary;
```
