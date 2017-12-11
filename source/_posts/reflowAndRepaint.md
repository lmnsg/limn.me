layout: post
title: 浏览器 reflow 与 repaint
date: 2016-05-09
categories: 前端
---
最近开发项目的时候遇到一个问题，一个元素，默认在隐藏状态，通过触发一个事件时希望它显示出来，并有个动画。遇到了点问题，元素总是直接显示为动画结束的样子。无意中在看 Bootstrap 的一个插件的源码的时候看到它是这么解决的这个问题。  

> 关键代码：  
>  `$next[0].offsetWidth // force reflow`

<!-- more -->

上面是 Bootstrap 在carousel插件中的一句代码，它完美的解决了一个元素从 `display: none` 切换到显示状态并动画的问题。我写了个简单的 demo，移步 [JsFiddle](https://jsfiddle.net/2o7dnep2/)。   
为了看到对比，请尝试注释 js 中的下面这句代码：   
```js
$('.test')[0].offsetWidth	// 强制浏览器reflow
```
## 何为 reflow 和 repaint
> 欲了解这行代码的神奇之处，需要先了解两个名词：reflow，repaint。  

reflow 重排（回流）我比较倾向于叫重排   
repaint 重绘  

浏览器加载网页先根据 Html 生成 DOM 树，再根据 css 为 Dom 设置的样式中的如 width、height、margin、padding 等来计算出每个 DOM 节点的位置来渲染页面。  
这个过程是流式的，所以一般浏览器只需要计算一次就可以完成。但 table 元素以及其内部的元素除外，它们需要经历多次计算，将花费3倍于其他元素的时间。 
 
当初次渲染结束之后，我们在通过 JS 对 Dom 节点进行修改，如上面 demo 中通过添加一个 class 来修改 width 时，浏览器就会重新计算这个元素的大小以及其相对于前后元素的位置，根据需要进行重排，此行为即为 reflow。假如我们只是修改了元素的背景颜色这样的不影响其大小以及相对位置的样式，浏览器则只会进行重新对此元素进行重新渲染并不会重新计算，也即是 repaint。  

下面是一些常见的修改后会触发 reflow 的 css 属性: `width、height、border、margin、padding、font-size、line-height、flot、position、display...` 

## 这些跟问题有啥关系呢？

喏，我们之所以会遇到上面讲到的问题，是因为浏览器太先进了。  
> 浏览器: 怪我咯？

对于 reflow 和 repaint，不同的浏览器有不同的处理方式，不过大同小异，都遵循了一些规则。比如在上面 domo 中我们修改了元素的 display 和 width：
```js
$('.test').show()
$('.test').addClass('animation')
```
```css
&.animation{
     width: 400px;
   }
```
浏览器不会傻傻的每个操作都进行一次 reflow 和 repaint，因为每次重新计算都会消耗很大的性能。一般来说，浏览器会把这样的操作积攒一批，然后做一次终极reflow，至于什么时候做，那就看浏览器如何判断了。  

相信看到这里就应该明白上面问题的原因了。那么问题来了，如何不让浏览器自己动而是我们扶着她动呢？继续看。

浏览器在有些情况下会无视上面的机制直接 reflow，如：resize窗口，改变页面默认的字体等操作。  
下面这些 js 操作同样：
* 获取 offsetTop, offsetLeft, offsetWidth, offsetHeight
* 获取 scrollTop/Left/Width/Height
* 获取 clientTop/Left/Width/Height
* IE中的 getComputedStyle(), 或 currentStyle

因为，我们在获取这些值时，浏览器必须实时返回这些属性最新的值，这样浏览器就必须进行 reflow 来强行重新计算。  
`$('.test')[0].offsetWidth`这句代码的作用就显而易见了。

### reflow 的几个原因

* Initial。网页初始化的时候。
* Incremental。一些Javascript在操作DOM Tree时。
* Resize。其些元件的尺寸变了。
* StyleChange。如果CSS的属性发生变化了。
* Dirty。几个Incremental的reflow发生在同一个frame的子树上。

### 减少 reflow/repaint
上面已经说过，浏览器在进行 reflow/repaint 时十分耗费性能，尤其在低版本浏览器上更是惨不忍睹。在现代浏览器上，以及高性能的电脑上还好，但在一些手机设备上，这个过程就尤其令人头疼了，君不见一些低版本安卓手机浏览器上随便滑动一下都卡的要死。  
So，话说了那么多，简单说下如何减少 reflow/repaint:
* 合并操作，将多个操作如样式的修改尽量放在一起做，利用浏览器的聪明机智只进行一次终极 reflow
* 缓存元素的 offsetWidth 等值
* 后台修改 Dom，如先隐藏掉，修完再显示，或者先 clone 一个副本，对副本修改完后再替换显示的那个
* 尽量不要使用 table 布局 （当然，需要显示数据的时候，还是得要用 table

