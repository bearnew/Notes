# babel插件替换import
```js
const testObservable = (data, key) => {
    return data[key];
};
export default testObservable;
```
```js
const types = require('babel-types');

module.exports = function (babel) {
    return {
        visitor: {
            ImportDeclaration: {
                enter(path, state = { opts: {} }) {
                    const specifiers = path.node.specifiers;
                    const source = path.node.source;
                    const filename = state.file.opts.filename;
                    if (
                        source.value === 'mobx' &&
                        !filename.includes('testObservable') &&
                        !filename.includes('h5Vendor')
                    ) {
                        // testObservable，h5Vendor这2个文件不处理
                        if (
                            specifiers.every(
                                specifier =>
                                    specifier.imported && specifier.imported.name !== 'observable'
                            )
                        ) {
                            return;
                        }
                        const declarations = specifiers.map(specifier => {
                            if (specifier.local.name === 'observable') {
                                return types.ImportDeclaration(
                                    [types.ImportDefaultSpecifier(specifier.local)],
                                    types.StringLiteral('@testH5/utils/testObservable')
                                );
                            }
                            return types.ImportDeclaration(
                                [types.ImportSpecifier(specifier.local, specifier.imported)],
                                types.StringLiteral(source.value)
                            );
                        });
                        path.replaceWithMultiple(declarations);
                    }
                }
            }
        }
    };
};

```