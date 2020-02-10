var values = [3, 4, 5],
    weights = [2, 3, 4],
    capacity = 5,
    n = values.length;

console.log(knapSack(capacity, weights, values, n));

// 背包价值
function knapSack(capacity, weights, values, n) {
    var i, w, a, b, ks = [];

    for (i = 0; i <= n; i++) {
        ks[i] = [];
    }

    for (i = 0; i <= n; i++) {
        for (w = 0; w <= capacity; w++) {
            if (i === 0 || w === 0) {
                ks[i][w] = 0;
            } else if (weights[i - 1] <= w) {
                a = values[i - 1] + ks[i - 1][w - weights[i - 1]]
                b = ks[i - 1][w];
                ks[i][w] = (a > b) ? a : b;
            } else {
                ks[i][w] = ks[i - 1][w];
            }
        }
    }

    return ks[n][capacity];
}
