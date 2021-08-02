let userInfo = {
  name: "jack.ma",
  age: 13,
  sex: "male",
  updateInfo: function () {
    //模拟xmlhttprequest请求延时
    var bar = () => {
      setTimeout(function () {
        console.log(this);
        this.name = "pony.ma";
        this.age = 39;
        this.sex = "female";
      }, 100);
    };

    bar();
  },
};
userInfo.updateInfo(); // {name: "jack.ma", age: 13, sex: "male", updateInfo: ƒ}
setTimeout(() => {
  console.log(userInfo); // {name: "pony.ma", age: 39, sex: "female", updateInfo: ƒ}
}, 200);
