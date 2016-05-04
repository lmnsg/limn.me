layout: post
title: 如何禁止chrome的表单自动填充
date: 2016-1-31
categories: 前端
---

> Chrome以及Ie，Firefox等浏览器大多都提供了表单记住密码然后下次再登陆时自动填充这么一个功能，这大大方便了用户，比如我这种懒人经常记不住密码，不用每次都去密码本上去翻密码了，但是，在某些场景我们恰恰希望chrome不要那么主动，毕竟自己动的乐趣还是蛮大的...

<!-- more -->

前一段时间，项目上有个恰好有个登录页面，页面上呢有两个登录框框，给两种角色的人使用，页面通过hash来切换要显示哪个登录框框，比如普通用户是#i,另一种用户是#o,每种用户的账号格式不太一样，一个是手机号码，另一个比较风骚，只让用email。Chrome非常给力，能够同时记住两种用户的账号密码准确填充，十分好用。
但是，当你只记住一种用户的账号，比如手机号那种，假如你通过url进入另一种用户的登录界面，chrome就有点手足无措了，它仍然将不属于这个用户格式的手机号直接填充到登录框里。于是我们的产品汪就说辣：‘这，用户会不会以为我们是傻逼？’，我很想很抽一巴掌给他，告诉他这是Chrome的锅，但是，想想我还要吃饭穿衣攒钱买老婆忍住了。

### 开始寻找解决办法

尝试给两个form添加name、id等属性，发现chrome才不管你这些，就是往里硬塞。 于是就想，干脆禁用掉chrome的自动保存功能算了。好....那就这么干

### 如何禁用呢？

##### HTML 5 input autocomplete (摘自W3C)
* 定义和用法
autocomplete 属性规定输入字段是否应该启用自动完成功能。
自动完成允许浏览器预测对字段的输入。当用户在字段开始键入时，浏览器基于之前键入过的值，应该显示出在字段中填写的选项。
* 注释：autocomplete 属性适用于 form，以及下面的 input 类型：text, search, url, telephone, email, password, datepickers, range 以及 color。

````html
<input autocomplete="off">
````

呵呵呵呵，毕竟图样，现代浏览器大多都会直接忽略掉队用户名密码的 autocomplete="off" ，这些个磨人的小妖精

### 终结：前置一个空的密码输入框
google了下，终于找到了一个简单粗暴的解决办法。那就是在密码input前置一个隐藏的type="password"的输入框。
比如这样：
```html
<form>
    <input type="password" style="display:none">
    <input type="password" name="b">
    <button>Sign in</button>
</form>
```

![完美](/uploads/完美.jpg)
