/**
 * Question 1
 */

var name = 'window'

var person1 = {
  name: 'person1',
  show1: function () {
    console.log(this.name)
  },
  show2: () => console.log(this.name),
  show3: function () {
    return function () {
      console.log(this.name)
    }
  },
  show4: function () {
    return () => console.log(this.name)
  },
  test: {
      name: 'person3',
      show5: () => console.log(this.name)
  }
}
var person2 = { name: 'person2' }

person1.show1() // person1
person1.show1.call(person2) // person2

person1.test.show5(); // window

person1.show2() // window
person1.show2.call(person2) // window

person1.show3()() // window
person1.show3().call(person2) // window
person1.show3.call(person2)() // person2

person1.show4()() // window
person1.show4().call(person2) // window
person1.show4.call(person2)() // person2