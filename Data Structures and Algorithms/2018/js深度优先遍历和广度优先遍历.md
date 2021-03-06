## 深度优先遍历和广度优先遍历
1. 区别

| 算法            | 数据结构       | 描述                                 |
| :-------------- | :------------- | :----------------------------------- |
| 深度优先遍历DFS | 栈(先进后出)   | 无需记住所有节点，占用空间小，时间长 |
| 广度优先遍历BFS | 队列(先进先出) | 需记录所有节点，占用空间大，时间短   |

2. example
```js
const data = [
    {
        name: 'a',
        children: [
            { name: 'b', children: [{ name: 'e' }] },
            { name: 'c', children: [{ name: 'f' }] },
            { name: 'd', children: [{ name: 'g' }] },
        ],
    },
    {
        name: 'a2',
        children: [
            { name: 'b2', children: [{ name: 'e2' }] },
            { name: 'c2', children: [{ name: 'f2' }] },
            { name: 'd2', children: [{ name: 'g2' }] },
        ],
    }
]

// 深度遍历, 使用递归
function getName(data) {
    const result = [];
    traverse(data);

    function traverse(list) {
        list.forEach(item => {
            result.push(item.name);
            if (item.children) {
                traverse(item.children);
            }
        });
    }

    return result.join(',');
}

// 广度遍历, 创建一个执行队列, 当队列为空的时候则结束
function getName2(data) {
    const result = [];
    let quene = data;

    while (quene.length > 0) {
        const item = quene.shift();
        result.push(item.name);
        if (item.children) {
            quene.push(...item.children);
        }
    }

    return result.join(',');
}

console.log(getName(data)); // a,b,e,c,f,d,g,a2,b2,e2,c2,f2,d2,g2
console.log(getName2(data)); // a,a2,b,c,d,b2,c2,d2,e,f,g,e2,f2,g2

```  