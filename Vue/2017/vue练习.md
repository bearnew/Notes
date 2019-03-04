### 1.克隆代码到本地
```
git clone git@github.com:bear-new/vuePractice.git
```
### 2.安装cnpm并设置源为国内淘宝源
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```
### 3.在vuePractice目录下安装所需依赖包
```
cnpm install
```
### 4.开发环境运行
```
cnpm run dev
```
### 5.生产环境运行
```
cnpm run build
```
> 执行cnpm run build后，根目录会生成一个dist文件，打开dist下index.html即可运行
### 6.vue常见面试问题
* **组件通信**

    1.[父组件通过props通信子组件](https://cn.vuejs.org/v2/guide/components.html#Prop)
    
    2.[子组件通过$emit通信父组件](http://blog.csdn.net/mr_fzz/article/details/54636833)
    
    3.[非父子组件通信，A组件通过$emit注册事件，B组件通过$on监听事件](http://blog.csdn.net/mr_fzz/article/details/54636833)
* **自定义指令**
 
    [自定义指令](https://cn.vuejs.org/v2/guide/custom-directive.html)
* **生命周期**

    [vue生命周期](https://cn.vuejs.org/v2/guide/instance.html#实例生命周期)
    
* **vue数据绑定实现原理**

    [通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。](http://www.jb51.net/article/106484.htm)