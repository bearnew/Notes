## rn整体换行
```js
import HTMLView from 'react-native-htmlview';

render() {
    const html = '<p>就是会计师卡家附近啊懒啊就是看精是是as发阿斯顿发送到发送地方 sssss是sss的ss：<span>$&nbsp;6000</span></p>';

    <HTMLView
        value={html}
        stylesheet={styles}
    />
}

const styles = StyleSheet.create({
  p: {
    fontSize: 18,
    lineHeight: 24,
  },
  span: {
    color: '#FFB70B'
  }
});
```