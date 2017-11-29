layout: post
title: 记一次 npm 升级的问题
date: 2017-05-08
tags: node
---

今天想尝试一下我软的 reactXP, 从 github clone 下来后执行 install 后...
<!-- more -->
```bash
npm ERR! peer dep missing: react@~15.4.1, required by react-native@0.42.3
npm ERR! peer dep missing: react@~15.3.1, required by react-native-windows@0.33.4
npm ERR! peer dep missing: react@15.5.3, required by reactxp@0.42.0-rc.1
npm ERR! peer dep missing: react-addons-perf@15.5.0-rc.2, required by reactxp@0.42.0-rc.1
npm ERR! peer dep missing: react-dom@15.5.3, required by reactxp@0.42.0-rc.1
npm ERR! peer dep missing: react-native@~0.33.0, required by react-native-windows@0.33.4
```
google 一番, 有人说是升级 npm 到 ~4.0 可以解决 so 升下试试  
命令行直接打开
```bash
sudo npm i npm -g
```
居然报错...
![error log](/uploads/WechatIMG204.jpeg)
再次 google 后无果，想到另一法宝 cnpm
```
sudo cnpm i npm -g
```
ok!   
不过升级完还是 run 不了 reactXP, sad!
