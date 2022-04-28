# 生成 prefetch 插件

```js
class EjectAssetsPrefetchPlugin {
    constructor(options = {}) {
        this.options = options;
    }

    apply(compiler) {
        compiler.hooks.emit.tap(pluginName, (compilation) => {
            const { targets } = this.options;
            const assets = compilation.getAssets();
            const customOutPath =
                this.options.customOutPath || compiler.options.output.path;

            for (const target of targets) {
                const { outputName, cdnPublicPath, exclude } = target;
                const prefetchNodeList = [];
                assets.forEach(({ name, source }) => {
                    if (name.includes("lazy")) {
                        // 懒加载模块，不进行prefetch
                        return;
                    } else if (/\.js/.test(name)) {
                        const src = processAssetSrc({
                            item: name,
                            cdnPublicPath,
                            exclude,
                        });
                        if (!src) return;
                        prefetchNodeList.push(
                            `<link rel="prefetch" href="${src}">`
                        );
                    } else if (/\.css/.test(name)) {
                        const src = processAssetSrc({
                            item: name,
                            cdnPublicPath,
                            exclude,
                        });
                        if (!src) return;
                        prefetchNodeList.push(
                            `<link rel="prefetch" href="${src}" crossorigin="anonymous">`
                        );
                    }
                });

                const preHtml = `<!DOCTYPE html>
                      <html lang="en">
                        <head>
                          ${prefetchNodeList.join()}
                          <script>
                          var ua=(navigator.userAgent||"").toLowerCase();
                          if(/iphone|ipad|ipod/.test(ua)){
                            var linkNodeList=document.querySelectorAll("link");
                            for (var index=0; index < linkNodeList.length; index++) {
                              var xhr=new XMLHttpRequest();
                              xhr.open("GET",linkNodeList[index].href);
                              xhr.send();
                            }
                          }
                          </script>
                        </head>
                        <body></body>
                      </html>`;

                writeFileRecursive(
                    path.join(customOutPath, outputName),
                    preHtml
                );
            }
        });
    }
}
```
