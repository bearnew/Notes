# babel 优化可选链插件

```js
module.exports = function ({ types: t }) {
  return {
    visitor: {
      // program访问整个文件
      Program(path) {
        let hasDlv = false;
        let dlvIdentifier;
        path.traverse({
          ImportDeclaration(importPath) {
            const { source } = importPath.node;
            if (t.isStringLiteral(source) && source.value === "dlv") {
              hasDlv = true;
              const [specifier] = importPath.node.specifiers;
              if (specifier && specifier.local) {
                dlvIdentifier = specifier.local.name;
              }
            }
          },
        });
        // 文件中未引入dlv，在文件中进行引入
        if (!hasDlv) {
          const dlvImport = t.importDeclaration(
            [t.importDefaultSpecifier(t.identifier("_dlv"))],
            t.stringLiteral("dlv"),
          );
          path.node.body.unshift(dlvImport);
          dlvIdentifier = "_dlv";
        }
        path.traverse({
          // 处理a?.b?.c?.d常规可选链
          OptionalMemberExpression(path) {
            const { node } = path;
            if (t.isOptionalMemberExpression(node)) {
              const { object, property } = node;
              const { name } = property;
              let childrenKeys = name;
              let currentObject = object;
              while (t.isOptionalMemberExpression(currentObject)) {
                const { property } = currentObject;
                childrenKeys = `${property.name}.${childrenKeys}`;
                currentObject = currentObject.object;
              }
              path.replaceWith(
                t.callExpression(t.identifier(dlvIdentifier), [
                  currentObject,
                  t.stringLiteral(childrenKeys),
                ]),
              );
            }
          },
          // 处理a?.b?.c?.f ?? 'default_value'，可选链默认值的情况
          LogicalExpression(path) {
            const { node } = path;
            if (node.operator === "??") {
              const leftNode = path.get("left");
              const rightNode = path.get("right");
              if (
                t.isCallExpression(leftNode.node) &&
                t.isIdentifier(leftNode.node.callee) &&
                leftNode.node.callee.name === "dlv"
              ) {
                leftNode.node.arguments.push(
                  t.stringLiteral(rightNode.node.value),
                );
                path.replaceWith(leftNode.node);
              } else {
                const { object, property } = leftNode.node;
                const { name } = property;
                let childrenKeys = name;
                let currentObject = object;
                while (t.isOptionalMemberExpression(currentObject)) {
                  const { property } = currentObject;
                  childrenKeys = `${property.name}.${childrenKeys}`;
                  currentObject = currentObject.object;
                }
                const args = [
                  currentObject,
                  t.stringLiteral(childrenKeys),
                  t.stringLiteral(rightNode.node.value),
                ];
                path.replaceWith(
                  t.callExpression(t.identifier(dlvIdentifier), args),
                );
              }
            }
          },
          // 处理可选链函数调用的情况a?.b?.c?.e?.()
          OptionalCallExpression(path) {
            const { node } = path;
            if (t.isOptionalCallExpression(node)) {
              const { callee, optional } = node;
              let currentCallee = callee;
              const childrenKeys = [];
              while (t.isOptionalMemberExpression(currentCallee)) {
                const { property } = currentCallee;
                childrenKeys.unshift(property.name);
                currentCallee = currentCallee.object;
              }
              const args = [
                currentCallee,
                t.stringLiteral(childrenKeys.join(".")),
                t.functionExpression(null, [], t.blockStatement([])),
              ];
              const newCallee = t.callExpression(
                t.identifier(dlvIdentifier),
                args,
              );
              path.replaceWith(
                t.callExpression(newCallee, callee.arguments || []),
              );
            }
          },
        });
      },
    },
  };
};
```
