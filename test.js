console.log(knapSack(6, [3, 4, 5], [2, 3, 4]));

// 背包价值
function knapSack(capacity, values, weights) {
    var n = values.length;
    var load = 0;
    var i = 0;
    var val = 0;

    for (i = 0; i < n && load < capacity; i++) {
        if (weights[i] <= (capacity - load)) {
            val += values[i];
            load += weights[i];
        } else {
            var r = (capacity - load) / weights[i];
            val += r * values[i];
            load += r * weights[i];
        }
    }
    return val;
}
