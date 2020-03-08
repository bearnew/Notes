console.log(coinChange([5, 1, 10, 25], 6)); // [1, 10, 25]

function coinChange(coins, amount) {
    var memo = [];
    return dp(amount);

    function dp(n) {
        if (memo[n]) return memo[n];
        if (n === 0) return [];
        if (n < 0) return null;

        var min = Number.MAX_SAFE_INTEGER;
        var minCoins;
        var subCoins;

        for (let coin of coins) {
            if (n - coin < 0) continue;
            var subCoins = dp(n - coin);

            if (!subCoins) continue;

            if (subCoins.length + 1 < min) {
                minCoins = [coins].concat(subCoins);
                min = subCoins.length + 1;
            }
        }

        return (memo[n] = minCoins)
    }

}