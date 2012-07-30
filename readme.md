#WebdriverNode 

The nodeJS implementation of the selenium2 jsonWireProtocol.

However, webdriverNode is first forked from [webdriverjs](https://github.com/Camme/webdriverjs), But as we use webdriverNode for our own project [F2ETEST](https://github.com/neekey/f2etest), it became very different from the webdriverjs. So we let webdriverNode become an independent project.

Thanks webdriverjs and its author @Camme!

##install

`npm install webdriverNode`

##usage

###启动Selenium server

    java -jar selenium-server-standalone-2.11.0.jar

###简单的测试用例
    var webdriverNode = require("webdriverNode");
    var client = webdriverNode.remote();
    /* 
    或者通过指定ip，来操控远端的selenium server
    var client = webdriverNode.remote({
        host: "xx.xx.xx.xx"
        });
    另外也可以指定进行测试的浏览器
    var client = webdriverNode.remote({desiredCapabilities:{browserName:"chrome"}});
    */

    client
        .init()
        .url("https://github.com/")
        .getElementSize("id", "header", function(result){ console.log(result);  })
        .getTitle(function(title) { console.log(title) })
        .getElementCssProperty("id", "header", "color", function(result){ console.log(result);  })
        .end(); 

##相对webdriverjs的更新

* 独立出了异步方法顺序执行的模块[SyncRun](https://github.com/neekey/syncRun)，提供更加自由和强大的顺序执行。
* 添加了`log`方法，用于让用户自定义输出（本身是一个用于和异步方法一起顺序执行的方法）
* 记录每个顺序执行的操作过程和结果，并在`end`方法的回调中作为第一个参数返回（所有的信息，包括用户自定义log）
* 强调一下，`webdriverNode`和`webdriverjs`在实际使用中没有区别。`webdriverjs`的`examples`可以直接用`webdriverNode`来运行

# License 

(The MIT License)

Copyright (c) 2011-2012 Neekey (倪云建) &lt;ni184775761@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.