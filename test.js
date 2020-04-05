const user = {
    name: 'jay',
    age: 26,
    toJSON() {
        return {
            des: `${this.name}'s age is ${this.age}`
        }
    }
}

// {
//     ** "des": "jay's age is 26"
// }
console.log(JSON.stringify(user, null, '**')); // 优先调用toJSON方法
