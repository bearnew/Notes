# canvas实现弹幕(待优化完善)
```js
// 弹幕组件
export default class Barrage {
    constructor(canvas) {
        this.canvas = document.getElementById(canvas);
        let rect = this.canvas.getBoundingClientRect();
        this.w = rect.right - rect.left;
        this.h = rect.bottom - rect.top;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.font = '20px Microsoft YaHei';
        this.barrageList = [];
    }

    //添加弹幕列表
    shoot(value, idx) {
        let top = this.getTop();
        let color = this.getColor();
        let offset = this.getOffset();
        let width = Math.ceil(this.ctx.measureText(value).width);

        let barrage = {
            value: value,
            top: top,
            top: idx % 2 * 30,
            left: this.w,
            color: color,
            offset: (idx % 2) / 10 + 1,
            width: width
        }
        this.barrageList.push(barrage);
    }

    //开始绘制
    draw() {
        if (this.barrageList.length) {
            this.ctx.clearRect(0, 0, this.w, this.h);
            for (let i = 0; i < this.barrageList.length; i++) {
                let b = this.barrageList[i];
                if (b.left + b.width <= 0) {
                    this.barrageList.splice(i, 1);
                    i--;
                    continue;
                }
                console.log(b.left, b.offset)
                b.left -= b.offset;
                this.drawText(b);
            }
        }
    }

    //绘制文字
    drawText(barrage) {
        this.ctx.fillStyle = barrage.color;
        this.ctx.fillText(barrage.value, barrage.left, barrage.top);

    }

    //获取随机颜色
    getColor() {
        return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
    }

    //获取随机top
    getTop() {
        //canvas绘制文字x,y坐标是按文字左下角计算，预留30px
        return Math.floor(Math.random() * (this.h - 30)) + 30;
    }

    //获取偏移量
    getOffset() {
        return 1;
    }

}
```
```js
// 调用
class Test extends React.Components {
    componentDidMount() {

        this.barrage = new Barrage('bullet');

        const textList = ['弹幕', '666', '233333333', 
            'javascript', 'html', 'css', '前端框架', 'Vue', 'React',
            'Angular','测试弹幕效果'
        ];

        textList.forEach((t, idx) => {
            this.barrage.shoot(t, idx);
        })

        requestAnimationFrame(this.aniCallBack);
    }

    componentWillUnmount() {
        this.setState({
            isScrolling: false
        })

        window.cancelAnimationFrame(this.stopId);
    }

    aniCallBack = () => {
        this.barrage.draw();
        if (this.state.isScrolling) {
            this.stopId = window.requestAnimationFrame(this.aniCallBack);
        }
    };
}
```