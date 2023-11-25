# 本地开发代理

1. 使用 whistle 将 m.hutaojie.com 的 80 端口代理到本地 localhost 的 3000 端口

```js
# 转发静态资源
*/poker_home.html http://localhost:3000/poker_home.html
*/majsoul_home.html http://localhost:3000/majsoul_home.html
*/fgoods_poker_goods.html http://localhost:3000/fgoods_poker_goods.html?__csr=1
*/fgoods_majsoul_goods.html http://localhost:3000/fgoods_majsoul_goods.html?__csr=1

*/assets http://localhost:3000/assets

# 热更新
*/react_webpack_runtime http://localhost:3000
/react_webpack_runtime.\w*.hot-update.json/ http://localhost:3000/react_webpack_runtime.$1.hot-update.json

# 斗地主mock
# /(?:/proxy/api)/api/poker/home/index/ file://~/xx/mockData/index.json
# /(?:/proxy/api)/api/poker/activity/reward/gain/ file://~/xx/mockData/activityGain.json
# /(?:/proxy/api)/api/poker/activity/query/ file://~/xx/mockData/poker_goods_activity_query.json

# 麻将mock
# /(?:/proxy/api)/api/maj/home/index/ file://~/xx/majMock/majIndex.json
```

2.SwitchyOmega 新建 proxy 到 localhost:8888（whistle）的代理 3.找到公司系统代理的 PAC 网址，并使用 SwitchyOmega 新建 1 个 PAC 代理 4.配置 auto swtich，hutaojie 代理到本地，google 使用公司的系统代理 5.将浏览器的代理切换到 auto switch 即可
