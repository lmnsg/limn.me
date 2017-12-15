layout: post
title: 监测数组变动的两种实现
date: 2017-10-15
categories: 前端
tags: js
cover: covers/cover.jpg
---

> 我们都知道，vue 的数据监听是通过 Object.defineProperty 实现的，在 getter 中收集依赖，在 setter 中触发变更，当我们通过  <!-- more -->
`this.xx = xyz` 的方式对 data 中定义的某个 key 赋值的时候，vue 便能够监测到这个行为，并响应。而对于数组，vue 在文档中明确的声明只能通过提供的一些变异方法来对数组进行更新，不支持 `this.xx[n] = xyz`，也不支持 `this.xx.length = n` 这样的方式修改数组长度。


## 变异方法
vue 提供了一些数组的变异方法：
* push()
* pop()
* shift()
* unshift()
* splice()
* sort()
* reverse()  

这些方法调用对数组产生的更新能够被 vue 监测到。那么这些变异方法是如何实现的呢？我们通过源码了解一下。
```javascript
// src/observer/array.js
import { def } from '../util/index'

const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

/**
 * Intercept mutating methods and emit events
 */
;[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  // def: 通过 Object.defineProperty 定义属性值
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    // observe 新加入的元素
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    return result
  })
})
```
这个文件 export 出了一个 `arrayMethods`，`arrayMethods` 继承了 `Array.prototype`，并在自身定义了那些变异方法来拦截原始数组的那些方法调用，然后通过 `ob.dep.notify()` 触发更新。
```javascript
// src/observer/index.js
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that has this object as root $data

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
        // 检测运行环境是否支持__proto__
      const augment = hasProto
        ? protoAugment
        : copyAugment
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
  // ...隐藏了部分本文无关代码
}

function protoAugment (target, src: Object, keys: any) {
  target.__proto__ = src
}

function copyAugment (target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}
```
Observer 类的主要作用就是为 data 中 `object` 类型的 value 生成一个 `__ob__`, 用来保存订阅 watcher 需要用到的 dep。创建 ob 后，判断 value 是数组的情况下，再检测当前运行环境是否支持 `__proto__` 特性，如果支持，调用 `protoAugment` 将数组的 `__proto__` 赋值为 ArrayMethods, 否则调用 `copyAugment` 在数组上定义那些变异方法。  

### 讲一下 `__proto__`  

首先讲下[[prototype]]，它是 js 中所有对象的内置属性，它指向构造函数的 `prototype` 属性。大多数浏览器支持 `__proto__` 来访问它，且该属性和 `constructor` 属性一样都是可写的。像我们平常面试时候讲的那啥原型链其实就是这个 `__proto__` 的表现，当我们访问对象上的一个属性的时候，假如对象自身不存在这个属性，则会延续到它的 `__proto__` 上去找，找不到就继续。所以上面 protoAugment 中只需要 `target.__proto__ = src` 把数组的 `__proto__` 指向 vue 自己的 ArrayMethods 就实现了拦截部分属性并继承原始 Array 的其他原型方法。十分巧妙。

## 对数组某个元素的更新
对于 `this.xx[n] = xyz` 这种方式的赋值，vue 提供了 Vue.set 以及 this.$set 的方式，其实内部实现就是调用了变异方法的 splice 方法。那么真的没有办法直接监测直接赋值吗？

// 是的没有。END

答案是：`Proxy`

## Proxy 实现数据绑定

`Proxy` 是 es6 新增的一大特性，顾名思义用以实现拦截代理对象的默认行为。 `Object.defineProperty` 赋予了我们修改对象的 getter, setter 等方法的能力，Proxy 进一步给了更多可操作的选项（支持13种拦截）。
看个简单的例子:
```html
<ul></ul>
<input type="text">
<button id="add">Add</button>
```
```javascript
const $ul = document.querySelector('ul')
const $add = document.querySelector('#add')
const $input = document.querySelector('input')

const todos = new Proxy([], {
  set (target, prop, value, receiver) {
    target[prop] = value
    render()
    return true
  }
})

function render () {
  $ul.innerHTML = todos.map((todo) => {
    return `<li>
            ${todo}
            <button class="del">x</button>
            <button class="edit">i</button>
            </li>`
  }).join('')
}

$add.addEventListener('click', () => {
  todos.push($input.value)
}, false)

$ul.addEventListener('click', (e) => {
  const el = e.target
  const li = el.parentElement
  const idx = Array.from($ul.children).indexOf(li)
  if (el.classList.contains('del')) {
    todos.splice(idx, 1)
  } else if (el.classList.contains('edit')) {
    todos[idx] = 'I am edited'
  }
}, false)
```
这是个简单的 todo list 的实现，你可以在 [jsfiddle](https://jsfiddle.net/gd5yn7s1/) 上进行体验。  
点击 add 按钮会向 todos 中 push 当前的 input 的 value，点击 li 中的 x 则会删除当前 li 在 todos 中的值，点击 i 则会修改当前 li 的 text。而这些功能都只需要简单的通过 `Proxy` 代理数组的 `set` 行为来实现。 你可以通过断点调试去了解执行数组的 splice 或者 push 方法时 `Proxy` 都做了什么，很有趣。
so，使用 Proxy 我们可以实现对数据的默认行为的拦截代理，也就是说我们能够监听到数据的任何变动，也就无需再去使用变异方法了。

Vue 3.0 据说也将使用 Proxy 来重构目前的数据绑定实现，由于 Proxy 目前的浏览器支持仅限于现代浏览器，所以 Vue 3.0 也将只支持现代浏览器咯，很激进啊。👻

## End
那么两种监测数组变动的方法都讲完了，继续搬砖去了🐶🐶
