# 常见知识点理解

## 1、上下文 vs 作用域

（1）首先需要说明的是**上下文和作用域是不同的概念**。

（2）每个函数调用都有与之相关的`作用域`和`上下文`。从根本上说，作用域是基于**函数**，而上下文是基于**对象**。

（3）作用域是和每次**函数调用时变量的访问有关**，并且**每次调用都是独立的**。上下文总是关键字 **this 的值**，是调用当前可执行代码的对象的引用。

（4）当函数执行时，会创建一个称为`执行上下文`的内部对象（**可理解为作用域，不是前面讨论的上下文**）。一个`执行上下文`定义了一个**函数执行时的环境**。

## 2、undefined和null有什么区别？

`undefined`是未指定特定值的变量的默认值，或者没有显式返回值的函数，如：`console.log(1)`，还包括对象中不存在的属性，这些 JS 引擎都会为其分配 `undefined` 值。

```js
let _thisIsUndefined;
const doNothing = () => {};
const someObj = {  a : "ay",  b : "bee",  c : "si"};
console.log(_thisIsUndefined); // undefined
console.log(doNothing()); // undefined
console.log(someObj["d"]); // undefined
```

`null`是**“不代表任何值的值”**。 `null`是已明确定义给变量的值。

## 3、==与===的区别

`===` 严格相等，会比较两个值的**类型**和**值**

`==` 抽象相等，比较时，会先进行**类型转换**，然后再比较**值**

```js
例子：`==`  会有隐式转换类型规则，
1.NaN
NaN和其他任何类型比较永远返回false(包括和他自己)。

2.Boolean
Boolean和其他任何类型比较，Boolean首先被转换为Number类型。

3.String和Number
String和Number比较，先将String转换为Number类型。
'123' == 123

4.null和undefined
null == undefined比较结果是true，除此之外，null、undefined和其他任何结果的比较值都为false。

5.原始类型和引用类型
当原始类型和引用类型做比较时，对象类型会依照ToPrimitive规则转换为原始类型:

一道经典的面试题，如何让：a == 1 && a == 2 && a == 3。
根据拆箱转换，以及==的隐式转换，我们可以轻松写出答案：
const a = {
    value:[3,2,1],
    valueOf: function () {return this.value.pop(); },
} 
```

## 4、箭头函数与function区别

箭头函数是普通函数的简写，可以更优雅的定义一个函数，和普通函数相比，有以下几点差异：

- 函数体内的 `this 对象`，它会从自己的作用域链的上一层继承` this`（因此无法使用 apply / call / bind 进行绑定 this 值）。也就是**函数执行位置的上下文this**

- 不可以使用 `arguments` 对象，该对象在函数体内不存在。如果要用，可以用 `rest 参数`代替。

- 不可以使用` yield` 命令，因此箭头函数不能用作`Generator `函数。

- 相当于匿名函数，是不能作为构造函数的，不可以使用 `new `命令，因为：

  - 没有自己的` this`，无法调用 call，apply。

  - 没有` prototype` 属性 ，而 `new 命令`在执行时需要将构造函数的 `prototype `赋值给新的对象的 `__proto__`

  ```js
  // new 过程大致是这样的：
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

## 5、面向对象

### 原型链

原型链的概念，即每个对象拥有一个原型对象，通过 `__proto__` 指针指向上一个原型 ，并从中**继承方法和属性**，同时原型对象也可能拥有原型，这样一层一层，最终指向 `null`，这种关系被称为**原型链**(prototype chain)。

- 当一个对象A作为原型时，它有一个constructor属性指向它的构造函数，即`A.constructor`

- 当一个对象B作为构造函数时，它有一个prototype属性指向它的原型，即`B.prototype`

- 当一个对象C作为实例时，它有一个`__proto__`属性指向它的原型，即`C.__proto__`

- 当想要判断一个**对象`foo`**是否是**构造函数`Foo`**的实例时，可以使用`instanceof`关键字，返回一个boolean值

```js
 var add = new Add('a', 'b', 'return a + b');
// add 是一个实例，对应的构造函数是 Add 原型是 Add.prototype

console.log(add.__proto__ === Add.prototype); // true

// 注意 Add同时是Add.prototype的构造函数与实例
console.log(Add.prototype.constructor === Add); // true
console.log(Add.__proto__ === Add.prototype); // true  
```

```js
Object.__proto__ === Function.prototype;  // true
Function.prototype.__proto__ === Object.prototype; // true
Object.prototype.__proto__ === null;  // true
```

### 继承

最基本的继承被分为**构造函数的继承**与**原型的继承**两种。

- 原型链与构造函数 -> 组合式继承

+ 原型链改进 -> 原型式

- 原型式封装增强 -> 寄生式

- 寄生式与构造函数 -> 寄生组合式继承

#### 原型链继承

考虑一点：如何将子类对象的原型加到原型链中？

答：**让子类对象的原型成为父类对象的一个实例**，然后通过`__proto__`访问父类对象的原型`subType.prototype = new SuperType() `

等价于->

`subType.prototype.__proto__ = SuperType.prototype`

```js
function SuperType(){
     this.colors = ['red','blue','green']
}
SuperType.prototype.getSuperValue = function(){
    return this.colors
}


function SubType(){}

// 原型链继承了SuperType
SubType.prototype = new SuperType();

var instance1 = new SubType();
instance1.colors.push("black");
instance1.colors //['red','blue','green','black']

var instance2 = new SubType();
instance2.colors //['red','blue','green','black']
```

> 注意：给原型添加方法的语句一定要放在原型替换`SubType.prototype = new SuperType()`之后

优点：能通过`instanceO`f和`isPrototypeOf`的检测

缺点：(1)`SuperType`中的属性(不是方法)也变成了`SubType的prototype`中的公用属性，
     		如上面例子中的color属性，可以同时被`instance1和instance2`修改
    	 	(2)创建子类型的时候，不能像父类型的构造函数中传递参数。

#### 构造函数继承

```js
function SuperType(){
    this.colors = ['red','blue','green']
}
function SubType(){
    // 构造函数继承
	Super.call(this)
}

var subInstance1 = new SubType()
subInstance.colors.push('black')
console.log(subInstance.colors) // ['red','blue','green','black']

var subInstance2 = new SubType()
subInstance2.colors.push('black')
console.log(subInstance2.colors) // ['red','blue','green']
```

原理：在子类型构造函数的内部调用超类型构造函数
优点：解决了`superType`中的私有属性变公有的问题，可以传递参数
缺点：方法在函数中定义，无法得到复用

#### 组合继承

```js
function SuperType(){
    this.name = name
    this.colors = ['red','blue','green']
}
SuperType.prototype.sayName = function(){
	console.log(this.name)
}

function SubType(name,age){
    // 构造函数->继承属性
    SuperType.call(this.name) //借用构造函数继承属性，二次调用
    this.age = age
}

// 原型链->继承方法
SubType.prototype = new SuperType() // 借用原型链继承方法，一次调用
SubType.prototype.constructor = SubType; // 修正constructor属性

SubType.prototype.sayAge = function(){
    console.log(this.age)
}

var instance = new SubType("Nicholas",29)
instance.colors.push("black");
console.log(instance1.colors)  // "red,blue,green,black"
instance.sayName()  // "Nicholas"
instance.sayAge()  // 29
```

优点：继承前两者的优点，能通过`instanceOf`和`isPrototypeOf`的检测
缺点：两次调用父构造器函数，浪费内存。

#### 原型式继承

有点像原型链继承的变形，实际上多了一层中间层

```js
function object(o){
    function F(){}
    F.prototype = o
    return new F()
}

var person = {
    name:"linwei",
    friends:["abing","zihui","jiawei","chenfeng"]
}

var anotherPerson = object(person);  
anotherPerson.name = "linwe2"
anotherPerson.friends.push("Rob");
anotherPerson.name  // "linwei2"

var yetAnotherPerson = object(person); 
yetAnotherPerson.name = "linwei3"
yetAnotherPerson.friends.push("Barbie") 

yetAnotherPerson.friends
yetAnotherPerson.name; // "linwei3"

person.name // "linwei"
person.friends  // ["abing,zihui,jiawei,chenfeng,Rob,Barbie"]
```

使用场合：没必要构建构造函数，仅仅是想模拟一个对象的时候

#### 寄生继承

封装继承过程的函数，实际上对原型式继承的增强

```js
function createAnother(original){
    var clone = object(original);  // 原型式继承调用
    clone.sayHi = function(){   // 增强对象
        console.log('hi')
    }
    return clone
}
var person = {
    name:"linwei",
    friends:["abing","zihui","jiawei","chenfeng"]
}
var anotherPerson = createAnother(person);
anotherPerson.sayHi()  // 'hi'
```

缺点与构造函数类似： 不能做到函数复用

#### 寄生组合继承（`ES5`）

```js
// 第一种写法，便于理解

function object(o){
    function F(){}
    F.prototype = o
    return new F()
}
function create(subType,superType){
    // 原型式继承
    let proto = object(superType.prototype)
    // 寄生式继承，增强原型对象
    proto.constructor = subType
    subType.prototype = proto 
}
 
function SuperType(){
    this.colors = ['red','blue','green']
}
SuperType.prototype.getColors = function(){
    console.log(this.colors)
}

function SubType(name){
    // 构造函数继承
    SuperType.call(this)
    this.name = name
}

create(SubType,SuperType)
// 给子类原型添加方法的语句 一定要放在原型替换之后
SubType.prototype.getName = function(){
    console.log(this.name)
}

let subInstance = new SubType('linwei')
subInstance.getName()  // 'linwei'
subInstance.getColors() // ['red','blue','green']
```

```js
// 第二种写法，模拟 ES5 Object.create
function create(proto,options){
    // 创建空对象，类似 new F()
    var tmp = {}
    // 让空对象的__proto__指向父类的prototype（让空对象成为父类对象的实例）
    tmp.__proto__ = proto
    // 传入的方法都挂载都新对象上，包括增强对象的方法，修补constructor
    Object.defineProperties(tmp,options)
    // 返回对象，作为子类对象的原型
    return tmp
}

function SuperType(){
    this.colors = ['red','blue','green']
}
SuperType.prototype.getColors = function(){
    console.log(this.colors)
}

function SubType(name){
    // 构造函数继承
    SuperType.call(this)
    this.name = name
}

SubType.prototype = create(SuperType.prototype,{
    // 不要忘了重新指定构造函数
    constructor:{
        value:SubType
    },
    // 添加子类方法
    getName:{
        value:function(){
            console.log(this.name)
        }
    }
})

let subInstance = new SubType('linwei')
subInstance.getName()  // 'linwei'
subInstance.getColors() // ['red','blue','green']
```

```js
// 第三种，用 ES5 自带的 Object.create()
// 注：Object.create() 并不会默认自动修正constructor，需要传入 options: { constructor }

function SuperType(){
    this.colors = ['red','blue','green']
}
SuperType.prototype.getColors = function(){
    console.log(this.colors)
}

function SubType(name){
    SuperType.call(this)
    this.name = name
}

SubType.prototype = Object.create(SuperType.prototype,{
    constructor:{
        value:SubType
    },
    getName:{
        value:function(){
            console.log(this.name)
        }
    }
})

let subInstance = new SubType('linwei')
subInstance.getName()  // 'linwei'
subInstance.getColors() // ['red','blue','green']
```

#### `ES6`继承

```js
class SuperType{
    constructor(){
        // 构造函数
        this.colors = ['red','blue','green']
    }
    // 原型方法，这种写法表示将方法添加到原型中
    getColors(){
        console.log(this.colors)
    }
    // 静态属性、方法，等同于 SuperType.a = 20
    static a = 20
	
	// 构造函数中添加，相当于 this.c = 20 
	c = 20

	// 构造函数中添加，相当于 this.age = () => this.age
	getAge = () => this.age
	// getAge = function () {}

}

class SubType extends SuperType{
    constructor(name){
        super()
        this.name = name
    }
    getName(){
        console.log(this.name)
    }
}

let subInstance = new SubType('linwei')
subInstance.getName()	// 'linwei'
subInstance.getColors() // ['red','blue','green']
```

## 6、数组去重

### 双层for循环

```js
function distinct(arr) {
    for (let i = 0, len = arr.length; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
            if (arr[i] == arr[j]) {
                arr.splice(j, 1);
                // splice 会改变数组长度，所以要将数组长度 len 和下标 j 减一
                len--;
                j--;
            }
        }
    }
    return arr;
}
```

### `Array.filter()`加`indexOf`

> 思想: 利用`indexOf`检测元素在数组中第一次出现的位置是否和元素现在的位置相等，如果不等则说明该元素是重复元素

```js
function distince(arr){
    return arr.filter((item,index)=>{
        return arr.indexOf(item) === index
    })
}
```

### `ES6` 中的 Set 去重

```js
function distinct(array){
    return Array.from(new Set(array));
    // Array.from()方法就是将一个类数组对象或者可遍历对象转换成一个真正的数组。
}
```

用`...`扩展运算符改写：

```js
function distinct(array){
    return [...new Set(array)] // new Set返回一个类数组
}
```

用`ES6`箭头函数进一步改写：

```js
let distince = (array) => [...new Set(a)]
```

## 7、谈谈闭包

> 闭包（closure）指 有权访问另一函数作用域中变量的 函数 —— JavaScript高级程序设计

闭包就是**在函数里面声明函数**，在**函数内部**和**函数外部搭**建起一座**桥梁**（从**函数内部**将**函数返回**给**函数外部**），使得**子函数**可以**访问父函数**中所有的**局部变量**（能**访问父函数作用域**）。

- 作用：可以私有化变量，保护变量不受外界污染。

- 缺点：造成内存泄露。
  造成**内存泄露**：死循环、定时器、全局变量

tip：闭包不会造成作用域链的改变。  ——JavaScript核心技术开发解密

## 8、`ES6`的新特性

`let`、`const` 不会挂载到window上

### `let`

- 定义**块级作用域**变量
- 没有变量的提升，必须先声明后使用 
- 不能与前面的`let`，`var`，`conset`声明的变量重名

### `const`

- 定义变量也是一个**块级作用域**变量

- 没有变量的提升，必须先声明后使用

- 不能与前面的`let`，`var`，`conset`声明的变量重名

- 定义只读变量

- 声明变量的同时必须赋值，声明的变量必须**初始化**，一旦初始化完毕就不允许修改

  > 注：不允许修改指的是值的修改，若为引用类型，则只要地址不变就可以
  >
  > 如：定义的对象\数组中的属性值可以修改,基础数据类型不可以

### `let`、`const` 和`var`三者都会存在变量提升

- `let` 的「创建」过程被提升了，但是 [初始化] 没有提升，所以会产生暂时性死区（执行 log 时 x 还没「初始化」，所以不能使用（也就是所谓的暂时死区）)

- `var` 的「创建」和「初始化」都被提升了，所以在赋值前访问会得到undefined

- `function` 的「创建」「初始化」和「赋值」都被提升了。

### 扩展运算符和rest运算符（...）

> 扩展运算符（ spread ）是三个点（...）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列。

- 函数传参（替代数组的 apply 方法）

  由于**扩展运算符**可以展开数组，所以不再需要apply方法，将数组转为函数的参数了。

  ```js
  // ES5 的写法  
  function f(x, y, z) {  
  	// ...  
  }  
  var args = [0, 1, 2];  
  f.apply(null, args);  
  
  // ES6 的写法  
  function f(x, y, z) {  
  	// ...  
  }  
  var args = [0, 1, 2];  
  f(...args);  
  ```

- 函数接收参数

  ```js
  function f(...args){
      console.log(args)  // [1,2,3,4]
  }
  
  f(1,2,3,4)
  ```

- 合并数组

  ```js
  // ES5 的合并数组  
  [1, 2].concat(more)  
  arr1.concat(arr2, arr3);  
  
  // ES6 的合并数组  
  [1, 2, ...more]
  [...arr1, ...arr2, ...arr3]  
  ```

- 结合解构赋值

  如果将扩展运算符用于数组赋值，只能放在参数的最后一位，否则会报错。

  ```js
  const [first, ...rest] = [1, 2, 3, 4, 5];  
  first // 1  
  rest // [2, 3, 4, 5]  
  
  const [first, ...rest] = [];  
  first // undefined  
  rest // []
  
  const [first, ...rest] = ["foo"];  
  first // "foo"  
  rest // []  
  
  const [...butLast, last] = [1, 2, 3, 4, 5];  
  //  报错  
  const [first, ...middle, last] = [1, 2, 3, 4, 5];  
  //  报错  
  ```

- 字符串

  扩展运算符还可以将字符串转为真正的数组。

  ```js
  [...'hello']  
  // [ "h", "e", "l", "l", "o" ]  
  ```

- 实现了 Iterator 接口的对象

  扩展运算符内部调用的是数据结构的 Iterator 接口，因此只要具有 Iterator 接口的对象，都可以使用扩展运算符**转为真正的数组**，比如 Map 和 Set 结构， Generator 函数

  ```js
  var nodeList = document.querySelectorAll('div');  
  var array = [...nodeList];  
  // 上面代码中，querySelectorAll方法返回的是一个nodeList对象。它不是数组，而是一个类似数组的对象。
  
  function distinct(array){
      //ES6
      return [...new Set(array)] // new Set返回一个类数组
  }
  
  // ES5
  Array.prototype.slice(arguments) 
  ```

### 数组与对象的解构赋值

### 箭头函数

### 遍历数组的新方法

`array.map()`、`array.filter()`、`array.forEach()`

## 9、`ES6`遍历数组的方法区别

`map`和`forEach`的区别

**相同点：**

- 都是循环遍历数组中的每一项

+ `forEach`和`map`方法里每次执行匿名函数都支持3个参数，参数分别是item（当前每一项）、index（索引值）、arr（原数组），需要用哪个的时候就写哪个

- 匿名函数中的this都是指向window

- 只能遍历数组

**不同点：**

- `map()`方法**返回一个新的数组**，数组中的元素为**原始数组调用函数处理后的值**。(原数组进行处理之后对应的一个新的数组)

- `map()`方法不会改变原始数组

- `map()`方法不会对空数组进行检测

- `forEach()`方法用于调用数组的每个元素，将元素传给回调函数。(没有return，返回值是undefined）

> 注意：`forEach`对于空数组是不会调用回调函数的。

## 10、用reduce实现Promise串行执行

在 `async/await` 以前 Promise 串行执行还是比较麻烦的

```js
function runPromiseByQueue(promiseArray){
    let firstPromise = promiseArray.shift();
	promiseArray.reduce(
        (previousPromise,nextPromise) => previousPromise.then(
            () => nextPromise()
        ),
        firstPromise() // 先调用数组中第一个函数，返回一个Promise，就可以.then了
    )
}
// 或
function runPromiseByQueue(promiseArray){
    promiseArray.reduce(
    	(previousPromise,nextPromise) => previousPromise.then(
        	() => nextPromise()
        ),
        Promise.resolve() // 第一个值就是一个决议的Promise，可以.then
    )
}
```

当上一个 Promise 开始执行（`previousPromise.then`），当其执行完毕后再调用下一个 Promise，并作为一个新 Promise 返回，下次迭代就会继续这个循环。

```js
const createPromise = (time, id) => () =>
  new Promise(solve =>
    setTimeout(() => {
      console.log("promise", id);
      solve();
    }, time)
  );

runPromiseByQueue([
  createPromise(3000, 1),
  createPromise(2000, 2),
  createPromise(1000, 3)
]);

// 结果：
promise 1 // 等待3秒
promise 2 // 等待上一个输出后2秒
promise 3 // 等待上一个输出后1秒
```

在 `async/await` 的支持下，`runPromiseByQueue` 函数可以更为简化：

```js
async function runPromiseByQueue(promiseArray){
    for(let fun of promiseArray){
        await fun();
    }
}
```

## 11、[浏览器JavaScript的`EventLoop`](https://juejin.im/post/5b97d2b55188255c781ca228)

我们要记住最重要的两点：`JavaScript`是单线程和`eventloop`的循环机制。

我们常常吧`EventLoop`中分为 内存、执行栈、`WebApi`、异步回调队列(包括微任务队列和宏任务队列)

![](https://user-gold-cdn.xitu.io/2018/9/11/165c910691ef28b9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 任务分类

宏任务(`macrotask`)

- `setTimeOut` 、 `setInterval` 、`postMessage`、 `setImmediate` 、 `I/O` 、 各种`callback`、`UI渲染等`
- 优先级： `主代码块script(整体代码)` > `setImmediate(Node.js 环境)` > `MessageChannel` > `setTimeOut`/`setInterval`

微任务(`microtask`)

- `process.nextTick(Node.js 环境)` 、`Promise`  、`MutationObserver` 、`async(实质上也是promise)`
- 优先级： `process.nextTick` > `Promise.then` > `MutationOberser`

### 执行栈

- 执行栈是宏任务被执行的地方

### 宏任务 & 宏任务队列

- 宏任务总会在下一个`EventLoop`中执行
- 若在执行宏任务的过程中，加入了新的`微任务`，会把新的微任务添加到微任务的队列中。

### 微任务 &  微任务队列

- 若在执行微任务的过程中，加入了新的微任务，会把新的微任务添加在当前微任务队列的队尾巴。
- 微任务会在本轮`EventLoop`执行完后，马上把执行栈中的任务都执行完毕。

### 执行流程

 ① `Javascript`内核加载代码到`执行栈`
 ② `执行栈`依次执行主线程的`同步任务`，过程中若遇调用了异步Api则会添加回调事件到`回调队列`中。且`微任务`事件添加到微任务队列中，`宏任务`事件添加到宏任务队列中去。直到当前`执行栈`中代码执行完毕。
 ③ 开始执行当前所有`微任务队列`中的微任务回调事件。    (:smirk:注意是所有哦，相当于清空队列)
 ④ 取出`宏任务队列`中的第一条(先进先出原则哦)宏任务，放到`执行栈`中执行。
 ⑤  执行当前`执行栈`中的宏任务，若此过程总又再遇到`微任务`或者`宏任务`，继续把`微任务`和`宏任务`进行各自队伍的`入队`操作，然后本轮的`宏任务`执行完后，又把本轮产生的`微任务`一次性出队都执行了。
 ⑥ 以上操作往复循环...就是我们平时说的`eventLoop`了

### 其他相关

#### Promise.then链式调用

```js
new Promise((resolve,reject)=>{
    console.log("promise1")
    resolve()
}).then(()=>{
    console.log("then11")
    new Promise((resolve,reject)=>{
        console.log("promise2")
        resolve()
    }).then(()=>{
        console.log("then21")
    }).then(()=>{
        console.log("then23")
    })
}).then(()=>{
    console.log("then12")
})

// 结果：
promise1
then11
promise2
then21
then12  // 为什么then21在then12前，而then12在then23前，因为在promise2执行完后代表then11也执行完，所以会在微任务队列里先添加最近的then21，再添加then12，然后执行完21，就会再添加23，执行12，最后执行23
then23
```

如果说这边的Promise中then返回一个Promise呢？？

```js
new Promise((resolve,reject)=>{
    console.log("promise1")
    resolve()
}).then(()=>{
    console.log("then11")
    return new Promise((resolve,reject)=>{
        console.log("promise2")
        resolve()
    }).then(()=>{
        console.log("then21")
    }).then(()=>{
        console.log("then23")
    })
}).then(()=>{
    console.log("then12")
})

// 结果：
promise1
then11
promise2
then21
then23
then12   // then12必须等return的Promise决议后才能执行回调函数，所以必须等最后一个promise then23决议后，才能执行then12回调
```

如果说这边不止一个Promise呢，再加一个new Promise是否会影响结果？？

```js
new Promise((resolve,reject)=>{
    console.log("promise1")
    resolve()
}).then(()=>{
    console.log("then11")
    new Promise((resolve,reject)=>{
        console.log("promise2")
        resolve()
    }).then(()=>{
        console.log("then21")
    }).then(()=>{
        console.log("then23")
    })
}).then(()=>{
    console.log("then12")
})
new Promise((resolve,reject)=>{
    console.log("promise3")
    resolve()
}).then(()=>{
    console.log("then31")
})

// 结果
promise1
promise3
then11
promise2
then31
then21
then12
then23
```



#### async-await

其实，async-await 只是 Promise+generator 的一种语法糖而已。

```js
function A() {
    return Promise.resolve(Date.now());
}
async function B() {
    console.log(Math.random());
    let now = await A();
    console.log(now);
}
console.log(1);
B();
console.log(2);

// 结果：
1
Math.rendom()
2
Date.noew()
```

上面的代码我们改写为这样，可以更加清晰一点：

```js
function B() {
    console.log(Math.random());
    A().then(function(now) {
        console.log(now);
    })
}
console.log(1);
B();
console.log(2);
```

练习：

```js
async function async1() {
    console.log("async1 start");
    await  async2();
    console.log("async1 end");
}

async  function async2() {
    console.log( 'async2');
}

console.log("script start");

setTimeout(function () {
    console.log("settimeout");
},0);

async1();

new Promise(function (resolve) {
    console.log("promise1");
    resolve();
}).then(function () {
    console.log("promise2");
});
console.log('script end'); 

// 结果
script start
async1 start
async2
promise1
script end
async1 end
promise2
settimeout
```



#### setTimeout

Q: 我的`setTimeout`函数到时间了，为啥一直不去执行。

A: `setTimeOut`的回调会被放到任务队列中，需要当前的执行栈执行完了，才会去执行执行任务队列中的内容。出现`setTimeout`回调不及时，说明在执行栈中出现了阻塞，或者说执行代码过多。

#### nextTick

常见的`vue.$nextTick`会把事件直接插入到当前`微任务`队列的中，感兴趣的请看笔记《vue_nextTick与eventLoop》  [传送门-->](https://github.com/HXWfromDJTU/blog/blob/master/vue/nextTick.md) 和 《vue_DOM更新与nextTick》[传送门-->](https://github.com/HXWfromDJTU/blog/blob/master/vue/vue_dom_nextTick.md)

