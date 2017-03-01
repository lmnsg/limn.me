layout: post
title: js银行卡号每隔4位插入空格
date: 2017-03-01
tags: javascript
---

> 之前项目中用到的一个功能，在这里贴一下自己的实现方式吧

```html
<input type="text" id="input">
```

```js
rewrite(document.querySelector('#input'), 4)

function rewrite($el, space) {
    let oldValue = ''

    $el.addEventListener('input', () => {
        const val = $el.value
        if (!val.length) return

        const strArray = ('' + val).replace(/ /g, '').split('')
        const len = strArray.length

        for (let i = 1; i <= len; i++) {
            if (i%4 === 0) strArray[i - 1] += ' '
        }
        // 退格
        if (val.length < oldValue.length && len % 4 === 0) strArray[len - 1] = strArray[len - 1].substr(0, 1)

        oldValue = $el.value = strArray.join('')
    }, false)
}
```

只是简单的 input 事件触发后对原 value 做了一次 rewrite, 而且每次输入都会进行，应该不是最佳方案，欢迎大家拍砖。

<!--<script async src="//jsfiddle.net/nvjwau6v/embed/js,html,result/"></script>-->

