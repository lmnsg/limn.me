layout: post
title: webpack 入门引导
date: 2015-12-09 17:38:33
categories: Trans
tags: Trans
---
本文翻译于[webpack-howto](https://github.com/petehunt/webpack-howto)

### 前言

这是一份关于如何使用`webpack`的入门指南,它包含了所有我们在`Instagram`已经使用了的和不使用的内容。
我的建议：把本文作为你开始使用`webpack`的资料,然后可以去关注官方的文档说明。

<!-- more -->

### 基本要求

* 你了解类似于`browserify`,`RequireJs`的工具
* 你理解:
    * 拆分打包
    * 异步加载
    * 静态资源打包(css,images)

### 1.为什么选择`webpack`?

* 它像`browserify`,但它能把你的应用拆分成多个文件。如果你有多个页面在一个单页面应用里,用户只需要下载当前页面的代码。如果他们跳转到其它页面,不需要重新下载公用的代码。
* 它通常用来替换掉`grunt`或者`gulp`,因为它可以完成构建和打包CSS，预处理CSS(less,sass),编译成js和图片等...

    Webpack 支持 AMD 和 CommonJs,以及其他模块系统(Angular,ES6)，如果你不知道用什么，就用CommonJs吧。

### 2.对于`Browserify`用户

这些是等价的:
```bash
browserify main.js > bundle.js
```
```bash
webpack main.js bundle.js
```
然而，`webpack`比`Browserify`更强大，那么，一般你会想要创建一个`webpack.config.js`来让工作更有序了:
```js
// webpack.config.js
module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  }
};
```
只是js，你可以随意放你的代码到这。

### 3.如何调用`webpack`

进入到包含`webpack.config.js`文件的目录，然后在终端里运行:
* `webpack` 以开发模式构建一次
* `webpack` -p 以生产模式构建一次(压缩过的)
* `webpack` --watch 监听新增或修改的并持续以开发模式构建(fast!)
* `webpack` -d (包含 source maps)

### 4.编译js

`webpack` 的类似于 browserify transforms 和 RequireJS 插件的是**loader**. 下面是关于如何指示`webpack`加载
`CoffeeScript` 和 `Facebook JSX+ES6`(你必须要先 *npm install babel-loader coffee-loader*):

```js
// webpack.config.js
module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.coffee$/, loader: 'coffee-loader' },
      { test: /\.js$/, loader: 'babel-loader' }
    ]
  }
};
```
要启用加载文件时不需要文件后缀的功能，你必须添加一个`resolve.extensions`参数告诉`webpack`去索引哪些文件：
```js
// webpack.config.js
module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.coffee$/, loader: 'coffee-loader' },
      { test: /\.js$/, loader: 'babel-loader' }
    ]
  },
  resolve: {
    // you can now require('file') instead of require('file.coffee')
    extensions: ['', '.js', '.json', '.coffee']
  }
};
```

### 5.样式表和图片

首先更新你的代码去使用node的`require()`引用你的静态资源：
```js
require('./bootstrap.css');
require('./myapp.less');

var img = document.createElement('img');
img.src = require('./glyph.png');
```
当你引用 CSS (或 Less...),webpack 内联这个 CSS 作为一个字符块在这个JS包里，而且`require()`会插入一个`<style>`标签到页面里，当你引用图片，webpack 会内联这个图片的URL到这个包里并返回它从`require()`.

不过你需要告诉webpack去这样做(再加上一个Loader):
```js
// webpack.config.js
module.exports = {
  entry: './main.js',
  output: {
    path: './build', // This is where images AND js will go
    publicPath: 'http://mycdn.com/', // This is used to generate URLs to e.g. images
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' }, // use ! to chain loaders
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'} // inline base64 URLs for <=8k images, direct URLs for the rest
    ]
  }
};
```

### 6.特性标记

我们有只想给我们的开发环境或者我们的内部测试服务器用的入口代码(像我们的员工正在测试未发布的功能特性)。在你的代码里，指神奇的全局变量：
```js
if (__DEV__) {
  console.warn('Extra logging');
}
// ...
if (__PRERELEASE__) {
  showSecretFeature();
}
```
然后告诉webpack那些有神奇的的全局变量:
```js
// webpack.config.js

// definePlugin 使用原生的字符串，所以如果你想，你可以更改它们.
var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
});

module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [definePlugin]
};
```
接着你可以在控制台里使用`BUILD_DEV=1 BUILD_PRERELEASE=1 webpack`构建。注意，因为`webpack -p`会消除不必要的代码，所有包裹在其中一块里的代码都会被清除，所以你不用担心会泄漏秘密功能或者字符。

### 7.多个入口

假如你有一个 profile 页面和一个 feed 页面，你不想让用户下载 feed 页面的代码，如果他们只想浏览 profile页面, 那么，多打几个包，就是说每个页面创建一个 "main module"(入口点):
```js
// webpack.config.js
module.exports = {
  entry: {
    Profile: './profile.js',
    Feed: './feed.js'
  },
  output: {
    path: 'build',
    filename: '[name].js' // Template based on keys in entry above
  }
};
```
对于 profile，在你的页面里插入`<script src="build/Profile.js"></script>`, feed 页面同样。

### 8.优化公共代码

Feed 和 Profile 有很多共同的代码，webpack 可以计算出那些是他们共用的然后创建一个共用的包，可以在页面之间缓存：
```js
// webpack.config.js

var webpack = require('webpack');

var commonsPlugin =
  new webpack.optimize.CommonsChunkPlugin('common.js');

module.exports = {
  entry: {
    Profile: './profile.js',
    Feed: './feed.js'
  },
  output: {
    path: 'build',
    filename: '[name].js' // Template based on keys in entry above
  },
  plugins: [commonsPlugin]
};
```
添加`<script src="build/common.js"></script>`在你前面步骤里添加的script标签前,享受免费的高速缓存吧。

### 9.异步加载

`CommonJs` 是同步加载的，但是 `webpack` 提供一种异步的方式去指定依赖。对于前端路由很有用，当你想要在所有的页面上使用前端路由，但是你又不想提前下载未来的代码直到你真的需要用它们的时候。

指定你想要异步加载的分割点. 看这个栗子：

```js
if (window.location.pathname === '/feed') {
  showLoadingState();
  require.ensure([], function() { // this syntax is weird but it works
    hideLoadingState();
    require('./feed').show(); // when this function is called, the module is guaranteed to be synchronously available.
  });
} else if (window.location.pathname === '/profile') {
  showLoadingState();
  require.ensure([], function() {
    hideLoadingState();
    require('./profile').show();
  });
}
```
webpack 会继续打包剩余的并生成额外的块文件并为你加载他们。
举个例子，假如你加载它并插入到一个脚本标签里时，webpack 会假定那些文件在你的root目录里。你可以使用`output.publicPath`去配置它：
```js
// webpack.config.js
output: {
    path: "/home/proj/public/assets", //path to where webpack will build your stuff
    publicPath: "/assets/" //path that will be considered when requiring your files
}
```

### 附加资源

看一个现实世界里的栗子，一个成功的团队是如何利用webpack的。[http://youtu.be/VkTCL6Nqm6Y ](http://youtu.be/VkTCL6Nqm6Y ). 这是 Pete Hunt 在 `OSCon` 上讲的关于webpack在Instagram.com的应用。

### 答疑
**webpack 似乎不像模块化**
webpack 极其的模块化。什么使webpack相比其他的选择比如`browserify`和`requirejs`那么棒呢？是因为它让插件们在构建过程中能够把自己注入到很多的地方。很多东西看似是集成在核心里的，实际上仅仅是默认加载的插件，它们可以被重写。（即 `CommonJs`的`require()`解析器）。