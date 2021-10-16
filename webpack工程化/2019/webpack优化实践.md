## webpack 开发速速提升

### 优化前（8-10s）

- ![image](/uploads/4786715cbe012e72ea782f71d2ac4f19/image.png)
- ![image](/uploads/74fd2318c0b25f03ebd83ef13b01e7a1/image.png)
- ![image](/uploads/975184eb73bbd0a061256aabc62124c3/image.png)

### 优化后（1-2s）

- ![image](/uploads/cd5eb57a1e07360749de6e07e4ec3ad4/image.png)
- ![image](/uploads/2887d20700dde899f21880f733eba07c/image.png)
- ![image](/uploads/12ec1d6daef8b5de5b426131ce5ffa28/image.png)

### 优化点

1. 使用`webpack.DllPlugin`和`webpack.DllReferencePlugin`打包第 3 方库 （加速作用小）
2. 开启`babel-loader`的`cache` （加速作用大）
3. 移除`package.json`中的`progress`，使用`progress-bar-webpack-plugin`查看打包进度 （加速作用大）

- `progress`
  ![image](/uploads/5181f2a0bf0b7cea354ea8b7b57f3e2d/image.png)
- `progress-bar-webpack-plugin`
  ![image](/uploads/aeff2642b1dae1dbf9ecf06714bfbacb/image.png)

4. 移除`webpack-dev-server`中的`srouce map` （加速作用大, 但本地无 source map 进行调试了）

- ![image](/uploads/f35b7671fa57901a77f1ea8bb3e7d325/image.png)
- ![image](/uploads/dfd95e902922835983fef5b4de3e96b3/image.png)

### 副作用

1. 无`source map`, `debug`调试难度更高
2. 原本项目中`css-modules`生成的`style name`用到了函数，导致无法使用`babel-loader?cacheDirectory`, 此次将 dev 环境仍然使用'[name]**[local]\_**[hash:base64:5]'， prod 环境使用函数生成`style name`, 导致生产与本地会存在一定的差异

### 其他不适合本项目的优化

1. `happypack`会减少`loader`时间, 但本身`plugin`的加载也会耗时，因为本项目使用了`mini-css-extract-plugin`，无法使用`happypack`， 固舍弃
2. `react-hot-loader`(热更新不会刷新页面，只替换变化的代码，减少接口请求的等待时间)，但本项目使用的`react`为`react-lite`非官方版本，固无法使用
3. `@vitejs/plugin-react-refresh`替换了`react-hot-loader`
