var SyncRun = require( 'syncrun' );
var http = require("http");
var fs = require('fs');
var path = require('path');
var infoHasBeenShown = false;
var Config = require('./config');
var colors = Config.colors;
var errorCodes = Config.errorCodes;

/**
 * webDriver 对象
 * @param options
 * @constructor
 */
var WebdriverJs = function (options)//host, port, username, pass)
{
    options = options || {};

    var self = this;
    self.syncRun = SyncRun.newQueue();
    self.startPath = '/wd/hub';
    self.infoHasBeenShown = false;
    // 记录所有的log信息
    self.logInfo = [];

    self.sessionId = null;

    /* log level
     * silent : no logs
     * command : command only
     * verbose : command + data
     */
    self.logLevel = options.logLevel || 'verbose';

    // 设置截图保存路径
    self.screenshotPath = options.screenshotPath || '';

    // 设置默认的用于向server请求的配置
    self.defaultRequestOptions = {
        host:options.host || 'localhost',
        port:options.port || 4444,
        method:'POST'
    };

    // 用于描述client希望server支持的session的功能
    // @link http://code.google.com/p/selenium/wiki/JsonWireProtocol#Introduction - Capabilities JSON Object
    self.defaultDesiredCapabilities = {
        browserName:"firefox",
        version:"",
        javascriptEnabled:true,
        platform:"ANY"
    };

    self.desiredCapabilities = self.extend(self.defaultDesiredCapabilities, options.desiredCapabilities);

    // 保存所有实现的 WebDriver Wire Protocol
    self.protocol = {"direct":{}};
    // 组合 WebDriver Wire Protocol 实现的功能
    self.commands = {"direct":{}};
    // 所有的测试方法
    self.tests = {"direct":{}};
    // 所有的断言
    self.assert = {"direct":{}};
    self.direct = {};
    self.custom = {};

    // 显示帮助信息
    self.showHelpInfo();

    self.addCommands( 'protocol', protocolCommands );
    self.addCommands( 'command', commandList );
    self.addCommands( 'test', testList );
    self.addCommands( 'assert', assertList );

};

WebdriverJs.prototype = {

    addCommands: function ( type, commandList ){

        var name;
        var self = this;
        var command;

        for( name in commandList ){

            command = commandList[ name ];

            self.addCommand( type, name, command );
        }
    },

    addCommand: function ( type, commandName, command ){

        var self = this;
        var syncRun = self.syncRun;

        if ( self[commandName] ) {
            throw "The command '" + commandName + "' is already defined!";
        }

        self[commandName] = syncRun( commandName, command );
    },

    /**
     * 显示帮助信息
     */
    showHelpInfo: function (){

        var self = this;

        if (self.logLevel !== 'silent' && !this.infoHasBeenShown) {
            console.log("");
            console.log(colors.yellow + "=====================================================================================" + colors.reset);
            console.log("");
            console.log("Selenium 2.0/webdriver protocol bindings implementation with helper commands in nodejs by Camilo Tapia.");
            console.log("For a complete list of commands, visit " + colors.lime + "http://code.google.com/p/selenium/wiki/JsonWireProtocol" + colors.reset + ". ");
            console.log("Not all commands are implemented yet. visit " + colors.lime + "https://github.com/Camme/webdriverjs" + colors.reset + " for more info on webdriverjs. ");
            //Start with " + colors.lime + "-h option" + colors.reset + " to get a list of all commands.");
            console.log("");
            console.log(colors.yellow + "=====================================================================================" + colors.reset);
            console.log("");

            this.infoHasBeenShown = true;
        }
    },

    /**
     * 将方法添加到 this.direct 中，并且使得方法执行时的上下文为this
     * @param commands
     */
    addDirectCommands:function ( commands ) {

        var direct = this.direct;
        var self = this;
        var method;
        var command;

        for ( command in commands ) {

            method = commands[ command ];
            direct[ command ] = (function (method) {
                return function () {
                    var args = Array.prototype.slice.call(arguments);
                    method.apply( self, args );
                };
            })(method);
        }
    },

    /**
     * 向server发送请求
     * @param requestOptions 请求配置项
     * @param callback 回调
     * @param data 附带的数据
     */
    executeProtocolCommand:function (requestOptions, callback, data) {

        var request = this.createRequest(requestOptions, data, callback);
        var stringData = JSON.stringify(data);

        // 发送数据
        request.write(stringData);
        request.end();
    },

    /**
     * 发起请求
     * @param requestOptions
     * @param data
     * @param callback
     * @return {Object} request对象
     */
    createRequest:function (requestOptions, data, callback) {

        if (typeof data == "function") {
            callback = data;
            data = "";
        }

        var fullRequestOptions = this.createOptions(requestOptions);
        var request;
        var self = this;

        self.log( 'command', {
            method: fullRequestOptions.method,
            path: fullRequestOptions.path
        });
        self.log( 'data', { data: data });

        // 设置header，必须为下面的 content-type 和 charset
        fullRequestOptions.headers = {
            'content-type':'application/json',
            'charset':'charset=UTF-8'
        };

        // 根据data设置 content-length
        if (data != "") {
            fullRequestOptions.headers['content-length'] = JSON.stringify(data).length;
        }
        else {
            fullRequestOptions.headers['content-length'] = 0;
        }

        request = http.request(fullRequestOptions, callback);

        request.on("error", function (err) {

            self.log( 'error', {
                title: 'ERROR ON REQUEST',
                err: err
            });
        });

        return request;
    },

    // create a set of request options
    createOptions:function (requestOptions) {

        var self = this;
        var newOptions = self.extend( this.defaultRequestOptions, requestOptions);
        var path = this.startPath;

        if (self.sessionId) {
            newOptions.path = newOptions.path.replace(':sessionId', self.sessionId);
        }

        if (newOptions.path && newOptions.path !== "") {
            path += newOptions.path;
        }

        newOptions.path = path;

        return newOptions;
    },

// a helper function to create a callback that parses and checks the result
    /**
     * 对server请求的回调代理
     * @param callback
     * @param options
     * @return {Function} 返回经过代理的回调函数
     */
    proxyResponse:function (callback, options) {
        var self = this;
        var baseOptions = { saveScreenshotOnError:true };

        return function (response) {

            var data = "";

            response.setEncoding('utf8');

            // 开始接受响应内容
            response.on('data', function (chunk) {
                data += chunk.toString();
            });

            response.on('end',
                function () {
                    if (options) {
                        if ( options.setSessionId ) {
                            try {
                                var locationList = response.headers.location.split("/");
                                var sessionId = locationList[locationList.length - 1];
                                self.sessionId = sessionId;
                                self.log( "SET SESSION ID " + sessionId);
                            }
                            catch (err) {

                                self.log( 'error', {
                                    title: 'COULDNT GET A SESSION ID',
                                    err: err
                                })
                            }

                        }
                    }

                    var result;

                    try {
                        // 解析返回的数据结构
                        // 应该为如下数据格式
                        // { sessionId:, status: , value: }
                        result = JSON.parse(self.strip(data));
                    }
                    catch (err) {
                        if (data !== "") {

                            self.log( 'error', {
                                err: err,
                                msg: data
                            });
                        }

                        result = {value:-1};

                        if (callback) {
                            callback(result);
                        }

                        return;
                    }

                    // success
                    if (result.status === 0) {

                        var value = result.value.length > 50 ? result.value.substring(0, 49) + "..." : result.value;
                        self.log( 'result', { value: value } );
                    }

                    else {

                        // NoSuchElement
//                        if (result.status === 7) {
//                            result = {
//                                value:-1,
//                                status:result.status,
//                                orgStatus:result.status,
//                                orgStatusMessage:errorCodes[result.status].message
//                            };
//                            self.log( 'result', { value: errorCodes[result.status].id });
//                        }

                        // remove the content of the screenshot temporarily so that cthe consle output isnt flooded
                        var screenshotContent = result.value.screen;
                        delete result.value.screen;

                        if (errorCodes[result.status]) {

                            console.log( 'test~~~~' );
                            self.log( 'error', {
                                title: errorCodes[result.status].id,
                                msg: errorCodes[result.status].message
                            });
                        }
                        else {

                            self.log( 'error', {
                                msg: errorCodes[result.status].message
                            });
                        }

                        // add the screenshot again
                        result.value.screen = screenshotContent;

                        // 保存screenshot
                        if (process.argv.length > 1) {

                            var runner = process.argv[1].replace(/\.js/gi, "");

                            var prePath = "";

                            if (self.screenshotPath === "") {
                                prePath = runner;
                            }
                            else {
                                prePath = self.screenshotPath + runner.substring(runner.lastIndexOf("/") + 1);
                            }

                            // dont save the screenshot if its an unknown error
                            if (result.status != 13) {

                                var errorScreenshotFileName = prePath + "-ERROR.CODE[ " + result.status + "]"+ ".png";

                                self.log( 'screenshotSave', {
                                    fileName: errorScreenshotFileName
                                });

                                self.saveScreenshotToFile(errorScreenshotFileName, result.value.screen);
                            }
                        }

                    }

                    if (!self.sessionId) {

                        self.log( 'error', {
                            title: 'NO SESSION, EXITING'
                        });

                        process.exit(1);
                    }

                    if (callback) {
                        //	console.log("run callback for protocol")
                        callback(result);
                    }
                }
            );
        };
    },

    /**
     * 设置截图保存路径
     * @param pathToSaveTo
     * @return {Object}
     */
    setScreenshotPath:function (pathToSaveTo) {

        var self = this;

        self.screenshotPath = pathToSaveTo;
        return self;
    },

    // a basic extend method
    extend:function (base, obj) {
        var newObj = {};
        for (var prop1 in base) {
            newObj[prop1] = base[prop1];
        }
        for (var prop2 in obj) {
            newObj[prop2] = obj[prop2];
        }
        return newObj;
    },


    testMode:function () {
        this.log(colors.yellow + "NOW IN TEST MODE!" + colors.reset + "\n");
        this.logLevel = 'silent';
        return this;
    },

    // strip the content from unwanted characters
    strip:function (str) {
        var x = [],
            i = 0,
            il = str.length;

        for (i; i < il; i++) {
            if (str.charCodeAt(i)) {
                x.push(str.charAt(i));
            }
        }

        return x.join('');
    },

    log: function ( type, obj ){

        if( this.logLevel === 'silent' ){
            return;
        }

        var logStr = '';

        switch( type ){

            case 'command':

                var method = obj.method;
                var path = obj.path;

                console.log( logStr = colors.violet + "COMMAND\t" + colors.reset + method + '\t' +  path );
                break;

            case 'data':

                var stringData = JSON.stringify( obj.data );

                if( stringData && stringData !== '{}' && stringData !== '""' ){
                    console.log( logStr = colors.brown + "DATA\t" + colors.reset + stringData )
                }
                break;

            case 'result':

                var value = obj.value;
                console.log( logStr = colors.teal + "RESULT\t" + colors.reset + value );
                break;

            case 'error':

                var msg = obj.msg;
                var err = obj.err;
                var title = obj.title || type;
                console.log( logStr = colors.red + title + '\t' + colors.reset + "\t" + msg );

                if( err ){
                    console.log( logStr = colors.red + err + colors.reset);
                }

                if( msg ){
                    console.log( logStr = colors.dkgrey +  msg + colors.reset + '\n' );
                }

                break;

            case 'screenshotSave':

                var fileName = obj.fileName;
                logStr = colors.red + "SAVING SCREENSHOT WITH FILENAME:" + colors.reset
                    + colors.brown + fileName + colors.reset;

                console.log( logStr );
                break;

            default:

                console.log( logStr = type );
                break;
        }

        this.addLog( logStr );
    },

    addLog: function ( logStr ){

        this.logInfo.push({
            log: logStr,
            date: Date.now()
        });
    },

    getAllLogs: function (){

        return this.logInfo;
    },

// a helper function to create a callback that doesnt return anything
    proxyResponseNoReturn:function (callback) {
        return function (response) {
            if (callback) {
                callback();
            }
        };
    },



// log test result
    showTest:function (theTest, receivedValue, expectedValue, message) {
        if (theTest) {
            console.log(colors.green + "✔" + colors.reset + "\t" + message);
        }
        else {
            console.log(colors.red + "✖" + colors.reset + "\t" + message + "\t" + colors.white + expectedValue + colors.reset + " !== " + colors.red + receivedValue + colors.reset);
        }
    },

    saveScreenshotToFile:function (fileName, data) {
//console.log(fileName)
//	var buff = new Buffer(data, "binary"); 
//	console.log(data)

        fs.writeFile(fileName, data, "base64", function (err) {
                if (err) {
                    this.log(err);
                }
            }
        );
    }
};


// the acutal commands. read them dynamicaly
var protocolFiles = fs.readdirSync(__dirname + "/protocol/");
var protocolCommands = {};

for (var i = 0, ii = protocolFiles.length; i < ii; i++) {
    if (path.extname(protocolFiles[i]) == ".js") {
        var commandName = path.basename(protocolFiles[i], '.js');
        protocolCommands[commandName] = require("./protocol/" + protocolFiles[i]).command;
    }
}

// save the command list to a variable available to all
var commandFiles = fs.readdirSync(__dirname + "/commands/");
var commandList = {};

for (var i = 0, ii = commandFiles.length; i < ii; i++) {
    if (path.extname(commandFiles[i]) == ".js") {
        var commandName = path.basename(commandFiles[i], '.js');
        commandList[commandName] = require("./commands/" + commandFiles[i]).command;
    }
}


var testFiles = fs.readdirSync(__dirname + "/tests/");
var testList = {};

for (var i = 0, ii = testFiles.length; i < ii; i++) {
    if (path.extname(testFiles[i]) == ".js") {
        var commandName = path.basename(testFiles[i], '.js');
        testList[commandName] = require("./tests/" + testFiles[i]).command;
    }
}


var assertFiles = fs.readdirSync(__dirname + "/asserts/");
var assertList = {};
for (var i = 0, ii = assertFiles.length; i < ii; i++) {
    if (path.extname(assertFiles[i]) == ".js") {
        var commandName = path.basename(assertFiles[i], '.js');
        assertList[commandName] = require("./asserts/" + assertFiles[i]).command;
    }
}


var singletonInstance = null;

// expose the man function
// if we need a singleton, we provide the option here
exports.remote = function (options)//host, port, username, pass)
{
    // make sure we have a default options if none are provided
    options = options || {};

    if (options.singleton) {
        if (!singletonInstance) {
            singletonInstance = new WebdriverJs(options);
        }
        return singletonInstance;
    }
    else {
        return new WebdriverJs(options);//host, port, username, pass);
    }
};

