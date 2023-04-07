# 动态polyfill
1. `chrome >= 66` 或者 `ios_saf >= 12` 是不需要 `polyfill` 的
2. `polyfill`主要由2部分构成：
    1. `core-js`
    2. `regenerator-runtime`
3. 去除`babel`中的`polyfill`
    - `@babel/presets-env` 配置里设置 `useBuiltIns: false`
4. 核心代码
    ```js
    /**
    * @param ua 一般为 req.headers['user-agent']
    * @param isBackup 代表是否走进 csr/stc 等容灾场景，一般为 !res.locals.ssr；容灾场景因为失去了服务端计算逻辑，所以直接全量 polyfill
    */
    const shouldAddPolyfill = (ua = '', isBackup) => {
        if (isBackup) return true;
        let flag = false;
        let result;
        if ((result = /(Chrome)\/(\d+)\.(\d+)\.(\d+)\.(\d+)/.exec(ua))) {
            flag = result[2] >= 66;
        } else if ((result = /(iPod|iPhone|iPad).+OS (\d+)_(\d+)_?(\d+)?/.exec(ua))) {
            flag = result[2] >= 12;
        }
        return !flag;
    };

    const PolyfillForSync = ({ ua, isBackup }) => {
        // !!! 注意：这里如果是 defer 式加载，则需要为 polyfill.js 脚本标签增加 defer 属性
        return shouldAddPolyfill(ua, isBackup) ? <script key="polyfill" src="polyfill.js" crossOrigin="anonymous"></script> : null;
    };
    ```

