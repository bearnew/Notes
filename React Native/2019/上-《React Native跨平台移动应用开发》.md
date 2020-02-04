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
3. Image组件
    1. Image概述
        1. RN可以从网址、本地文件或者项目资源文件中加载图片
        2. RN支持jpg和png格式
        3. png可以进行透明度设置，可以将png图片下的图像显示出来
        4. jpg图片的速度要快于png的速度
        5. IOS平台还支持GIF（显示动画）格式和WebP（压缩率更高）格式
        6. 修改RN的工程设置，也能让android支持这2种格式
        ```js
        dependencies {
            compile 'com.facebook.fresco:animated-gif:0.11.0' // 支持gif动画
            compile 'com.facebook.fresco:webpsupport:0.11.0' // 支持webp格式
            compile 'com.facebook.fresco:animated-webp:0.11.0' // 支持webp动画
        }
        ```
        7.svg可以清晰的实现图片缩放
            * 在RN的`WebView`中载入SVG图片
            * 使用RN的插件支持SVG
    2. 网络图片
        1. 加载图片
            ```js
            return (
                <View style={styles.container}>
                    <Image
                        style={styles.imageStyle}
                        source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
                    />
                </View>
            )
            ```
        2. IOS只允许图片使用HTTPS协议
        3. 可以在source的headers中加入一些认证信息
            ```js
            let imageSource = {
                uri: 'https://facebook.github.io/react/img/logo_og.png',
                headers: {
                    Authorization1: 'someAuthToken',
                    Authorization2: 'someAuthToken'
                }
            }

            return (
                <View style={styles.container}>
                    <Image
                        style={styles.imageStyle}
                        source={imageSource}
                    />
                </View>
            )
            ```
        4. 可以使用`Image.getSize`获取指定URI地址图片的宽高，并且`getSize`会预加载图片
            ```js
            componentDidMount: function() {
                let imageSource = {
                    uri: 'https://facebook.github.io/react/img/logo_og.png'
                }

                Image.getSize(imageSource).then((width, height) => {
                    // ...
                }).catch(err => {
                    console.error(err);
                })
            }
            ```
        5. 可以使用`Image.prefetch`来预下载网络图片
            ```js
            componentWillMount: function() {
                let imageSource = {
                    uri: 'https://facebook.github.io/react/img/logo_og.png'
                }

                Image.prefetch(imageSource).then(result => {
                    // 预下载成功，返回值是true
                }).catch(err => {
                    console.error(err);
                })
            }
            ```
    3. 加载静态图片资源
        1. `require`等同于`var`，等同于在代码顶部预先加载图片资源
        2. RN在编译代码时处理所有的动态`require`声明，而不是在运行时动态的处理
            ```r
            <View styles={styles.container}>
                <Image
                    style={styles.icon}
                    source={require('./image/redicon.png')}
                />
            </View>
            ```
    4. 加载资源文件中的图片
        1. RN可以加载`Android`或者`IOS`项目中的图片资源文件
        ```js
        // 导入nativeImageSource函数
        let nativeImageSource = require('nativeImageSource');
        export default class LearnRN extends Component {
            render() {
                let ades = {
                    ios: 'story-background',
                    width: 60,
                    height: 60
                }

                return (
                    <View style={styles.container}>
                        <Image
                            style={styles.imageStyle}
                            source={nativeImageSource(ades)}
                        />
                    </View>
                )
            }
        }
        ``` 
    5. 动态加载手机中的图片资源
        1. 使用`CameraRoll`组件，RN可以读取手机中存储的图片资源
        2. RN还支持加载`base64`编码的图片
    6. Image组件的样式
        1. Image组件必须在样式中声明图片的宽和高，没有声明，则图片不会呈现在界面上
        2. 根据分辨率精确的显示图片
            ```js
            let PixelRatio = require('PixelRatio');
            let pixelRatio = PixelRatio.get();

            perciseImageStyle: {
                width: actualWidth / pixelRatio,
                height: actualHeight / pixelRatio
            }
            ```
        3. `resizeMode`可以作为Image组件的键值发挥作用，也可以作为Image组件的样式发挥作用
            1. `cover`
                * 要求填充整个`Image`定义的显示区域
                * 可对图片进行放大或者缩小，超出显示区域的部分直接被丢弃
            2. `contain`
                * 无法填充`Image`的所有区域
                * 可以图片进行等比放大或者缩小，然后居中显示图片，`Image`的上下侧或者左右侧会留下空白
            3. `stretch`
                * 填充整个`Image`的所有区域
                * 对图片进行任意的缩放，不考虑保持原来图片的宽高比
                * 图片有可能会出现失真
            4. `center`
                * 图片的实际宽高都小于`Image`的实际宽高，直接居中显示，四周会留下空白
                * 图片的宽高有1个值或者都大于Image的宽高，会对图片进行等比缩小，
                    直到缩小后图片的宽、高有一个等于`Image`的宽高，居中显示，在上下侧或者左右侧留下空白
            5. `repeat`(IOS独有的模式)
                * 用一张或者多张图片来填充整个`Image`定义的显示区域 
        4. 其他样式键
            1. `Image`组件还支持`backgroundColor`, `borderColor`, `borderWidth`, `overflow`, `opactiy`
            2. `tintColor`是IOS的专有属性，可以让图片的非透明像素部分有一种被染色的效果
            3. `overlayColor`是Android的专有属性，可以将需要圆角的部分使用指定的颜色填充，实现圆角的效果
    7. Image组件的其他属性
        * `onLoadStart`, 图片开始加载时调用
        * `onLoad`, 图片加载完成时调用
        * `onLoadEnd`, 图片加载结束后调用，无论成功或失败
        * `onProgress`, IOS提供的加载进度的回调函数
        * `onError`，发生错误时调用
        * `onLayout`, 图片加载或者布局发生改变时调用
    8. Image组件的缓存
        1. RN支持对网络图片的缓存，访问一次图片，在一定时间内，会缓存在手机存储中
        2. 在Android中，采用以图形文件名为同步标志的图片缓存机制，文件名不变，则一直使用这个缓存, 不管服务器侧该文件是否发生了改变
        3. 在IOS中，RN要求移动应用在返回图片时，必须在`HTTPS`响应的`HTTP`头中，
            有`Cache-Control`这个头, 对应的值为`max-age=36000000`
        4. 在IOS中，如果`HTTPS`的响应中没有`HTTP`头，则IOS没有图片缓存机制
        5. 在IOS中，如果使用`HTTP`协议获取图片，也没有图片缓存机制
        6. 在`source`中加入`cache`键明确我们期望使用的图片缓存策略
            * `default`, 使用平台默认策略
            * `reload`, 数据将从原始地址加载，不使用现有的缓存数据
            * `force-cache`, 总是使用缓存数据，没有则从原始地址加载
            * `only-if-cached`, 总是使用缓存数据，没有则失败 
            ```js
            <Image
                source={{
                    uri: 'XXXXXX',
                    cache: 'only-if-cached'
                }}
            />
            ``` 
    9. 尽量使用网络图片
        * 热更新是全量更新，会将所有本地图片打入热更新包中
        * 网络图片可使用RN的缓存机制
4. 可触摸组件
    1. `TouchableNativeFeedback`
        1. `Android`操作系统的专用组件
        2. 实现`Android`特有的涟漪(`ripple`)的触摸效果
            * `TouchableNativeFeedback.Ripple`接收2个参数
            * 第1个参数是按下时按钮改变的颜色值
            * 第2个参数涟漪效果是否被限制在`TouchableNativeFeedback`的显示区域 
            ```js
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple('red', false)}
            >
                <View style={styles.button} />
            </TouchableNativeFeedback>
            ``` 
    2. `TouchableWithoutFeedback`
        * 用户触摸时，没有反馈任何视觉效果
    3. `TouchableOpacity`
        1. 组件被触摸时变成半透明的组件
        2. 组件遮盖的背景颜色图案将会透过它被显示出来
        3. View组件，Image组件，Text组件都可以成为它的子组件
        4. `activeOpacity`定义了透明度的值，取值为0-1，默认值是0.2
        ```js
        <TouchableOpacity
            onPress={this._onPressButton}
            activeOpacity={0.5}
        >
        ``` 
    4. `TouchableHighlight`
       1. 组件被触摸时产生变暗的效果
       2. `activeOpacity`属性，默认值为0.8
       3. `onShowUnderlay`, 回调函数，当下层开始被展现时（被触摸时）调用
       4. `onHideUnderlay`, 回调函数，当下层不再被展现时被调用
       5. `underlayColor`, 字符串，指定下层颜色
    5. 其他属性
        1. `TouchableHighlight`和`TouchableOpacity`都可以接受`TouchableWithoutFeedback`组件的属性
        2. `onPress`
            * 手指离开组件后马上被激活
        3. `onPressIn`
            * 手指接触组件`delayPressIn`毫秒后马上被激活
        4. `onPressOut`
            * 手指接触组件`delayPressOut`毫秒后马上被激活
        5. `delayLongPress`
            * 设置按了多少毫秒后，`onLongPress`事件被激活, 默认值为500ms
        6. `delayPressIn`
            * 设置手指接触屏幕多少毫秒后，`onPressIn`事件被激活，默认值为0
        7. `delayPressOut` 
            * 设置手指离开屏幕多少毫秒后，`onPressOut`事件被激活，默认值为0
        8. `pressRetentionOffset`
            * 是对象类型的属性，格式为
                ```js
                {
                    top: number,
                    left: number,
                    bottom: number,
                    right: number
                }
                ```
            * 当前触摸组件的父组件不可滚动时，设置这个属性
            * 定义手指移开距组件多远距离后，可触摸组件会变成不被触摸的状态
            * 如果手指再次进入这个范围内，可触摸组件会再次变成触摸状态   
5. 使用导航栏的导航框架
    ```js
    import { Navigator } from 'react-native';

    export default class NativeModule extends Component {
        constructor(props) {
            super(props);
            this.renderScene = this.renderScene.bind(this);
        }
        configureScene(route) {
            return Navigator.SceneConfigs.FadeAndroid;
        }
        renderScene(router, navigator) {
            switch (router.name) {
                case "Page1":
                    return <Page1 navigator={navigator} />
                case "Page2":
                    return <Page2 navigator={navigator} />
                case "Page3":
                    return <Page3 navigator={navigator} />
                case "Page4":
                    return <Page4 navigator={navigator} />
            }
        }
        render() {
            return (
                <Navigator
                    initialRoute={{name: 'Page1'}}
                    configureScene={this.configureScene}
                    renderScene={this.renderScene}
                />
            )
        }
    }

    AppRegistry.registerComponent('LearnRN', () => NativeModule);
    ```
## 9.Text, TextInput等相关知识
1. Text组件
    1. 样式设置
        1. Text内部的元素不再使用`flexbox`布局，而是采用文本布局
        2. Text组件的高度由Text的宽度，字符串长度，字符串大小共同动态决定
        3. 字体样式
            * `fontFamily`
            * `fontStyle`
                * `normal`, 正常字体
                * `italic`， 斜体字体
            * `fontSize`
            * `fontWeight`
        4. 通用样式属性
            1. `textAlign`
                * `auto`, 根据字符语言决定字符串如何排列
                * `left`
                * `right`
                * `center`
                * `justify`, 两端对齐，只在ios上有效，在android等同于left
            2. `textDecorationLine`
                * `none`, 没有装饰线
                * `underline`, 下画线装饰
                * `line-through`, 装饰线贯穿装饰
                * `underline line-through`, 下画线贯穿装饰
            3. `lineHeight`
                * 用来定义每一行的高度
            4. `textShadowOffset`
            5. `textShadowRadius`
            6. `textShadowColor`
        5. ios平台独有的样式
            * `fontVariant`, 定义小型大写字母的显示文本
            * `letterSpacing`, 定义字符串之间的空间
            * `writingDirection`
                * auto, 由字符语言决定
                * ltr, 从左到右
                * rtl, 从右到左
            * `textDecorationStyle`
                * `solid`, 实线装饰风格
                * `double`, 双实线装饰风格
                * `dotted`,点状线装饰风格
                * `dashed`, 虚线装饰风格
            * `textDecorationColor`
                * 字符串修饰的颜色
            * `adjustsFontSizeToFit`
                * 布尔类型
                * true, Text组件会自动按比例缩小字体以适应样式限制
            * `allowFontScaling`
                * 布尔类型
                * true, Text组件显示的字体会根据失能者的设置而改变
            * `minimumFontScale`
                * 定义`adjustsFontSizeToFit`的最小缩小比例，取值0.01-1.0
            * `suppressHighlighting`
                * 布尔类型，默认值为false
                * false, Text组件被按下后，会突出显示一个灰色椭圆背景组件
                * true, Text组件被按下后，不会有任何变化
                * 只有Text设置了onPress和onLongPress才生效 
        6. Android平台独有的样式
            * `includeFontPadding`
                * `true`, 允许上下字符之间留下空间
                * `false`, 消除上下字符之间的空间
            * `selectionColor`
                * 定义文本被选中时突出显示的颜色
            * `textAlignVertical`, 定义垂直方向上Text组件的字符如何对齐显示
                * `auto`
                * `top`
                * `bottom`
                * `center`
            * `textBreakStrategy`, 定义英文文本的分段策略
                * `balanced`, 分段策略，平衡行的长度
                * `highQuality`, 分段策略，使用连字符分段
                * `simple`, 使用简单的分段策略  
        7. 其他属性
            1. `ellipsizeMode`
                * 定义Text组件无法全部显示字符串时，如何使用省略号修饰
                * 与`numberOfLines`属性配合使用
                * 属性
                    * `head`, 省略号显示在头部
                    * `middle`, 省略号显示在中间
                    * `tail`, 省略号显示在尾部
                    * `clip`, 不显示省略号，直接截断 
            2. `numberOfLines`
                * 设置Text组件的字符可以显示为多少行
            3. `onLongPress`
            4. `onPress`
            5. `Selectable`
                * 布尔类型
                * Text组件中的文字是否可以被选择并被复制
    2. Text组件的嵌套
        1. Text组件可以进行嵌套
        2. 子Text组件不能覆盖从父Text组件继承而来的样式
        3. 只能增加父Text组件没有的样式
        4. 如何试图子Text组件定义与父Text组件相同的样式，样式将不会生效
    3. 文本显示的阴影效果
        * `textShadowOffset`
        * `textShadowRadius`
        * `textShadowColor`
    4. Text居中显示
        ```js
        <View style={styles.container}>
            <View style={styles.viewForTextStyle}>
                <Text style={styles.textStyle}>happy</Text>
            </View>
        </View>

        var styles = StyleSheet.create({
            container: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            },
            viewForTextStyle: {
                width: 200,
                height: 100,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'gray',
                margin: 5
            },
            textStyle: {
                fontSize: 30
            }
        })
        ```
    5. 在字符串中插入图像
        ```js
        <Text>
            Welcome to <Image source={{...}} style={style.imageInTextStyle} />
        </Text>
        ```  
2. `Text`组件在两个平台上的不同表现
    1. 只指定`height`, 不指定`fontSize`
        * 不论`height`的值为何，`fontSize`都为13
    2. `fontSize`等于`height`
        * ios平台，字的上方还有空间，字的最下一部分没有显示出来
        * android平台，情况更严重
    3. `height`大于`fontSize`
        * ios中，height需大于fontSize的1.2倍，Text组件的下方空间才会随height的增大而变大
        * android中，height需大于fontSize的1.35倍，Text组件的下方空间才会随height的增大而变大
    4. `Text`组件设置边框，对android平台无效，需要在外层套一层View实现边框  
3. `TextInput`组件
    1. `TextInput`样式
        * 与`Text`类似, 组件内部的元素不使用`flexbox`布局, 而是采用文本布局
        * 组件内部元素排列出组件末端时，会自动折叠添加新行
    2. `TextInput`组件的属性
        * 支持`View`的所有属性
        * `autoCapitalize`
            * `none`, 不自动转换成大写
            * `sentence`, 每句话的首字母自动转换成大写
            * `words`, 每个单词的首字母自动转换成大写
            * `characters`, 每个英文字母自动转换成大写
        * `autoCorrect`
            * 是否自动更正用户输入的英语单词
            * 默认值为`true`
        * `autoFocus`
            * 是否自动获取焦点
            * 默认值为`false`
        * `blurOnSubmit`
            * 用户按下键盘上的回车会模糊化输入的文本并触发`onSubmitEditing`事件, 而不是在输入区域插入新行
            * 默认值是`TextInput`组件的`multiline`属性的非值
        * `defaultValue`
            * 定义`TextInput`组件的默认值
        * `editable`
            * 是否允许用户修改
        * `keyboardType`
            * 字符串类型的属性, 定义`TextInput`获取焦点时，自动弹出哪种软键盘
            * 属性取值
                * `default`
                * `numeric`
                * `email-address`
                * `ascii-capable`
                * `numbers-and-punctuation`
                * `url`
                * `number-pad`
                * `phone-pad`
                * `name-phone-pad`
                * `decimal-pad`
                * `twitter`
                * `web-search` 
        * `maxLength`
            * 定义`TextInput`组件最多允许用户输入多少个字符
        * `multiline`
            * true, TextInput可以是多行组件
            * 默认值是false
        * `placeholder`
        * `placeholderTextColor`
            * 定义`placeholder`字符串的颜色
        * `returnKeyType`
            * 定义回车键在键盘中的显示
            * 通用属性
                * `done`
                * `go`
                * `next`
                * `search`
                * `send`  
            * Android支持的属性
                * `none`
                * `previous`
            * Ios支持的属性
                * `default`
                * `google`
                * `join`
                * `route`
                * `yahoo`
                * `emergency-call`
        * `secureTextEntry`和`password`
            * 2个只需定义1个即可
            * 定义当前`TextInput`组件是否用于输入密码
        * `selectTextOnFocus`
            * `TextInput`获取焦点时，组件中所有的文字都会被选中
            * `selection`
                * 设置`TextInput`组件中被选择字符的开始和结束位置
                * 把开始和结束位置设为同一个值，可以达到设置输入光标至该位置的效果
                ```js
                {
                    start: number,
                    end: number
                }
                ``` 
            * `selectionColor`
                * 设置被选中的文字的高亮显示颜色
                * Ios可用这个属性设置输入光标的颜色
            * `value`
            * `onSelectionChange`
                * 输入框中的字符串发生改变时，回调函数被调用
                * 用户移动光标时，回调函数被调用
                ```js
                {
                    timeStamp: '', // 事件发生时的时间戳
                    nativeEvent: {
                        selection: {
                            start: 0, // 用户选中的子字符串起点位置
                            end: 10, // 用户选中的子字符串结束位置
                        }
                    }
                }
                ```  
4. `TextInput`组件的IOS平台专有属性
    * `clearButtonMode`, 什么时候在文本View的右侧显示清除按钮
        * `never`
        * `while-editing`
        * `unless-editing`
        * `always`
    * `clearTextOnFocus`
    * `enablesReturnKeyAutomatically`
        * 布尔类型，默认值为false
        * true, 文本区域没有输入文字时，键盘的回车键会失效，而有文字时，键盘的回车键又会失效
    * `keyboardApperance`, 键盘颜色
        * `default`, 默认
        * `light`, 明亮
        * `dark`, 偏暗
    * `onKeyPress`
        * 按键被按下时激活，传入按下键的键值
        * 在`onChange`回调函数之前被调用
    * `spellCheck`
        * false, 会关闭自动拼写检查功能
        * 默认值从`TextInput`组件的`autoCorrect`组件中继承而来 
5. `TextInput`组件的Android平台专有属性
    * `numberOfLines`
        * 设置`TextInput`组件有多少行
        * 将它与`multiline={true}`联合使用，可以让用户输入多行
    * `disableFullscreenUI`
        * false, 手机操作系统如果发现`TextInput`组件的空间小，会让用户进入一个全屏文本输入的模式
    * `inlineImageLeft`
        * 值必须是RN的Android工程中的一个图片资源的名称
        * RN会把这张图片无缩放的显示在`TextInput`组件的左侧
    * `inlineImagePadding`
    * `returnKeyLabel`
        * 将手机软键盘的回车键设为指定的字符串
        * 属性的优先级高于`returnkeyType`
    * `underlineColorAndroid`
        * 用来定义输入提示下画线的颜色
        * 设置成与`TextInput`组件的背景色一样，则可以隐藏输入提示下画线
6. `TextInput`的成员函数
    * `isFocused`, 判断`TextInput`组件是否获得焦点
        ```js
        this.refs.aTextInputRef.isFocused();
        ``` 
    * `clear`, 将`TextInput`组件中的字符串清空
        ```js
        this.refs.aTextInputRef.clear();
        ``` 
7. `TextInput`组件的生命周期
    1. 获得焦点，触发`onFocus`属性
    2. 用户输入，触发`onChange`和`onChangeText`
    3. 用户按下提交键，触发`onSubmitEditing`
        * `multiline={true}`, ios, `onSubmitEditing`永不会触发
        * `multiline={true}`, android, 按回车键 会触发`onSubmitEditing`并增加一个回车换行，同时输入框保持住焦点
    4. 失去焦点, 触发`onEndEditing`和`onBlur`回调函数
    5. 字符串行数发生变化，触发`onContentSizeChange`
    6. 组件被加载或者布局发生变化，触发`onLayout`
    7. 组件卷动时，触发`onScroll`
    8. 组件的选中字符被改变时，触发`onSelectionChange`
8. 键盘事件
    1. `addListener(eventName, callback)`
        ```js
        import { Keyboard } from 'react-native';

        keyboardDidShowHandler(event) {
            this.setState({
                Keyboardshown: true
            })
        }
        componentWillMount() {
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShowHandler.bind(this));
        }
        componentWillUnmount() {
            if (this.keyboardDidShowListener) {
                this.keyboardDidShowListener.remove();
            }
        }
        onDismissKeyboard() {
            Keyboard.dismiss();
        }
        ```
    2. `removeListener(eventName, callback)`
    3. `removeAllListener(eventName)`
    4. `dismiss()` 
9. 组件的引用
    1. 定义组件的引用
        ```js
        <TextInput ref='aReferName'>
        ```
    2. 得到系统定义的组件引用
        ```js
        ...
        {
            this.aArray.map((aValue, aIndex) => (
                <ComponentA
                    ref={refName => { this.componentRefNames[aIndex] = refName; }}
                />
            ))
        }
        ...
        ```
    3. 重新设定组件的属性, `setNativeProps`
        ```js
        // 使文本输入框变成不可编辑
        this.refs.textInputRefer.setNativeProps({
            editable: false
        })

        // 改变样式
        this.refs.text2.setNativeProps({
            style: {
                color: 'blue',
                fontSize: 30
            }
        })
        ```
    4. 获取组件的位置
        1. `onLayout`回调函数是获取组件的宽高与位置信息的好办法
        2. 对代码生成的组件, `measure`函数是获取宽高与位置信息的唯一办法
        ```js
        // x y表示组件的相对位置
        // pageX, pageY表示组件相对于屏幕的绝对位置
        this.refs.aTextInputRef.measure((x, y, width, height, pageX, pageY) => {

        })
        ```  
10. `StatusBar`状态栏组件
    1. 通用属性
        * `animated`, 布尔类型，设置样式改变时是否有动画效果
        * `hidden`, 布尔类型，设定状态栏是否隐藏
    2. `Android`特有属性
        * `backgroundColor`, 设定状态栏的背景颜色
        * `translucent`, 布尔类型，设定状态栏是否有半透明效果
        * 静态常量`currentHeight`, 用`StatusBar.currentHeight`读取手机状态栏的高度
    3. `Ios`特有属性
        * `barStyle`
            * `default`
            * `light-content`
        * `networkActivityIndicatorVisible`
            * 是否在状态栏显示网络活动指示器
            * 手机有网络数据交互时，网络活动指示器就会不停的旋转
        * `showHideTransition`
            * 决定用`hidden`属性来显示与隐藏状态栏时的效果
            * 取值
                * `fade`, 淡入淡出
                * `slide`, 滑入滑出  
11. `TextInput`组件高度自增长
    ```js
    class AutoExpandTextInput extends Component {
        constructor(props) {
            super(props);

            this.state = {
                text: '',
                height: 0
            }
        }
        _onChange = event => {
            this.setState({
                text: event.nativeEvent.text,
                height: event.nativeEvent.contentSize.height
            })
        }

        render() {
            return (
                <TextInput
                    {...this.props}
                    multiline={true}
                    onChange={this._onChange}
                    style={[styles.textInputStyle, {
                        height: Math.max(35, this.state.height)
                    }]}
                    value={this.state.text}
                />
            )
        }
    }
    ```
12. 访问操作系统剪贴板
    ```js
    import { Clipboard } from 'react-native';

    export default class learnRN extends Component {
        constructor(props) {
            super(props);
            this.state = {
                textFromClipboard: ''
            }
        }

        pasteFromClipboard() {
            Clipboard.getString().then(
                textFromClipboard => {
                    this.setState({
                        textFromClipboard
                    })
                }
            ).catch(err => {
                console.error(err);
            })
        }

        copyToClipboard() {
            Clipboard.setString('ABCD 你好');
        }

        render() {
            return (
                <View>
                    <Text>{this.state.textFromClipboard}</Text>
                    <Text onPress={this.copyToClipboard}>copy</Text>
                    <Text onPress={this.pasteFromClipboard}>paste</Text>
                </View>
            )
        }
    }
    ```
## 10.组件生命周期，数据存储
1. 组件生命周期
    1. `constructor(props)`
        * 构造函数，RN被加载前调用
    2. `componentWillMount()`
    3. `componentDidMount()`
    4. `componentWillReceiveProps(nextProps)`
    5. `shouldComponentUpdate(nextProps, nextState)`
    6. `componentWillUpdate(nextProps, nextState)`
    7. `componentDidUpdate(prevProps, prevState)`
    8. `componentWillUnmount()`
2. 数据持久化操作
    1. `AsyncStorage`
        * 简单的、异步的键值存储系统
        * 数据会被保存到手机存储空间中
    2. 写入数据
        1. `setItem`
            ```js
            // 错误
            // try catch无法捕获到任何错误
            try {
                AsyncStorage.setItem('name', 123);
            } catch(err) {
                console.error(err);
            }
            ```
            ```js
            // 正确
            // 可以捕获任何异常
            AsyncStorage.setItem('name', 123).then(() => {
                // 操作成功的处理函数
            }).catch(err => {
                console.error(err);
            })
            ```
        2. `multiSet`
            ```js
            AsyncStorage.multiSet([['1', '张三'], ['2', '李四']]).then(() => {
                // 操作成功的处理函数
            }).catch(err => {
                console.error(err);
            });
            ```
    3. 读取数据
        1. `getItem` 
            ```js
            AsyncStorage.getAllKeys().then(keys => {
                keys.map(key => {
                    AsyncStorage.getItem(key).then(result => {
                        // ...
                    }).catch(err => {
                        console.error(err);
                    })
                }) 
            }).catch(err => {
                console.error(err);
            })
            ```
        2. `multiGet`
            ```js
            AsyncStorage.multiGet(['1', '2']).then(results => {
                console.log(results[0][0]); // 打印出1
                console.log(results[0][1]); // 打印出张三
                console.log(results[1][0]); // 打印出2
                console.log(results[1][1]); // 打印出李四
            }).catch(err => {
                console.error(err);
            })
            ```
        3. 可使用`AsyncStorage.flushGetRequests`取消前面所有未执行完成的`multiGet`操作
    4. `AsyncStorage`存储的数据时无序的
    5. 删除数据
        1. `removeItem`
            ```js
            AsyncStorage.removeItem('name').then(() => {
                // 删除成功后的操作
            }).catch(err => {
                console.error(err);
            })
            ```
        2. `multiRemove`
            ```js
            AsyncStorage.multiRemove(['1', '2']).then(() => {
                // 删除成功后的操作
            }).catch(err => {
                console.error(err);
            })
            ```
        3. `clear`
            ```js
            AsyncStorage.clear().then(() => {
                // 删除所有的数据存储成功后的操作
            }).catch(err => {
                console.error(err);
            })
            ```
    6. 修改数据
        * `AsyncStorage.mergeItem(akey, aValue)`
        * `AsyncStorage.multiMerge(aArray)`
## 11.ScrollView和ListView
1. `ScrollView`组件
    1. `ScrollView`组件属性
        * `contentContainerStyle`
            * 定义`ScrollView`组件容器的样式
        * `horizontal`
            * true, `ScrollView`的所有子组件将会水平排列
            * false, `ScrollView`的所有子组件将会垂直排列
        * `keyboardDismissMode`, 定义子组件调出软键盘后，是否允许通过拉软键盘这个手势让软键盘消失
            * `none`, 不允许， Android操作系统只支持`none`取值
            * `on-drag`, 手势开始时，软键盘消失
            * `interactive`, 键盘消失的动画会与手势进展交互对应，用户向上回拉，软键盘不会消失
        * `KeyboardShouldPersistTaps`
            * false, 文本输入框外触按屏幕，会使软键盘消失
            * true, 不会消失
        * `onContentSizeChange`
            * `ScrollView`组件的容器View宽、高被改变时，回调函数被执行
        * `onScroll`
            * `ScrollView`组件滑动时，每一帧的画面改变都会触发一次此函数
            * 可以通过`scrollEventThrottle`属性控制回调的频率
        * `pagingEnabled`
            * true, `ScrollView`组件中显示的内容在滑过整数倍的`ScrollView`宽、高时会停止滑动，用来实现水平方向整页滑动
            * 默认值为false
        * `removeClippedSubviews`
            * true(默认值),通过不处理不在屏幕范围内的子View而提高滑动效果体验 
        * `scrollEnabled`
            * false, `ScrollView`组件将不能卷动
        * `showsHorizontalScrollIndicator`
            * true, 水平方向的`ScrollView`组件会有一个滑动指示器
        * `showsVerticalScrollIndicator`
            * true, 垂直方向的`ScrollView`组件会有一个滑动指示器 
    2. `ScrollView`组件Ios平台专有属性
        * `alwaysBounceHorizontal`
            * `horizontal`属性为true时，默认值为true, 否则为false
            * true, `ScrollView`在手指滑动到尽头时会有一个弹动效果
        * `alwaysBounceVertical`
            * 控制垂直方向的滑动效果
            * `horizontal`属性为false时，默认值为true, 否则为false
        * `automaticallyAdjustContentInsets`
            * `ScrollView`被放置在导航栏、分页栏、工具栏后，ios系统是否自动调整它的内容
            * 默认值为true
        * `bounces`
            * true, 滑动到尽头，有一个弹动效果
            * false, 不会有弹动效果，即使`alwaysBounceHorizontal`的值为true
        * `bouncesZoom`
            * true, 可通过手势操作使`ScrollView`缩放超过它设定的最大值/最小值，手势操作结束后，`ScrollView`会回到它允许的最大/最小值
            * false, 不允许超过最大值/最小值
        * `canCancelContentTouches`
            * false, 如果`ScrollView`组件中的子组件处理了触摸事件，触摸事件不会交给`ScrollView`组件处理
        * `centerContent`
            * true, 如果`ScrollView`的显示内容的宽、高小于`ScrollView`的宽、高，`ScrollView`会自动将内容居中显示
        * `centerInset`, 定义了`ScrollView`相对父View边框从哪里开始显示
            * 默认值为{0, 0, 0, 0}
            * 接受{top: number, left: number, bottom: number, right: number}
        * `contentOffset`
            * 手动设置开始滑动的偏移值, 默认值为{x: 0, y: 0}
        * `decelerationRate`
            * 定义手指离开屏幕时，`ScrollView`的滑动减速效果有多快
            * 合理的设置区间为0.998(正常速度)-0.9（快速减速）
        * `directionalLockEnabled`
            * true, `ScrollView`只允许垂直（或水平）方向滑动
        * `indicatorStyle`, 设置滚卷条的颜色
            * `default`
            * `black`
            * `white`
        * `maximumZoomScale`
            * 设置允许最大的缩放比例，默认值为1.0
        * `minimumZoomScale`
            * 设置允许最小的缩放比例, 默认值为1.0
        * `zoomScale`
            * 设置当前`ScrollView`组件的缩放比例, 默认值为1.0
        * `onScrollAnimationEnd`
            * 回调函数，滑动动画效果结束时将被调用
        * `scrollEventThrottle`
            * 控制滑动事件的触发频率（每秒触发多少次）
            * 默认值为0，表示滑动事件只在`ScrollView`被滑动时触发一次
        * `scrollIndicatorInsets`
            * 定义`ScrollView`滑动指示器相对于父View边框从哪里开始显示
            * 接收{top: number, left: number, bottom: number, right: number}
        * `scrollsToTop`
            * true, 用户点击状态栏将使`ScrollView`回到顶部
        * `snapToInterval`
            * `Number`类型
            * `ScrollView`每滑过整数倍的`SnapToInterval`宽 高时会停止滑动
            * 可以给宽 高小于`ScrollView`宽高的子组件提供类似分页的效果
        * `snapToAlignment`
            * 当`snapToInterval`设定后，`snapToAlignment`定义停止滑动的行为
            * 取值
                * `start`, 分页的头部与`ScrollView`的头部对齐
                * `center`, 中部对齐
                * `end`, 底部对齐 
        * `stickyHeaderIndices`
            * 数值数组类型
            * 设定哪个子组件会固定在屏幕上方而不会在滑动时滑出屏幕
            * `stickyHeaderIndices={[0]}`, 将使第一个子组件固定在`ScrollView`的顶部
            * 不能与`horizontal={true}`同时使用 
    3. `ScrollView`的Android平台专有属性
        * `endFillColor`
            * 渲染`ScrollView`富余空间的颜色
    4. `ScrollView`组件的公开成员函数
        * `setNativeProps`
        * `measure`
        * `scrollTo`
            ```js
            aScrollViewRef.scrollTo({x: 0, y: 50, animated: true})
            ``` 
        * `scrollToEnd`
    5. `RefreshControl`组件
        * 给`ScrollView`组件的`refreshControl`赋值，当`ScrollView`被拉到顶部时(y: 0)时，会显示赋值的`RefreshControl`组件
        * 属性
            * `onRefresh`
                * 当`ScrollView`拉到顶部时，这个函数会被执行
            * `refreshing`
                * 布尔类型，设置当前是否显示`RefreshControl`组件  
    6. Android平台特有属性
        * `colors`
            * 数组类型，设定刷新指示器的颜色
            * 数组中的每一个元素都应当是1个颜色值
        * `enabled`
            * 布尔类型，控制是否打开刷新功能
        * `progressBackgroundColor`
            * 设置刷新指示器的背景颜色
        * `size`
            * 设置刷新指示器的尺寸
            * 默认值为`RefreshControl.SIZE.DEFAULT` 
    7. iOS平台特有属性
        * `tintColor`, 设置刷新指示器的颜色
        * `title`, 设置刷新指示器下的字符串
    8. `ScrollView`组件的用法
        * `ScrollView`组件必须要有明确的高度值限制，这个限制要么在`ScrollView`组件的样式中设置，要么在它的父组件样式中设置
        ```js
        import { RefreshControl } from 'react-native';

        <ScrollView
            style={styles.scrollView}
            onScroll={this.onScroll}
            refreshControl={
                <RefreshControl
                    refreshing={true}
                    onRefresh={this._onRefresh}
                    tintColor="#ff0000"
                    title="Loading..."
                    colors={['#ff0000', '#00ff00', '#0000ff']}
                    progressBackgroundColor="#ffff00"
                />
            }
        >
            <View style={styles.aView} />
            <View style={styles.bView} />
        </ScrollView>
        ```        
2. `ListView`组件
> ListView能够高效的更改刷新列表中的数据
> ListView能适应动态加载非常多的数据，让它的滚动尽可能的平滑
> ListView继承了View组件和ScrollView组件的所有属性    
    1. 
3.  