#WebdriverNode 

Selenium的nodejs实现

##install

`npm install webdriverNode`

##使用

具体用法可以参考 [https://github.com/Camme/webdriverjs](https://github.com/Camme/webdriverjs)

##相对webdriverjs的更新

* 独立出了异步方法顺序执行的模块[SyncRun](https://github.com/neekey/syncRun)，提供更加自由和强大的顺序执行。
* 添加了`log`方法，用于让用户自定义输出（本身是一个用于和异步方法一起顺序执行的方法）
* 记录每个顺序执行的操作过程和结果，并在`end`方法的回调中作为第一个参数返回（所有的信息，包括用户自定义log）
* 强调一下，`webdriverNode`和`webdriverjs`在实际使用中没有区别。`webdriverjs`的`examples`可以直接用`webdriverNode`来运行