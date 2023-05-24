# 实现1个Transition
```js
// useTransition
import { useEffect, useRef, useState } from 'react';

// enter，显示入场动画
// normal，正常显示
// leave，显示出场动画
export type Stage = 'enter' | 'leave';

export function useTransition(props: { isShow: boolean; timeout: number }) {
    const { isShow, timeout } = props;
    // 状态
    const [stage, setStage] = useState<Stage>(isShow ? 'enter' : 'leave');
    // 是否应该显示
    const [shouldMount, setShouldMount] = useState<boolean>(false);
    // 延时timer
    const timer = useRef<number>(0);

    useEffect(() => {
        if (isShow) {
            setStage('enter'); // 入场
            setShouldMount(true); // 渲染组件
        } else {
            setStage('leave'); // 出场
            timer.current = window.setTimeout(() => {
                setShouldMount(false); // 出场完成，不再渲染组件
            }, timeout);
        }

        return () => {
            window.clearTimeout(timer.current);
        };
    }, [isShow, timeout]);

    return {
        stage,
        shouldMount
    };
}
```
```js
// Transition组件
import React from 'react';
import { Stage, useTransition } from './useTransition';

type TransitionProps = {
    isShow: boolean;
    timeout: number;
    children: (stage: Stage, shouldMount: boolean) => React.ReactNode;
};

export function Transition({ isShow, timeout, children }: TransitionProps) {
    const { stage, shouldMount } = useTransition({ isShow, timeout });
    return <React.Fragment>{children(stage, shouldMount)}</React.Fragment>;
}

```
```js
// example
 <Transition isShow={isShow} timeout={400}>
    {(stage, shouldMount) =>
        shouldMount && (
            <div
                styleName={cls('wrap', {
                    enter: stage === 'enter',
                    leave: stage === 'leave'
                })}
            >
            </div>
        )
    }
</Transition>
```