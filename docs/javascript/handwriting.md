# 手写代码

## 实现new方法

`new` 关键字在创建实例时经历了如下过程：

- 先创建一个新的、空的实例对象

- 将实例对象的原型，指向构造函数的原型

  实例对象的原型是`constructor.prototype`，这样一来`context`就被挂到了正确的原型链上面。因为通常原型链上会定义“类”的方法，所以这一步用来实现**方法**的挂载。

- 将构造函数内部的this，指向实例对象

  这一步骤，实现了对构造函数内部代码的执行，通常是一些**对象属性的初始化**。例如`this.name = name;`之类的。所以这一步用来实现**属性**的定义和初始化。

- 若构造函数有返回对象则直接返回，否则最后返回该实例对象

  这是因为有些构造函数里面可能有`return xxx`的语句。这种情况下，如果同时`xxx`是个对象的话，那么最终就返回result，否则就返回前面构造出来的实例对象context。

```js
function _new(...args) {
  	var constructor = args.shift();
    // 声明一个中间对象,将实例的原型指向构造函数的原型
  	var context = Object.create(constructor.prototype);
    // 相当于：
    // var context = {};
    // context.__proto__ = constructor.prototype;
    
  	var result = constructor.apply(context, args);
  	return (typeof result === 'object' && result != null) ? result : context;
}

var actor = _new(Person, "张三", 28);
```

## 实现`instanceof`

使用： `a instanceof Object`  

判断Object的prototype是否在a的原型链上

```js
// a instanceof b

// 递归方式：
function _instanceof(a,b){
    const proto = a.__proto__;
    if(proto){
        if(b.prototype === proto){
            return true
        }else{
            return _instanceof(proto,b)
        }
    }else{
        return false
    }
}

// 循环迭代方式：
function _instanceof(a,b){
    while(a){
        if(a.__proto__ === b.prototype){
            return true
        }
        a = a.__proto__
    }
    return false
}
```

## 实现reduce方法

```css
arr.reduce(callback,[initialValue])
```

**reduce 为数组中的每一个元素依次执行回调函数**，不包括数组中被删除或从未被赋值的元素，接受四个参数：初始值（或者上一次回调函数的返回值），当前元素值，当前索引，调用 reduce 的数组。

```cpp
callback （执行数组中每个值的函数，包含四个参数）

    1、previousValue （上一次调用回调返回的值，或者是提供的初始值（initialValue））
    2、currentValue （数组中当前被处理的元素）
    3、index （当前元素在数组中的索引）
    4、array （调用 reduce 的数组）

initialValue （作为第一次调用 callback 的第一个参数。）
```

```js
function reduce(arr,callback,initial){
    let i = 0
    // 若有初始值，则作为第一次调用callback的参数
    let previousValue = initial === undefined ? arr[i++] : initial
    // 为数组中的每一个元素依次执行回调函数
    for(; i < arr.length; i++){
        previousValue = callback(previousValue,arr[i],i,arr)
    }
    // 返回最终的调用结果
    return previousValue
}
```

## 实现节流

原理：在给定时间time内，只能触发一次

对某个要执行的函数进行**节流包装**，返回新函数

```js
function throttle(fn,time){
    let timer = null;
    return function(...args){
        if(!timer){
            timer = setTimeout(()=>{
                timer = null;
                fn.apply(this,args);
            },time)
        }
    }
}
```

## 实现防抖

原理：若给定时间time内，还有继续触发，则重新计时，time时间后触发

对某个要执行的函数进行**防抖包装**，返回新函数

```js
function debounce(fn,time){
    let timer = null;
    return function(...args){
        clearTimeout(timer) // 重新计时
		timer = setTimeout(()=>{
            fn.apply(this,args)
        },time)
    }
}
```

## 实现bind

一个简单的`bind()`函数接收一个函数和一个环境，并返回新函数，新函数会在**给定环境**中调用**给定函数**（并将所有参数原封不动传递过去）。—— JavaScript高级程序设计 `P603`

```js
function bind(fn,context){
    return function(...args){
        return fn.apply(context,args)
    }
}
```

使用：

```js
var handler = {
    message: 'Event handler',
     handleClick: function (event) {
            alert(this.message + ':' + event.type )
     }
};


var btn = document.createElement('button')
document.body.appendChild(btn)
btn.style = "width:100px;height:100px;"

// ES5自带bind
btn.addEventListener('click', handler.handleClick.bind(handler, 'button'))

btn.addEventListener('click',bind(handler.handleClick,handler))
/**
  * 注意：
  * 被绑定函数与普通函数相比有更多的开销，他们需要更多的内存，
  * 同时也因为多重函数调用稍微慢一点，
  * 所以最好只在必要时使用
  */
```

## 实现call

```js
Function.prototype.call = function(context,...args){
    context = context || window
    context.func = this
    // 判断是否存在函数
    if(typeof context.func !== 'function') throw new TypeError('call must be called on a function')
    // 用指定上下文调用函数
    let res = context.func(...args)
    // 去除函数
    delete context.func
    // 返回结果
    return res
}
```

## 实现apply

```js
Function.prototype.call = function(context,args){
    context = context || window
    context.func = this
    // 判断是否存在函数
    if(typeof context.func !== 'function') throw new TypeError('apply must be called on a function')
    // 用指定上下文调用函数
    let res = context.func(...args)
    // 去除函数
    delete context.func
    // 返回结果
    return res
}
```

## 实现浅拷贝

```js
// 是ES6新添加的接口，主要的用途是用来合并多个JavaScript的对象。
Object.assign()
```

## 实现深拷贝

**深拷贝乞丐版**

通过利用`JSON.parse(JSON.stringify())`来实现深拷贝的目的，但利用`JSON`拷贝也是有缺点的， 当要拷贝的数据中含有undefined/**function**/symbol类型是无法进行拷贝的

```js
JSON.parse(JSON.stringify())
```

**深拷贝基础版**

考虑到我们要拷贝的对象是不知道有多少层深度的，我们可以用**递归**来解决问题

- 如果是**原始类型**，无需继续拷贝，直接返回

- 如果是**引用类型**，
  - **对象**：创建一个新的对象，遍历需要克隆的对象，将需要克隆对象的属性执行深拷贝后依次添加到新对象上。
  - **数组**：创建一个新的数组，遍历需要克隆的数组.....
- 缺陷：未考虑循环引用，可能因为递归进入死循环导致栈内存溢出了

```js
function clone(target){
    // 引用类型
    if(typeof target === 'object'){
        // 数组还是对象
        let cloneTarget = Array.isArray(target) ? [] : {}
        for(const key in target){
            cloneTarget[key] = clone(target[key])
        }
    } // 原始类型
    else{
        return target
    }
}
```

循环引用的缺陷例子：

```js
// 缺陷例子：
const target = {
    field1: 1,
    field2: undefined,
    field3: {
        child: 'child'
    },
    field4: [2, 4, 8]
};
target.target = target;
const result = clone(target); // 递归进入死循环导致栈内存溢出
```

解决循环引用问题，我们可以额外**开辟一个存储空间**，来**存储**当前对象和拷贝对象的对应关系

当需要拷贝当前对象时，**先去存储空间中找，有没有拷贝过这个对象**，如果**有的话直接返回**，如果没有的话继续拷贝

这个存储空间，需要可以存储key-value形式的数据，且key可以是一个引用类型，我们可以选择Map这种数据结构：

- 检查map中有无克隆过的对象
  - 有 - 直接返回
  - 没有 - 将当前对象作为key，克隆对象作为value进行存储

- 继续克隆

```js
function clone(target,map = new Map()){
    // 引用类型
    if(typeof target === 'object'){
        // 数组还是对象
        let cloneTarget = Array.isArray(target) ? [] : {}
        
        // 解决循环引用
        if(map.get(target)) return map.get(target) // 若有拷贝过这个对象，则直接返回
        map.set(target,cloneTarget) // 若没有则，则存入对象，继续拷贝
        
        for(const key in target){
            cloneTarget[key] = clone(target[key],map)
        }
    } // 原始类型
    else{
        return target
    }
}
```

## 基于promise的`ajax`封装

```js
function getStringParam(param){
	let dataString = ''
    for(const key in param){
        data += `${key}=${param[key]}&`
    }
    return dataString
}

function ajax(url,method = 'get',param = {}){
    return new Promise((resolve,reject)=>{
        // 新建 XMLHttpRequest() 对象
        const xhr = new XMLHttpRequest();
        // 将参数拼为 key=value&key=value 
        const paramString = getStringParam(param);
        // 若请求为get，则在url上拼接请求参数
        if(method === 'get' && paramString){
            url.indexOf('?') > -1 ? url += paramString : url += `?${paramString}`
        }
        // 传入方法、请求路径
        xhr.open(method,url)
        // 响应完成时调用
        xhr.onload = function(){
            const result = {
                status: xhr.status,
                statusText: xhr.statusText,
                headers: xhr.getAllResponseHeaders(),
                data: xhr.response || xhr.responseText
            }
            // 当响应为 2** 或者 304 not modify，正常决议
            if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
                resolve(result)
            }else{
                reject(result)
            }
        }
        xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded')
        xhr.withCredentials = true
        xhr.onerror = function(){
            reject(new TypeError('请求出错'))
        }
        xhr.timeout = function(){
            reject(new TypeError('请求超时'))
        }
        xhr.onabort = function(){
            reject(new TypeError('请求被终止'))
        }
        if(method === 'post'){
            xhr.send(paramString)
        }else{
            xhr.send(null)
        }
        
    })
}
```

## ES6实现promise

### 1、定义Myromise的Class

首先，我们定义一个名为 MyPromise 的 Class，它接受一个函数 handle 作为参数，并在构造时执行handle。（handle又包含resolve和reject两个参数，它们是两个函数。）

```js
class MyPromise{
    constructor(handle){
        if(!isFunction(handle)){
            throw new Error('MyPromise must accept a function as a parameter')
        }
        // 执行handle
        try{
            handle(this._resolve.bind(this),this._reject.bind(this))
        } catch(err){
            this._reject(err)
        }
    }
    // 添加resolve时执行的函数
    _resolve(val){

    }
    // 添加reject时执行的函数
    _reject(err){

    }
}
```

### 2、定义三种状态

定义三个常量，用于标记Promise对象的三种状态

```js
const PENDING = 'PENDING'  进行中
const FULFILLED = 'FULFILLED' 已成功
const REJECTED = 'REJECTED' 已失败
```

### 3、 添加状态和值

再为 MyPromise 添加状态和值（`constructor`中），并在`resolve`和`reject`中添加状态改变的执行逻辑

未决议时（即`PENDING`状态时才能执行）
`resolve: PENDING -> FULFILLED`
`reject: PENDING -> REJECTED`

```js
class MyPromise{
  constructor(handle){
  	// ...
    // 添加状态
    this._status = PENDING
    // 添加值
    this._value = undefined
  }
  // 添加resolve时执行的函数
  _resolve(val){
    // 未决议时才能决议
    if(this._status !== PENDING) return
    this._status = FULFILLED
    this._value = val
  }
  // 添加reject时执行的函数
  _reject(err){
    if(this._status !== PENDING) return
    this._status = REJECTED
    this._value = err
  }
}
```

### 4、分析then方法

分析`Promise`对象的`then`方法

`then`方法接收两个函数参数，`Promise.then(onFulfilled,onRejected)`

- 根据当前状态处理两个回调函数

  - `onFulfilled`: 当`Promise`状态为`FULFILLED`已成功时，必须被调用，且只能调用一次

  - `onRejected`: 当`Promise`状态为`REJECTED`已失败时，必须被调用，且只能调用一次
  - 当`Promise`状态为`PENDING`进行中时，将函数放入数组队列中（注册）等待执行，实现`then`方法能多次调用

- 改变状态时，`then`方法对应的状态的回调函数队列应全部执行，并加入延时机制

  （就是通过`setTimeout`机制，将`resolve`中执行回调的逻辑放置到JS任务队列末尾，以保证在`resolve`执行时，`then`方法的回调函数已经注册完成. ）
  - 当`Promise`状态变为`FULFILLED`已成功时，所有已注册的`onFulfilled`需按照其注册顺序依次回调

  - 当`Promise`状态变为`REJECTED`已成功时，所有已注册的`onRejected`需按照其注册顺序依次回调

- `then`方法必须返回一个新的`Promise`对象，因此 `Promise `支持链式调用

  新的`Promise`对象的状态，由返回这个新`Promise`的`then`方法的回调函数执行的结果决定:

  - 如果 `onFulfilled`或者`onRejected `返回的是一个值

    - 若`x`不为`Promise`，则`x`直接作为新`Promise`对象的成功状态的值

    - 若`x`为`Promise`，则等待`x`的状态发生改变，并且新的`Promise`对象的状态与x状态相同

  - 如果 `onFulfilled`或者`onRejected `抛出的是一个异常/错误`e`，则新的`Promise`对象的状态变为`REJECTED`已失败，`e`为值

  - 如果 `onFulfilled` 不是函数且旧的`Promise` 状态为`成功（FUIFLLED）`，新的`Promise`必须变为成功（`FUIFLLED`）并返回 旧的promise 成功的值

  - 如果 `onRejected` 不是函数且 旧的`Promise` 状态为`失败（REJECTED）`，新的`Promise`必须变为失败（`REJECTED`）并返回旧的promise 失败的值

### 5、添加注册函数存放数组队列

为`then`方法作准备，添加成功函数与失败函数存放的数组队列（`constructor`中）

分别维护两个数组，将`then`方法注册时的回调函数添加到数组中，等待状态改变时执行

```js
class MyPromise{
    constructor(handle){
      // ...
      // 添加成功回调函数队列
      this._fulfilledQueues = []
      // 添加失败回调函数队列
      this._rejectedQueues = []
    }
    // ...
}
```

### 6、添加then方法

#### ① 两个回调函数参数 

根据`Promise`当前状态，来决定`then`方法接收的两个函数参数如何处理

```js
class MyPromise{
    constructor(handle){
      // ...	
    }
   	// 添加then方法
    then(onFulfilled,onRejected){ // 接收两个函数参数
        const {_value,_status} = this
        switch(_status){
            // 当状态为PENDING时，将then方法回调函数加入执行队列中(注册)等待执行
            case PENDING:
                this._fulfilledQueues.push(onFulfilled)
                this._rejectedQueues.push(onRejected)
                break
            // 当状态为FULFILLED时，立即执行对应的成功回调函数
            case FULFILLED:
                onFulfilled(_value)
                break
            // 当状态为REJECTED时，立即执行对应的失败回调函数
            case REJECTED:
                onRejected(_value)
                break 
        }
    }
}
```

#### ② 返回新的Promise对象 

`then`方法必须返回一个新的`Promise`对象，因此 `Promise `支持链式调用

```js
class MyPromise{
    constructor(handle){
      // ...	
    }
   	// 添加then方法
    then(onFulfilled,onRejected){ // 接收两个函数参数
        const {_value,_status} = this
        return new MyPromise((onFulfilledNext,onRejectedNext)=>{
            /**
         	  * 这里面具体做什么，就是根据上一个promise的then的回调函数返回的值来决定的
         	 */
            // ...
        })
    }
}
```

因为新的`Promise`对象的状态与值，由`then`的回调函数或其返回的值决定，所以需要：

- 封装一个**成功**时执行的函数，里面判断了`then`参数**是否为函数**，及返回值**是否为`Promise`**
- 封装一个**失败**时执行的函数，里面判断了`then`参数**是否为函数**，及返回值**是否为`Promise`**

```js
class MyPromise{
    constructor(handle){
        // ...	
    }
    // 添加then方法
    then(onFulfilled,onRejected){ // 接收两个函数参数
        const {_value,_status} = this
        return new MyPromise((onFulfilledNext,onRejectedNext)=>{
            /**
                  * 这里面具体做什么，就是根据上一个promise的then的回调函数返回的值来决定的
                 */
            // 封装一个成功时执行的函数
            let fulfilled = value =>{
                try{
                    // 如果 onFulfilled 不是函数且 旧的promise 状态为成功（FUIFLLED），新的promise必须变为成功（FUIFLLED）并返回 旧的promise 成功的值
                    if(!isFunction(onFulfilled)){
                        onFulfilledNext(value)
                    }else{
                        let res = onFulfilled(value)
                        // 如果res为Promise，则等待res的状态发生改变，并且新的promise对象的状态与res状态相同（即等res决议后，将新promise对象的回调作为res.then的回调）
                        if(res instanceof MyPromise){
                            res.then(onFulfilledNext,onRejectedNext)
                        }else{
                            // 否则，将结果直接作为值，传入下一个then的成功的回调函数，并执行
                            onFulfilledNext(res)
                        }
                    }
                }catch(err){
                    // 如果函数执行出错，则新的Promise对象状态为失败
                    onRejectedNext(err)
                }
            }
            // 封装一个失败时执行的函数
            let rejected = error=>{
                try{
                    // 如果 onRejected 不是函数且 旧的promise 状态为失败（REJECTED），新的promise必须变为失败（REJECTED）并返回旧的promise 失败的值
                    if(!isFunction(onRejected)){
                        onRejectedNext(error)
                    }else{
                        let res = onRejected(error)
                        // 如果res为Promise，则等待res的状态发生改变，并且新的promise对象的状态与res状态相同（即等res决议后，将新promise对象的回调作为res.then的回调）
                        if(res instanceof MyPromise){
                            res.then(onFulfilledNext,onRejectedNext)
                        }else{
                            // 否则，将结果直接作为值，传入下一个then的成功的回调函数，并执行
                            // 为什么不是onRejectedNext，因为上一个promise（不能哪个回调函数）返回的值，都是下一个promise成功回调函数的参数值
                            onFulfilledNext(res)
                        }
                    }
                }catch(err){
                    // 如果函数执行出错，则新的Promise对象状态为失败
                    onRejectedNext(err)
                }
            }
            // 根据状态改变肯定要执行对应操作
            switch(_status){
                    // 当状态为PENDING时，将then方法回调函数加入执行队列中(注册)等待执行
                case PENDING:
                    this._fulfilledQueues.push(fulfilled)
                    this._rejectedQueues.push(rejected)
                    break
                    // 当状态为FULFILLED时，立即执行对应的成功回调函数
                case FULFILLED:
                    fulfilled(_value) // 调用封装的成功时执行的函数
                    break
                case REJECTED:
                    rejected(_value) // 调用封装的失败时执行的函数
                    break 
            }
        })
    }
}
```

#### ③ 执行注册队列中所有回调函数  

改变`Promise`状态时（即当 `resolve` 或 `reject` 方法执行时），执行`then`方法注册的对应状态的所有回调函数，并加入延时机制

```js
class MyPromise{
    constructor(handle){
        // ...
    }
    // 添加resolve时执行的函数
    _resolve(val){
        // 未决议时才能决议
        if(this._status !== PENDING) return
        // 依次执行成功队列中的函数，并清空队列
        const run = ()=>{
            this._status = FULFILLED
            this._value = val
            let cb
            while(cb = this._fulfilledQueues.shift()){
                cb(val)
            }
        }
        // 就是通过setTimeout机制，将resolve中执行回调的逻辑放置到JS任务队列末尾，以保证在resolve执行时，then方法的回调函数已经注册完成.
        setTimeout(()=> run(),0)
    }
    // 添加reject时执行的函数
    _reject(err){
        if(this._status !== PENDING) return
        // 依次执行失败队列中的函数，并清空队列
        const run = ()=>{
            this._status = REJECTED
            this._value = err
            let cb
            while(cb = this._rejectedQueues.shift()){
                cb(val)
            }
        }
        // 就是通过setTimeout机制，将resolve中执行回调的逻辑放置到JS任务队列末尾，以保证在reject执行时，then方法的回调函数已经注册完成.
        setTimeout(()=> run(),0)
    }
    // ...
}
```

这里还有一种特殊的情况，就是当 resolve 方法传入的参数为一个 Promise 对象时，则该 Promise 对象状态决定当前 Promise 对象的状态。

```js
const p1 = new Promise(function (resolve, reject) {
    reject('1')
});

const p2 = new Promise(function (resolve, reject) {
    resolve(p1);
})
p2.then(res=>{
    console.log('res',res)
},res2=>{
    console.log('res2',res2)
}) 
// res2 1
```

> 上面代码中，p1 和 p2 都是 Promise 的实例，但是 p2 的resolve方法将 p1 作为参数，即一个异步操作的结果是返回另一个异步操作。

> 注意，这时 p1 的状态就会传递给 p2，也就是说，p1 的状态决定了 p2 的状态。如果 p1 的状态是Pending，那么 p2 的回调函数就会等待 p1 的状态改变；如果 p1 的状态已经是 Fulfilled 或者 Rejected，那么 p2 则执行对应状态的回调函数。

这里与then中判断x是否为Promise时的情况是一样的，所以将里面重复的逻辑抽出，写入resolve中：

```js
class MyPromise{
    constructor(handle){
        // ...
    }
    // 添加resolve时执行的函数
    _resolve(val){
        // 未决议时才能决议
        if(this._status !== PENDING) return
       
        const run = ()=>{
            // 依次执行成功队列中的函数，并清空队列
            const runFulfilled = (value) => {
                let cb;
                while (cb = this._fulfilledQueues.shift()) {
                    cb(value)
                }
            }
            // 依次执行失败队列中的函数，并清空队列
            const runRejected = (error) => {
                let cb;
                while (cb = this._rejectedQueues.shift()) {
                    cb(error)
                }
            }
            /**
           	 * 如果resolve的参数为Promise对象，则必须等Promise对象状态改变后，
           	 * 当前Promise对象的状态才会改变，且状态取决于参数Promise对象的状态
             */
            if(val instanceof MyPromise){
                val.then(value=>{
                    this._value = value
                    this._status = FULFILLED
                    runFulfilled(value)
                },err=>{
                    this._value = err
                    this._status = REJECTED
                    runRejected(err)
                })
            }else{
                this._value = val
                this._status = FULFILLED
                runFulfilled(val)
            }
        }
        // 就是通过setTimeout机制，将resolve中执行回调的逻辑放置到JS任务队列末尾，以保证在resolve执行时，then方法的回调函数已经注册完成.
        setTimeout(()=> run(),0)
    }
    //...
}
```

#### ④ 最终then方法

```js
class MyPromise{
    constructor(handle){
        if(!isFunction(handle)){
            throw new Error('MyPromise must accept a function as a parameter')
        }
        // 执行handle
        try{
            handle(this._resolve.bind(this),this._reject.bind(this))
        } catch(err){
            this._reject(err)
        }

        // 添加状态
        this._status = PENDING
        // 添加值
        this._value = undefined
        // 添加成功回调函数队列
        this._fulfilledQueues = []
        // 添加失败回调函数队列
        this._rejectedQueues = []
    }
    // 添加resolve时执行的函数
    _resolve(val){
        // 未决议时才能决议
        if(this._status !== PENDING) return
        const run = ()=>{
            // 依次执行成功队列中的函数，并清空队列
            const runFulfilled = (value) => {
                let cb;
                while (cb = this._fulfilledQueues.shift()) {
                    cb(value)
                }
            }
            // 依次执行失败队列中的函数，并清空队列
            const runRejected = (error) => {
                let cb;
                while (cb = this._rejectedQueues.shift()) {
                    cb(error)
                }
            }
            /**
           * 如果resolve的参数为Promise对象，则必须等Promise对象状态改变后，
           * 当前Promise对象的状态才会改变，且状态取决于参数Promise对象的状态
           */
            if(val instanceof MyPromise){
                val.then(value=>{
                    this._value = value
                    this._status = FULFILLED
                    runFulfilled(value)
                },err=>{
                    this._value = err
                    this._status = REJECTED
                    runRejected(err)
                })
            }else{
                this._value = val
                this._status = FULFILLED
                runFulfilled(val)
            }
        }
        // 就是通过setTimeout机制，将resolve中执行回调的逻辑放置到JS任务队列末尾，以保证在resolve执行时，then方法的回调函数已经注册完成.
        setTimeout(()=> run(),0)
    }
    // 添加reject时执行的函数
    _reject(err){
        if(this._status !== PENDING) return
        // 依次执行失败队列中的函数，并清空队列
        const run = ()=>{
            this._status = REJECTED
            this._value = err
            let cb
            while(cb = this._rejectedQueues.shift()){
                cb(val)
            }
        }
        // 就是通过setTimeout机制，将resolve中执行回调的逻辑放置到JS任务队列末尾，以保证在reject执行时，then方法的回调函数已经注册完成.
        setTimeout(()=> run(),0)
    }
    // 添加then方法
    then(onFulfilled,onRejected){ // 接收两个函数参数
        const {_value,_status} = this

        // 肯定要返回一个新的Promise对象
        // 为什么要将这个新的promise处理
        return new MyPromise((onFulfilledNext,onRejectedNext)=>{
            /**
             * 这里面具体做什么，就是根据上一个promise的then的回调函数返回的值来决定的
             */

            // 根据状态改变肯定要执行对应操作
            switch(_status){
                    // 当状态为PENDING时，将then方法回调函数加入执行队列中(注册)等待执行
                case PENDING:
                    this._fulfilledQueues.push(onFulfilled)
                    this._rejectedQueues.push(onRejected)
                    break
                    // 当状态为FULFILLED时，立即执行对应的成功回调函数
                case FULFILLED:
                    fulfilled(_value) // 调用封装的成功时执行的函数
                    break
                case REJECTED:
                    rejected(_value) // 调用封装的失败时执行的函数
                    break 
            }
            // 封装一个成功时执行的函数
            let fulfilled = value =>{
                try{
                    // 如果 onFulfilled 不是函数且 旧的promise 状态为成功（FUIFLLED），新的promise必须变为成功（FUIFLLED）并返回 旧的promise 成功的值
                    if(!isFunction(onFulfilled)){
                        onFulfilledNext(value)
                    }else{
                        let res = onFulfilled(value)
                        onFulfilledNext(res)
                    }
                }catch(err){
                    // 如果函数执行出错，则新的Promise对象状态为失败
                    onRejectedNext(err)
                }
            }
            // 封装一个失败时执行的函数
            let rejected = error=>{
                try{
                    // 如果 onRejected 不是函数且 旧的promise 状态为失败（REJECTED），新的promise必须变为失败（REJECTED）并返回旧的promise 失败的值
                    if(!isFunction(onRejected)){
                        onRejectedNext(error)
                    }else{
                        let res = onRejected(error)
                        onFulfilledNext(res)
                    }
                }catch(err){
                    // 如果函数执行出错，则新的Promise对象状态为失败
                    onRejectedNext(err)
                }
            }
        })
    }
}
```

### 7、添加catch方法

相当于调用 `then` 方法, 但只传入 `Rejected` 状态的回调函数

```js
class MyPromise{
    constructor(handle){
      // ...	
    }
    // ...
   	// 添加catch方法
    catch(onRejected){
        return this.then(undefined,onRejected)
    }
}
```

### 8、静态resolve方法

`Promise.resolve`

如果参数是Promise实例，直接返回这个实例，

否则new一个Promise并resolve，再返回

```js
class MyPromise{
    constructor(handle){
      // ...	
    }
    // ...
   	// 添加静态resolve方法
    static resolve(value){
        // 如果参数是MyPromise实例，直接返回这个实例
        if(value instanceof MyPromise) return value
        return new MyPromise(resolve=>resolve(value))
    }
}
```

### 9、静态reject方法

`Promise.reject`

```js
class MyPromise{
    constructor(handle){
      // ...	
    }
    // ...
   	// 添加静态reject方法
    static reject(value){
        return new MyPromise(reject=>reject(value))
    }
}
```

### 10、静态all方法

`Promise.all`

1.返回一个`Promise`对象

2.等所有`Promise`**成功决议**才能`resolve`，否则`reject`

3.需要调用`Promise.resolve`，来处理参数数组中有不是`Promise`实例的情况

```js
class MyPromise{
    constructor(handle){
        // ...
    }
    // ...
    // 添加静态all方法
    static all(list){
        return new MyPromise((resolve,reject)=>{
            // promise成功决议的所有值
            let values = []
            // 计数
            let count = 0
            for(let [key,p] of list.entries){
                // 数组参数如果不是MyPromise实例，先调用MyPromise.resolve
                this.resolve(p).then(res => {
					values[key] = res
                    count++
                    // 所有状态都变成fulfilled时返回的MyPromise状态就变成fulfilled
                    if(count === list.length) resolve(values)
                },err =>{
                    // 有一个被rejected时返回的MyPromise状态就变成rejected
					reject(err)
                })
        	}
        })
    }
}
```

### 11、静态race方法

`Promise.race`

```js
class MyPromise{
    constructor(handle){
        // ...
    }
    // ...
    // 添加静态race方法
    static race(list){
        return new MyPromise((resolve,reject)=>{
            for(let p of list){
                this.resolve(p).then(res => {
	                // 只要有一个实例率先改变状态，新的MyPromise的状态就跟着改变
                    resolve(res)
                },err =>{
					reject(err)
                })
        	}
        })
    }
}
```

### 12、finally方法

不管`Promise`对象最后状态如何，都会调用

```js
class MyPromise{
    constructor(handle){
        // ...
    }
    // ...
    finally(fn){
        return this.then(
        	res => { 
                fn() 
                return res
            },
            err =>{
                fn()
                throw err
            }
        )
    }
}
```

### 13、完整ES6实现Promise

```js
class MyPromise{
    constructor(handle){
        if(!isFunction(handle)){
            throw new Error('MyPromise must accept a function as a parameter')
        }
        // 执行handle
        try{
            handle(this._resolve.bind(this),this._reject.bind(this))
        } catch(err){
            this._reject(err)
        }

        // 添加状态
        this._status = PENDING
        // 添加值
        this._value = undefined
        // 添加成功回调函数队列
        this._fulfilledQueues = []
        // 添加失败回调函数队列
        this._rejectedQueues = []
    }
    // 添加resolve时执行的函数
    _resolve(val){
        // 未决议时才能决议
        if(this._status !== PENDING) return
        const run = ()=>{
            // 依次执行成功队列中的函数，并清空队列
            const runFulfilled = (value) => {
                let cb;
                while (cb = this._fulfilledQueues.shift()) {
                    cb(value)
                }
            }
            // 依次执行失败队列中的函数，并清空队列
            const runRejected = (error) => {
                let cb;
                while (cb = this._rejectedQueues.shift()) {
                    cb(error)
                }
            }
            /**
           * 如果resolve的参数为Promise对象，则必须等Promise对象状态改变后，
           * 当前Promise对象的状态才会改变，且状态取决于参数Promise对象的状态
           */
            if(val instanceof MyPromise){
                val.then(value=>{
                    this._value = value
                    this._status = FULFILLED
                    runFulfilled(value)
                },err=>{
                    this._value = err
                    this._status = REJECTED
                    runRejected(err)
                })
            }else{
                this._value = val
                this._status = FULFILLED
                runFulfilled(val)
            }
        }
        // 就是通过setTimeout机制，将resolve中执行回调的逻辑放置到JS任务队列末尾，以保证在resolve执行时，then方法的回调函数已经注册完成.
        setTimeout(()=> run(),0)
    }
    // 添加reject时执行的函数
    _reject(err){
        if(this._status !== PENDING) return
        // 依次执行失败队列中的函数，并清空队列
        const run = ()=>{
            this._status = REJECTED
            this._value = err
            let cb
            while(cb = this._rejectedQueues.shift()){
                cb(val)
            }
        }
        // 就是通过setTimeout机制，将resolve中执行回调的逻辑放置到JS任务队列末尾，以保证在reject执行时，then方法的回调函数已经注册完成.
        setTimeout(()=> run(),0)
    }
    // 添加then方法
    then(onFulfilled,onRejected){ // 接收两个函数参数
        const {_value,_status} = this

        // 肯定要返回一个新的Promise对象
        // 为什么要将这个新的promise处理
        return new MyPromise((onFulfilledNext,onRejectedNext)=>{
            /**
             * 这里面具体做什么，就是根据上一个promise的then的回调函数返回的值来决定的
             */

            // 根据状态改变肯定要执行对应操作
            switch(_status){
                    // 当状态为PENDING时，将then方法回调函数加入执行队列中(注册)等待执行
                case PENDING:
                    this._fulfilledQueues.push(onFulfilled)
                    this._rejectedQueues.push(onRejected)
                    break
                    // 当状态为FULFILLED时，立即执行对应的成功回调函数
                case FULFILLED:
                    fulfilled(_value) // 调用封装的成功时执行的函数
                    break
                case REJECTED:
                    rejected(_value) // 调用封装的失败时执行的函数
                    break 
            }
            // 封装一个成功时执行的函数
            let fulfilled = value =>{
                try{
                    // 如果 onFulfilled 不是函数且 旧的promise 状态为成功（FUIFLLED），新的promise必须变为成功（FUIFLLED）并返回 旧的promise 成功的值
                    if(!isFunction(onFulfilled)){
                        onFulfilledNext(value)
                    }else{
                        let res = onFulfilled(value)
                        onFulfilledNext(res)
                    }
                }catch(err){
                    // 如果函数执行出错，则新的Promise对象状态为失败
                    onRejectedNext(err)
                }
            }
            // 封装一个失败时执行的函数
            let rejected = error=>{
                try{
                    // 如果 onRejected 不是函数且 旧的promise 状态为失败（REJECTED），新的promise必须变为失败（REJECTED）并返回旧的promise 失败的值
                    if(!isFunction(onRejected)){
                        onRejectedNext(error)
                    }else{
                        let res = onRejected(error)
                        onFulfilledNext(res)
                    }
                }catch(err){
                    // 如果函数执行出错，则新的Promise对象状态为失败
                    onRejectedNext(err)
                }
            }
        })
    }
    // 添加catch方法
    catch(onRejected){
        return this.then(undefined,onRejected)
    }
    // 添加静态resolve方法
    static resolve(value){
        // 如果参数是MyPromise实例，直接返回这个实例
        if(value instanceof MyPromise) return value
        return new MyPromise(resolve=>resolve(value))
    }
    // 添加静态reject方法
    static reject(value){
        return new MyPromise(reject=>reject(value))
    }
    // 添加静态all方法
    static all(list){
        return new MyPromise((resolve,reject)=>{
            // promise成功决议的所有值
            let values = []
            // 计数
            let count = 0
            for(let [key,p] of list.entries){
                // 数组参数如果不是MyPromise实例，先调用MyPromise.resolve
                this.resolve(p).then(res => {
					values[key] = res
                    count++
                    // 所有状态都变成fulfilled时返回的MyPromise状态就变成fulfilled
                    if(count === list.length) resolve(values)
                },err =>{
                    // 有一个被rejected时返回的MyPromise状态就变成rejected
					reject(err)
                })
        	}
        })
    }
    // 添加静态race方法
    static race(list){
        return new MyPromise((resolve,reject)=>{
            for(let p of list){
                this.resolve(p).then(res => {
	                // 只要有一个实例率先改变状态，新的MyPromise的状态就跟着改变
                    resolve(res)
                },err =>{
					reject(err)
                })
        	}
        })
    }
    finally(fn){
        return this.then(
        	res => { 
                fn() 
                return res
            },
            err =>{
                fn()
                throw err
            }
        )
    }
}
```