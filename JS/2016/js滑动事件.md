```js
('#recordList li').on('touchstart', function(e){ 
    startX = e.originalEvent.changedTouches[0].pageX, 
    startY = e.originalEvent.changedTouches[0].pageY; 
});
```
```js
$('#recordList li').on('touchmove',function(e){
    //获取滑动屏幕时的X,Y
    endX = e.originalEvent.changedTouches[0].pageX,
    endY = e.originalEvent.changedTouches[0].pageY;
    //获取滑动距离
    distanceX = endX-startX;
    distanceY = endY-startY;
    //判断滑动方向
    if(Math.abs(distanceX)>Math.abs(distanceY) && distanceX>0){
        console.log('往右滑动');
    }else if(Math.abs(distanceX)>Math.abs(distanceY) && distanceX<0){
        console.log('往左滑动');
    }else if(Math.abs(distanceX)<Math.abs(distanceY) && distanceY<0){
        console.log('往上滑动');
    }else if(Math.abs(distanceX)<Math.abs(distanceY) && distanceY>0){
        console.log('往下滑动');
    }else{
        console.log('点击未滑动');
    }

});
```