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