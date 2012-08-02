#测试用例 & Exameple编写注意事项

##规范

* 每个API的测试用例包含一个`case`文件和一个用于测试的`html`页面，分别放在`./cases/`和`./pages/`目录下
* 用例文件和页面文件需要同名
* 命名规则`example.接口名称.后缀`
    
比如接口`keys`的名称为`example.keys.js`


* 要执行用例，需要前启动静态服务器（这样html页面才能在浏览器里面被访问): 


    node testServer.js

* 为了让用例页面的路径颗配置，因此每个用例文件引入模块`testHelper`来获取对应的测试页面地址
* 注意写好注释哦~

##例子
    var pageUrl = require( '../testHelper' ).getPageUrl( __filename );
    var client = require("../../lib/webdriverNode").remote({
        desiredCapabilities: {
            browserName:"firefox"
        }
    });

    client
        .init()
        .url( pageUrl )
        ...
        end( function( logs, testResult ){

            console.log( testResult );
        });