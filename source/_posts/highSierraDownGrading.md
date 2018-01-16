layout: post
title: macOS high sierra 降级指南
date: 2018-01-16
categories: mac
---
自从 mac 升级了 high sierra 后，原来的 hdmi 转接头就一直不好使了, 经常性睡死。
换了各种转接头以及 typec-hdmi 线后依然无解，不堪忍受，决定降级到 sierra。
<!-- more -->

### 准备
* 8g+ U盘一枚
* 备份自己的资料
* [macOS sierra](https://itunes.apple.com/cn/app/id1127487414)

### 制作安装 u 盘
插入 u 盘，打开磁盘工具，选中 u 盘后点击抹掉，名称 Sierra， 格式 Mac OS 扩展（日志式），方案 GUID 分区图，点抹掉。

打开终端，输入:
````bash
sudo /Applications/Install\ macOS\ Sierra.app/Contents/Resources/createinstallmedia --volume /Volumes/Sierra --applicationpath /Applications/Install\ macOS\ Sierra.app --nointeraction
````
回车，输入密码，等待安装程序写入到 U 盘中，大概需要等待 20 分钟，终端出现 Done 提示，写入完成。

### 重启安装
确认已经备份过自己的资料后，重启电脑，按住 option 键不放，等界面出现选择启动磁盘，选刚刚写入的 u 盘，名字应该是 install macOS Sierra。
等待读条，进入安装界面后，选择磁盘工具，抹掉原来的系统盘，格式和之前的 U 盘格式一致。然后安装到这个磁盘上就 OK 了。

### apfs 的问题
有可能你上一步安装完成后开机出现禁止符无法进入系统，那是因为从 apfs 有个 apfs container 的概念，抹盘到 guid 的时候抹不干净。
解决起来也很简单，重新开机，选择 u 盘启动盘，进入安装界面，打开实用工具 -> 终端输入：
````bash
diskutil list  disk0
````
找到 TYPE NAME 内 Apple_APFS 打头的盘符，记下图中第二个圈圈里的内容：
![](/uploads/diskinfo.jpg)
终端输入:
````
diskutil apfs deleteContainer disk0s2
````
退出终端，重复上面的抹盘安装即可。

### 降级成功
开机，外接显示器直接点亮，随便睡眠，也不用担心花屏问题，美滋滋。
