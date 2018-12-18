## promise错误处理
### 1.reject后的东西，then中有第二个回调，进入第二个回调
```js
var test = function() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject('失败了')
		}, 1000)
	})
}

test().then(res =>{
    console.log('sucess', res);
}, fail => {
    console.log('fail', fail);
}).catch(err => {
	console.error('catch', err);
})

// fail 失败了
```
### 2.如果then中没有写第二个回调，则进入catch
```js
var test = function() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject('失败了')
		}, 1000)
	})
}

test().then(res =>{
    console.log('sucess', res);
}).catch(err => {
	console.error('catch', err);
})

// catch 失败了
```
### 3.多层promise错误处理
* __错误做法（容易出现程序Bug）:__
```js
var promiseStart = new Promise(function(resolve, reject){
    reject('promise is rejected');
});

promiseStart
.then(res => {
	console.log('resolved');
    return new Promise(function(resolve, reject){
        resolve('promise is resolved');
    });
}, fail => {
	console.log('rejected:', fail);
})
.then(res => {
    console.log('resolved:', res);
})
.catch(function(err) {
    console.error('catched:', err);
})

// rejected: promise is rejected
// resolved: undefined
```
* __正确做法（catch掉错误）:__
```js
var promiseStart = new Promise(function(resolve, reject){
    reject('promise is rejected');
});

promiseStart
.then(res => {
	console.log('resolved');
    return new Promise(function(resolve, reject){
        resolve('promise is resolved');
    });
})
.then(res => {
    console.log('resolved:', res);
})
.catch(function(err) {
    console.error('catched:', err);
})

// catched: promise is rejected
```