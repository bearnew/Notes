class Chef {
    constructor(food) {
        this.food = food;
    }

    static cook() {
        console.log(this.food);
    }
}

var a = new Chef('a');
console.log(a.food)
a.cook();