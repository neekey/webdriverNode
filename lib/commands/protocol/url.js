/**
 获取当前页面的uri(可以通过frame方法取得frame中的uri)
 跳转到某uri

 用法：
 1、this.url(function(ret){});//获取uri

 其中ret.value为
    string

 2、this.url('http://www.taobao.com/', function(ret){});//在当前页面打开淘宝首页

 其中ret.value为
    null
 */

exports.command = function(url, callback)
{

    var commandOptionsPost =  {
        path: "/session/:sessionId/url",
        method: "POST"
    }

    var commandOptionsGet =  {
        path: "/session/:sessionId/url",
        method: "GET"
    }

    var self = this;
    var data;

    // set
    if (typeof url === "string")
    {
        //	request = this.createRequest(this.createOptions(commandOptionsPost), this.proxyResponseNoReturn(callback));
        data = {"url": url};
        this._mods.communicate.request(
            commandOptionsPost,
            self.proxyResponseNoReturn(callback),
            data
        );
    }

    // get
    else
    {
        callback = url;
        //request = this.createRequest(this.createOptions(commandOptionsGet), this.proxyResponse(callback));
        data = {};

        this._mods.communicate.request(
            commandOptionsGet,
            self.proxyResponse(callback),
            data
        );
    }

    /*	request.write(data);
     request.end();


     var data = JSON.stringify({});

     this._mods.communicate.request(
     requestOptions,
     this.proxyResponse(callback),
     data
     );
     */
};

