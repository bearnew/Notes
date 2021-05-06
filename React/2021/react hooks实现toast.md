# React hooks 实现 Toast

```tsx
const Toast = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  const [timer, setTimer] = useState("");
  const { text } = props;

  useImperativeHandle(ref, () => ({
    show() {
      if (timer) clearTimeout(timer);
      setShow(true);
      setTimer(
        setTimeout(() => {
          setShow(false);
        }, 3000)
      );
    },
  }));
  return (
    <CSSTransition in={show} timeout={300} classNames="drop" unmountOnExit>
      <ToastWrapper>
        <div className="text">{text}</div>
      </ToastWrapper>
    </CSSTransition>
  );
});

export default React.memo(Toast);
```

```tsx
function App() {
  const toastRef = useRef();

  useEffect(() => {
    const timerId = window.setTimeOut(() => {
      toastRef.current.show();
    }, 1000);

    return () => {
      clearTimeOut(timerId);
    };
  }, []);

  return <Toast text={modeText} ref={toastRef}></Toast>;
}
```
