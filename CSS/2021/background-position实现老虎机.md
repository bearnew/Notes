```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <style>
      .num {
        width: 81px;
        height: 71.4px;
        background: url("https://upload-images.jianshu.io/upload_images/7794209-45e3644b62215536.png?imageMogr2/auto-orient/strip|imageView2/2/w/81/format/webp")
          center 0 repeat-y;
        margin-right: 15px;
        background-size: 100%;
        transition-property: background-position-y;
        transition-timing-function: cubic-bezier(0.6, 0.1, 0.15, 0.9);
      }
      .num1 {
        transition-delay: 0s;
        transition-duration: 4s;
      }
      .num2 {
        transition-delay: 0.3s;
        transition-duration: 5s;
      }
      .num3 {
        transition-delay: 0.6s;
        transition-duration: 8s;
      }
    </style>
  </head>
  <body>
    <div style="display: flex; margin-bottom: 30px">
      <div class="num num1"></div>
      <div class="num num2"></div>
      <div class="num num3"></div>
    </div>
    <button>开始抽奖</button>
    <script>
      var drawCnt = 0; // 计数器，每抽一次奖自增1
      var u = 67.4; // 每个数字图片的高度，整张长图的高度是337px

      function getNum(n) {
        return Math.floor(Math.random() * (n + 1));
      }

      function getArray(maxNum, len) {
        var result = [];
        while (result.length < len) {
          var num = getNum(maxNum);
          if (
            result.length === len - 1 &&
            result.filter((item) => item === num).length === len - 1
          ) {
            console.log("数组中元素全相同则重新生成最后一个元素！");
          } else {
            result.push(num);
          }
        }
        return result;
      }

      function getPosition(number) {
        // 每次抽奖默认先滚动完整的六圈
        return 337 * 6 * (drawCnt + 1) + u * (5 - number);
      }

      function draw() {
        // 生成的数组表示的是图片的下标0表示第一章图片
        const result = getArray(4, 3);
        console.log(result);
        document.getElementsByClassName("num")[0].style.backgroundPositionY =
          getPosition(result[0]) + "px";
        document.getElementsByClassName("num")[1].style.backgroundPositionY =
          getPosition(result[1]) + "px";
        document.getElementsByClassName("num")[2].style.backgroundPositionY =
          getPosition(result[2]) + "px";
        drawCnt++;
      }

      window.onload = function () {
        document
          .getElementsByTagName("button")[0]
          .addEventListener("click", function () {
            draw();
          });
      };
    </script>
  </body>
</html>
```
