var minCoinChange = new MinCoinChange([1, 5, 10, 25]);
console.log(minCoinChange.makeChange(36)); // [1, 10, 25]

function MinCoinChange(coins) {
    var cache = {};

    this.makeChange = function (amount) {
        if (!amount) return [];
        if (cache[amount]) {
            return cache[amount];
        }

        var min = [];
        var newMin;
        var newAmount;

        for (var i = 0; i < coins.length; i++) {
            var coin = coins[i];
            newAmount = amount - coin;

            if (newAmount >= 0) {
                newMin = this.makeChange(newAmount);
                min = [coin].concat(newMin);
            }
        }

        return (cache[amount] = min);
    }
}