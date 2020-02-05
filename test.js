const list = [520, 600, 502, 32, 666, 36, 8, 998, 49, 9];
console.log(radixSort(list)); // [8, 9, 32, 36, 49, 502, 520, 600, 666, 998]

function radixSort(array) {
    let maxLength = 0
    for (let v of array) {
        let length = String(v).length
        if (length > maxLength) {
            maxLength = length
        }
    }
    for (i = 0; i < maxLength; i++) {
        array = sort(array, i)
    }

    function sort(array, index) {
        let buckets = []
        for (let i = 0; i < 10; i++) {
            buckets.push([])
        }
        for (let v of array) {
            // padStart用于头部补全
            let pad = String(v).padStart(maxLength, '0')
            let num = pad[maxLength - 1 - index]
            buckets[num].push(v)
        }
        let result = []
        for (let bucket of buckets) {
            result.push(...bucket)
        }
        console.log(result)
        return result
    }
    return array
}
