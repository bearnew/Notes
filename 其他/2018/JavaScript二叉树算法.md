## 算法
### 1. 二叉搜索树算法
1. 二叉树中的节点只能有2个节点，1个是左侧子节点，1个是右侧子节点
2. 二叉搜索树是二叉树的一种，只允许在左侧节点存储比父节点小的值，在右侧节点存储比父节点大的值
3. 二叉树的增，删， 查， 改效率更高
3. 树的遍历
    * 中序遍历
        * 以从小到大的顺序访问所有节点
        * 对树进行排序操作
    * 前序遍历
        * 前序遍历会先访问节点本身，然后访问左侧节点，最后是右侧节点
        * 前序遍历主要用来打印结构化文档
    * 后序遍历
        * 后序遍历是先访问后代节点，再访问子节点
        * 用来计算目录和子目录中所有文件所占空间的大小
4. 树最左边的节点为最小树
5. 树最右边的节点为最大树
6. 自平衡树
    * AVL是一种自平衡二叉搜索树，任何1个节点左右两侧子树的高度之差最多为1
    * 红黑树也是自平衡二叉搜索树，并且能够更加高效有序的遍历其节点
7. 
```js
function BinarySearchTree() {
    this.root = null;
    // 生成二叉树
    this.insert = function (key) {
        var newNode = new Node(key);

        if (this.root === null) {
            this.root = newNode;
        } else {
            insertNode(this.root, newNode);
        }
    }

    // 中序遍历
    this.inOrderTraverse = function (callBack) {
        inOrderTraverseNode(this.root, callBack);
    }

    // 前序遍历
    this.preOrderTraverse = function (callBack) {
        preOrderTraverseNode(this.root, callBack);
    }

    // 后序遍历
    this.postOrderTraverse = function (callBack) {
        postOrderTraverseNode(this.root, callBack);
    }

    // 获取最小数
    this.min = function () {
        return minNode(this.root);
    }

    // 获取最大数
    this.max = function () {
        return maxNode(this.root);
    }

    // 搜索特定的值
    this.search = function (key) {
        return searchNode(this.root, key);
    }

    // 移除1个节点
    this.remove = function (key) {
        this.root = removeNode(this.root, key);
    }

    function Node(key) {
        this.key = key;
        this.left = null;
        this.right = null;
    }

    function insertNode(node, newNode) {
        if (newNode.key < node.key) {
            if (node.left === null) {
                node.left = newNode;
            } else {
                insertNode(node.left, newNode);
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
            } else {
                insertNode(node.right, newNode);
            }
        }
    }

    function inOrderTraverseNode(node, callBack) {
        if (node !== null) {
            inOrderTraverseNode(node.left, callBack);
            callBack(node.key);
            inOrderTraverseNode(node.right, callBack);
        }
    }

    function preOrderTraverseNode(node, callBack) {
        if (node !== null) {
            callBack(node.key);
            preOrderTraverseNode(node.left, callBack);
            preOrderTraverseNode(node.right, callBack);
        }
    }

    function postOrderTraverseNode(node, callBack) {
        if (node !== null) {
            postOrderTraverseNode(node.left, callBack);
            postOrderTraverseNode(node.right, callBack);
            callBack(node.key);
        }
    }

    function minNode(node) {
        if (node) {
            while (node && node.left !== null) {
                node = node.left;
            }
            return node.key;
        }
        return null;
    }

    function maxNode(node) {
        if (node) {
            while (node && node.right !== null) {
                node = node.right;
            }
            return node.key;
        }
        return null;
    }

    function searchNode(node, key) {
        if (node === null) {
            return false;
        }
        if (key < node.key) {
            return searchNode(node.left, key);
        }
        if (key > node.key) {
            return searchNode(node.right, key);
        }

        return true;
    }

    function removeNode(node, key) {
        if (node === null) {
            return null;
        }
        if (key < node.key) {
            node.left = removeNode(node.left, key);
            return node;
        }
        if (key > node.key) {
            node.right = removeNode(node.right, key);
            return node;
        }
        if (key === node.key) {
            if (node.left === null && node.right === null) {
                node = null;
                return node;
            }
            if (node.left === null) {
                node = node.right;
                return node;
            }
            if (node.right === null) {
                node = node.left;
                return node;
            }
            // 将右侧节点最小的值放到移除节点的位置, 再移除右侧最小的节点
            if (node.left !== null && node.right !== null) {
                var aux = minNode(node.right);
                node.key = aux.key;
                node.right = removeNode(node.right, aux.key);
                return node;
            }
        }
    }
}

var tree = new BinarySearchTree();
[5, 4, 6, 7, 2, 1, 3].map(i => {
    tree.insert(i);
})

console.log(tree.root)
tree.inOrderTraverse(i => { console.log(i) }); // 1 2 3 4 5 6 7
tree.preOrderTraverse(i => { console.log(i) }); // 5 4 2 1 3 6 7
tree.postOrderTraverse(i => { console.log(i) }); // 1 3 2 4 7 6 5
console.log('min:', tree.min()); // min: 2
console.log('max:', tree.max()); // max: 34

console.log(tree.search(4)); // true
console.log(tree.search(11)); // false

tree.remove(4);
console.log(tree.root);
``` 
