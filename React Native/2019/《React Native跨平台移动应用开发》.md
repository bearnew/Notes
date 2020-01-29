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
    * flex是`flex-grow`, `flex-shrink`, `flex-basis`的缩写，默认值是`0 1 auto`
    * flex-basis
        * 用来设置元素的宽度，会覆盖掉width的值
    * flex-grow
        * 当父元素的宽度大于子元素的宽度的和时，子元素如何分配剩余空间
        * 默认为0，表示不索取父元素的剩余空间
        * 如果有2个子元素A和B，A的flex-grow为1，B的flex-grow为2，则剩余空间被A索取1/3，被B索取2/3
    * flex-shrink
        * 当父元素的宽度小于子元素的宽度的和时，子元素如何缩小自己的宽度
        * 值为0，表示不缩小，值越大，缩小的越大
        * 如：父元素宽度为200px, 子元素A, B的宽度分别为100px, 200px, A和B的`flex-shrink`都为0，则会有100px超出父元素
        * 如：如果A设置flex-shrink为2，B设置flex-shrink为3，则A减小宽度40px, B减小宽度60px 

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
    4. 原生代码可声明`RCTAsyncLocalStorage`模块创建一个属于自己的队列，这样React Native就不会因为`RCTAsyncLocalStorage`模块进行缓慢的磁盘操作而堵塞。
    5. 原生代码也可实现`promise`机制
    6. 原生代码可以通过`constantToExport`函数将常量和枚举类型导出到`React Native`侧
2. Android平台混合开发
    1. 在Android建立接口类，实现`React Native`与`Android`的代码互通
    2. React Native代码到Android原生代码的消息
        * Android继承`ReactContextBaseJavaModule`类，实现React Native需要调用的方法
    3. Android到React Native的消息
        * example
        ```js
        userPressAddressBook() {
            DeviceEventEmitter.addListener('AndroidToRNMessage',
                this.handleAndroidMessage.bind(this)
            );
            var { NativeModules } = require('react-native');
            let ExampleInterface = NativeModules.ExampleInterface;
            NativeModules.ExampleInterface.HandleMessage('testMessage');
        }
        handleAndroidMessage(aMessage) {
            console.log('handleAndroidMessage:' + aMessage);
            let aObj = JSON.parse(aMessage);
            this.setState({
                inputedNum: aObj.peerNumber
            })
        }
        ```
## 8.flexbox布局，View, Image与可触摸组件
1. flexbox布局
    1. 位置及宽、高相关样式键
        1. 当position为absolute时，可使用top, bottom, left, right
        2. 当position为relative时，只有top和left有效
        3. flexbox布局中，宽高时动态改变的
        3. 在flexbox布局中，设置width和height无效，设置maxHeight, minHeight, maxWidth, minWidth有效
    2. flex布局
    3. 边框，空隙，填充
        1. 边框宽度
            * borderWidth
            * borderTopWidth
            * borderRightWidth
            * borderBottomWidth
            * borderLeftWidth
        2. 填充宽度
            * paddingHorizontal: 对水平两个边有效
            * paddingVertical: 对垂直两个边有效
            * paddingBottom
            * paddingLeft
            * paddingRight
            * paddingTop
        3. 空隙宽度
            * marginHorizontal: 对水平两个边有效
            * marginVertical: 对垂直两个边有效
            * marginBottom
            * marginLeft
            * marginRight
            * marginTop
    4. zIndex
        * 两个组件重叠时，zIndex值大的那个组件会覆盖另一个组件
        * zIndex值相等时，JSX代码中后渲染的组件将会覆盖住先渲染的组件
    5. 组件多样式声明与动态样式声明
        ```js
        <Text style={[styles.container, styles.aStyle, styles.bStyle]}></Text>
        ```
2. View组件
    1. View的颜色与边框
        1. 默认的背景颜色是非常浅的灰色
        2. 只有Text和TextInput会继承父组件的背景颜色，其他组件都需要自己设置背景颜色
        3. Opacity, 取值0-1, 定义View组件的透明度
        4. borderStyle
            * solid: 实线边框
            * dotted: 点状边框
            * dashed: 虚线边框
        5. 边框颜色
            * borderColor
            * borderTopColor
            * borderRightColor
            * borderBottomColor
            * borderLeftColor
        5. 边框圆角
            * borderRadius
            * borderTopLeftRadius
            * borderTopRightRadius
            * borderBottomLeftRadius
            * borderBottomRightRadius
    2. View组件的阴影与其他视觉效果
        1. 阴影
            * shadowColor: 阴影颜色
            * shadowOffset: 阴影位移值
            * shadowOpacity: 阴影透明度
            * shadowRadius: 阴影圆角率
        2. overflow
            * hidden: 隐藏超出部分
            * visible: 显示超出部分
            * 只对IOS平台有效，在Android上设置为visible, 显示的特性也仍然是hidden
        3. backfaceVisibility
            * 定义元素不面向屏幕时是否可见
            * visible: 背面是可见的
            * hidden: 背面是不可见的
        4. elevation
            * 只对Android有效
            * 在组件周围渲染阴影
    3. View组件的变形
        1. transform
            * perspective: number, `transform: [{perspective: 150}]`
            * rotate: string, `transform: [{rotate: '45deg'}]`
            * rotateX: string
            * rotateY: string
            * rotateZ: string
            * scale: number, `transform: [{scale: 2}]`
            * scaleX: number
            * scaleY: number
            * translateX: number, `transform: [{translateX: 200}]`
            * translateY: number
            * skewX: string, `transform: [{skewX: '45deg'}]` 倾斜
            * skewY: string
    4. view组件的回调函数
        1. onLayout: View组件被加载或者布局改变时，回调函数被调用
        2. 触摸事件
            * 触摸事件的3个回调函数都会收到一个event对象参数
            * 通过event参数可以知道事件的发生时间，以及事件发生时，用户的手指在屏幕上的位置
                ```js
                // event的值
                {
                    timeStamp: aNumber,
                    nativeEvent: {
                        locationX: aNumber,
                        locationY: aNumber
                    }
                }
                ```
            * onTouchStart
            * onTouchMove
            * onTouchEnd
            * onMagicTap: 双指轻点屏幕2次
    5. View组件的其他属性
        * removeClippedSubviews: 布尔类型
            * 属性设为true, 允许释放这些不在显示范围内的子组件以优化性能
            * 组件与子组件的样式overflow都必须设置为hidden
            * 通常在ScrollView或者ListView中使用
        * renderToHardwareTextureAndroid: 布尔类型，Android
            * 决定视图是否把自己渲染到一个GPU上的硬件纹理中
            * 设置为true, 动画时，视图不必每次都渲染
            * 负面作用是会大量消耗显存，当交互/动画结束后，应将此属性设置为false
        * needsOffscreenAlphaCompositing: 布尔类型, Android
            * 为了正确的透明表现而进行离屏渲染
            * 会带来极大的开销
        * shouldRasterizeIOS: 布尔类型, IOS
            * 移动静态视图位置时，预渲染允许渲染器重用一个缓存了静态视图的位图，并快速合成
            * 预渲染会产生一个离屏的渲染过程，并且位图会消耗内存
        * 为失能人士定制的属性
            * accessible, 为true, 表示视图启用了无障碍功能的元素
            * accessibilityLabel: node
                * 设置当用户与此元素交互时，读屏器（对视力障碍人士的辅助功能）阅读的文字
    6. 设备放置状态、根View与onLayout回调函数
        * Dimensions API得到手机屏幕的宽和高始终时应用启动时的宽和高
        * `onLayout`回调函数在组件被加载时或者布局被改变时会被调用
        ```js
        _onLayoutText(event) {
            let { x, y, width, height } = event.nativeEvent.layout;
        }
        render() {
            return (
                <View>
                    <Text onLayout={this._onLayoutText}></Text>
                </View>
            )
        }
        ```
    7. pointerEvents属性
        * none: 本组件与本组件的子组件上的触摸事件都会交给本组件的父组件处理
        * box-none
            * 本组件显示范围内的事件，交给本组件的父组件处理
            * 本组件的子组件范围内的事件，交给子组件处理
        * box-only, 本组件显示范围内的事件，全部由本组件处理
        * auto, 视组件的不同而不同
