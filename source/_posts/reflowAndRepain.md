layout: post
title: 浏览器 reflow 与 repaint
date: 2016-05-09
categories: 前端
---

初次了解到浏览器的 reflow 与 repaint 是在一次面试的时候, 当时一点也不了解这个, 而且蛮紧张, 面试官给我简单介绍了下也没怎么记心上。
最近做项目的时候，遇到一种情况，一个 Dom，默认是隐藏状态，某个情况下希望它显示出来，并且有个 transition 的动画效果，在浏览器中发现无论如何都没有动画效果，
经过一番 google，最终问题指向到了本文的标题，reflow 与 repaint。

<!-- more -->

## 何为 reflow 和 repain
浏览器从下载页面文档 css js 到渲染出界面的过程中，包含了 reflow 和 repaint，每个浏览器对于 reflow 和 repaint 的处理过程略有差异，但都大差不差。  
首先，页面初次加载，浏览器首先解析 Html 生成 DOM 树，每个 DOM 节点都拥有 width height 以及边框和他们的相对偏移量，类似于盒子模型，再然后基于此生成一个用于渲染的结构，此过程完成后，浏览器就可以计算出元素的位置来放置它们，接着根据元素的样式绘制页面。  
由于浏览器的流布局，通常这个计算一次就可以完成，但，table 以及其内部元素除外，通常，它们需要经历多次计算，将花费3倍于其他元素的时间。so,尽量避免使用 table 来布局吧。

reflow 有译为重排，有译为回流，都可以。简单理解就是重新计算渲染结构。  
repaint 大部分译为重绘，顾名思义就是重新绘制。

## 触发 reflow 和 repain
当元素的几何属性(width、height、border、margin、padding...)，字体大小，行高，其相对定位属性(left、top、right、bottom)等等发生了改变，都会触发 reflow。
#### reflow的不同表现
浏览器在 reflow 时会根据触发原因而有不同的表现。


  


