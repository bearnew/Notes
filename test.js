// 双向
var graph = [
    [0, 2, 4, Infinity, Infinity, Infinity],
    [2, 0, 2, 4, 2, Infinity],
    [4, 2, 0, Infinity, 3, Infinity],
    [Infinity, 4, Infinity, 0, 3, 2],
    [Infinity, 2, 3, 3, 0, 2],
    [Infinity, Infinity, Infinity, 2, 2, 0]
];



const MAX_INTEGER = Number.MAX_SAFE_INTEGER;//没有的边
const MIN_INTEGER = Number.MIN_SAFE_INTEGER;//没有自环
console.log(prim(graph))

/**
 * Prim算法
 * 以某顶点为起点，逐步找各顶点上最小权值的边构建最小生成树，同时其邻接点纳入生成树的顶点中,只要保证顶点不重复添加即可
 * 使用邻接矩阵即可
 * 优点：适合点少边多的情况
 * @param matrix 邻接矩阵
 * @return Array 最小生成树的边集数组
 * */
function prim(matrix) {
    const rows = matrix.length,
        cols = rows,
        result = [],
        savedNode = [0];//已选择的节点
    let minVex = -1,
        minWeight = MAX_INTEGER;
    for (let i = 0; i < rows; i++) {
        let row = savedNode[i],
            edgeArr = matrix[row];
        for (let j = 0; j < cols; j++) {
            if (edgeArr[j] < minWeight && edgeArr[j] !== MIN_INTEGER) {
                minWeight = edgeArr[j];
                minVex = j;
            }
        }

        //保证所有已保存节点的相邻边都遍历到
        if (savedNode.indexOf(minVex) === -1 && i === savedNode.length - 1) {
            savedNode.push(minVex);
            result.push(new Edge(row, minVex, minWeight));

            //重新在已加入的节点集中找权值最小的边的外部边
            i = -1;
            minWeight = MAX_INTEGER;

            //已加入的边，去掉，下次就不会选这条边了
            matrix[row][minVex] = MAX_INTEGER;
            matrix[minVex][row] = MAX_INTEGER;
        }
    }
    return result;
}

class Edge {
    constructor(begin, end, weight) {
        this.begin = begin;
        this.end = end;
        this.weight = weight;
    }
    getBegin() {
        return this.begin;
    }
    getEnd() {
        return this.end;
    }
    getWeight() {
        return this.weight;
    }
}