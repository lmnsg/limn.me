title: 使用 nth-child 实现循环一组颜色
date: 2017-02-09 13:20:22
categories: 前端
tags: css
---

先说下需求, 需要实现一组 div, 根据一组颜色，按照顺序循环设置背景颜色，大概效果就是:  
<!-- more -->
> // colors: [红, 黄, 蓝, 绿]
<div style="display:inline-block;color: red">红</div>
<div style="display:inline-block;color: yellow">黄</div>
<div style="display:inline-block;color: blue">蓝</div>
<div style="display:inline-block;color: green">绿</div>
<div style="display:inline-block;color: red">红</div>
<div style="display:inline-block;color: yellow">黄</div>

<div style="width: 50%;">
先贴代码:
<script async src="//jsfiddle.net/v1sqnk55/4/embed/html,css,result/"></script>
</div>

## nth-child

CSS 伪类 :nth-child(an+b)匹配在文档树中前面有an+b-1个兄弟元素的元素，此时n大于或等于0，并且该元素具有父元素。  
简而言之，该选择器匹配多个位置满足an+b的子元素。[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:nth-child)

主要需要注意的是 n 是一个大于0的整数, 至于 a 和 b 的取值, 其实就是数学公式。

简单点的话: 
* 有几个颜色, a 就是几
* b 则是想要设置的颜色所处的顺位, 从1开始
