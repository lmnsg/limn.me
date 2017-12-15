layout: post
title: axios 设置 xsrf
date: 2016-12-22
categories: 前端
---

由于项目需要，在客户端生成 xsrf token，在发请求的时候在 header 里发给服务端。
记得 axios 里好像有这方面的 config option，于是研究了一下。
<!-- more -->
使用方式如下:
```js
import axios from 'axios'
// 创建一个修改了默认配置的 axios 实例
const instance = axios.create({
    xsrfCookieName: '_csrf',    // axios 要从 cookie 中取的 cookie 的 key
    xsrfHeaderName: '_csrf'     // axios 将在 header 中设置 xsrf 的 key，value 使用上面 cookie 对应的值
})

// request 拦截器
instance.interceptors.request.use((config) => {
    // 请求发送前，在 cookie 里生成 xsrf token
    document.cookie = `_csrf=${new Date().getTime()}`
    return config
})

export default instance
```

axios 会在请求的时候自动从 cookie 中取出你配置的 xsrfCookieName 的值，然后设置到 requestHeader 中你配置的 xsrfHeaderName 上。

好啦，大功告成，试一试吧！
