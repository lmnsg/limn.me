layout: post
title: 命令行相关操作笔记
date: 2017-11-24
categories: 笔记
tags: 
 - aa 
 - bb

---

## linux
````bash
# 修改主机名:
hostnamectl set-hostname xiaolizi

# 修改默认 shell, 第三方 shell 需要先加入 /etc/shells
chsh -s /usr/local/bin/zsh

# copy ssh 公钥到服务器
ssh-copy-id user@server
````

## git
````bash
# 代理
git config --global http.proxy 'socks5://127.0.0.1:1080'
git config --global https.proxy 'socks5://127.0.0.1:1080'
````
