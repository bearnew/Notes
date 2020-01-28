# React Native
> Learn once, write anywhere
## 1.RN混合开发
1. 通用的UI界面与业务逻辑由RN实现，与手机平台关联的处理由原生代码实现
2. 将由原生代码实现的UI小部件，包装成RN的自定义组件
3. RN界面与原生界面可相互切换
4. react native的ui组件通过js bridge与原生平台ui组件一一对应 
    ![theory](https://github.com/bearnew/picture/blob/master/mardown/2019-08-18%20react%20native/theory2.png?raw=true)
5. ![event](https://github.com/bearnew/picture/blob/master/mardown/2019-08-18%20react%20native/event.png?raw=true)
## 2.RN 优劣点
* 优点： 
    1. RN相比webview，能够得到原生的用户体验，能够与原生代码双向通信，无缝衔接。 
    2. 高效的移动应用开发调试
    3. 灵活高效的应用热更新
    4. 有效降低移动应用安装包体积
    5. 对于javascript开发学习门槛低，开发难度低
* 缺点：
    1. 内存消耗略大
    2. 运行速度略慢
## 3.开发环境
#### 1.概览
* https://reactnative.cn/docs/getting-started.html
* mac支持ios, android调试
* windows不支持ios调试，需安装虚拟机VMWare + Mac
* 可以搭配react dev tools的插件进行开发调试
#### 2.react-native-cli（需要翻墙）
* 安装: https://facebook.github.io/react-native/docs/getting-started
#### 3.expo（无需翻墙）
* expo是使用同一代码库，构建、部署、快速迭代iOS, Android, web的工具和服务
* 官方文档：https://docs.expo.io/versions/latest/
* 不依赖java sdk,不依赖android studio, 推荐
* 模拟机安装`expo` 
    * https://docs.expo.io/versions/v34.0.0/introduction/installation/
* 真机安装`expo`
    * 下载apk: https://expo.io/tools#sdk
    * usb连接手机，打开手机usb调试，设置允许adb安装应用
    * `adb install Exponent-2.12.2.apk`
* 运行
    * tunnel:
        * https://docs.expo.io/versions/latest/workflow/how-expo-works/
        * https://ngrok.com/
    * lan:
        * 手机usb连接电脑，手机与电脑处于同一局域网
    * locale:
        * 手机usb连接电脑，打开开发人员调试
## 4.Flex布局
* react-native支持flexbox布局的大部分功能
* rn开发使用flexbox布局，解决了android, ios的屏幕适配功能
* 属性默认值差异
    * rn中，`flexDirection`属性默认值为`column`(纵向排列)，而不是`row`
    * rn中，`alignItems`默认值是`stretch`，而不是`flex-start`
    * rn中，`flex`只能指定一个数值
* 决定子组件排列规则的属性
    * flexDirection
    * flexWrap
    * justifyContent
    * alignItems
* 决定子组件自身显示规则的属性
    * alignSelf
    * flex
* flexDirection
    > 组件排列
    * `column`（default）: 纵向排列
    * `column-reverse`: 倒序纵向排列
    * `row`： 横向排列
    * `row-reverse`： 倒序横向排列
* flexWrap
    > 子组件超出父组件时，是否换行
    * `nowrap`(default): 不换行
    * `wrap`: 换行，第一行在上方
    * `wrap-reverse`: 换行，第一行在下方
* justifyContent
    > 设置主轴对齐方式, flexDirection为column, 则设置纵轴的对齐方式，flexDirection为row,则设置横轴的对齐方式
    * `flex-start`(default): 起点对齐
    * `flex-end`: 终点对齐
    * `center`: 居中
    * `space-between`: 两端对齐，项目中的间隔都相等
    * `space-around`: 项目之间的间隔相等，项目2端与边框的间隔是项目之间间隔的1/2
* align-items
    > 设置主轴对齐方式, flexDirection为column, 则设置横轴的对齐方式，flexDirection为row,则设置纵轴的对齐方式
    * `flex-start`(default): 起点对齐
    * `flex-end`: 终点对齐
    * `center`: 居中
    * `space-between`: 两端对齐，项目中的间隔都相等
    * `space-around`: 项目之间的间隔相等，项目2端与边框的间隔是项目之间间隔的1/2 
* align-self
    > 设置单个项目与同级项目不一样的对齐方式，可覆盖父级元素设置的align-items
    * auto(default)
    * flex-start
    * flex-end
    * center
    * baseline
    * stretch
* flex
    > 根据设置的flex值，动态计算所占空间大小

## 5.调试
* 真机，摇晃
* ios模拟器`command+d`
* android模拟器`comand+m`

## 6.React Native中的属性
1. 使用`Platform API`来判断平台
2. Navigator组件
    1. `pop`返回到上一页
    2. `push`跳转到下一页，当前页面的状态依旧保留
    3. `replace`替换当前页面
3. BackHandler监听`android`返回按钮事件
    * BackHandler.exitApp()
    * BackHandler.addEventListener(eventName, handler)
    * BackHandler.removeEventListener(eventName, handler)
4. 定义属性类型
    * 要求属性是`javascript`类型
        * `React.PropTypes.array`
        * `React.PropTypes.bool`
        * `React.PropTypes.func`
        * `React.PropTypes.number`
        * `React.PropTypes.object`
        * `React.PropTypes.string`
    * 要求属性是可渲染的节点
        * `React.PropTypes.node`
        * 可渲染节点指数字、字符串、数字数组、字符串数组
    * 要求属性是某个React元素
        * `React.PropTypes.element`
    * 要求属性是某个指定类的实例
        * `React.PropTypes.instanceOf(NameOfAClass)`
    * 要求属性取值为特定的几个值
        * `React.PropTypes.oneOf(['val1', 'val2'])`
    * 要求属性为指定类型中的任意一个
        ```js
        React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number,
            React.PropTypes.instanceOf(NameOfAClass)
        ])
        ``` 
    * 要求属性为指定类型的数组
        * `React.PropTypes.arrayOf(React.PropTypes.number)`
    * 要求属性是一个有特定成员变量的对象
        * `React.PropTypes.objectOf(React.PropTypes.number)`
    * 要求属性是一个指定构成方式的对象
        ```js
        React.PropTypes.shape({
            color: React.PropTypes.string,
            fontSize: React.PropTypes.number
        })
        ```
    * 属性可以是任意类型
        * `React.PropTypes.any`  
    * example
    ```js
    WaitingLeaf.propTypes = {
        phoneNumer:React.PropTypes.string.isRequired // 表示必须
    }
    ``` 
5. 定义属性默认值
    ```js
    WaitingLeaf.defaultProps = {
        phoneNumber: '123456'
    }
    ```
6. Alert弹出框
    * `static alert(title, message?, buttons?, options?)`
    * example
    ```js
    // iOS和Android上都可用
    Alert.alert(
    'Alert Title',
    'My Alert Msg',
    [
        {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => console.log('OK Pressed')},
    ],
    { cancelable: false }
    )
    ``` 
## 7.混合开发基础篇
1. IOS平台混合开发
    1. 建立原生语言模块（实现`RCTBridgeModule`协议Protocol的类）与`React Native`桥接
    2. `React Native`到IOS原生代码的消息
    ```js
    // React Native的桥接工作
    userPressAddressBook() {
        // 导出接口变量
        let ExampleInterface = require('react-native').NativeModules.ExampleInterface;
        ExampleInterface.sendMessage('{\"msgType\": \"pickContact\"}');
    }
    ```
    3. IOS到`React Native`代码的消息
        1. 回调接口
        2. 通过`eventDispatcher`向`React Native`模块发送事件 
2. 
 