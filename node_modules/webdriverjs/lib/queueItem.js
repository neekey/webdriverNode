var newQueue = function ( scope ){

    var rootItem = newQueueItem( 'root', 'root', undefined, scope, [] );

    rootItem.isRoot = true;
    rootItem.queueIsRunning = false;
    rootItem.currentQueueItem = rootItem;
    rootItem.rootItem = rootItem;

    return rootItem;
};

/**
 * QueueItem工厂
 * @param commandName
 * @param method
 * @param scope
 * @param args
 * @return {*}
 */
var newQueueItem = function ( type, commandName, method, scope, args ){

    return new QueueItem( type, commandName, method, scope, args )
};
/**
 * 每个方法被调用后产生的queue对象
 * @param commandName 方法名称
 * @param method 方法本身
 * @param scope 方法执行的上下文
 * @param args 方法执行的参数
 * @constructor
 */
var QueueItem = function ( type, commandName, method, scope, args) {

    this.children = [];
    this.type = type;
    this.commandName = commandName;
    this.method = method;
    this.arguments = [];
    this.scope = scope;
    // 当前子节点执行的索引
    this.currentChildIndex = 0;
    // 用来标示item及其children是否都执行完毕
    this.isDone = false;
    // 用来标示item自身的method的执行状态
    this.selfStat = 'wait'; // wait | running | done
    this.isCallbackDone = false;
    this.dependItem = null;
    this.commandResult = {};
    this.customLog = [];


    var self = this;
    var hasCallback = false;
    var proxyCallback;
    var currentArg;

    // 对函数调用时的参数重新进行组装, 添加回调
    for (var i = 0; currentArg = args[i]; i++) {

        // 若最后一个参数为function，则被当做回调函数
        if (typeof currentArg == "function" && i == (args.length - 1)) {

            hasCallback = true;

            // 对回调函数进行封装
            proxyCallback = (function (method, methodName) {
                return function (result) {

                    self.saveCommandResult( result );

                    // 当回调执行时，当前的queueItem理应为 self
                    // 这样能保证在回调中动作会被添加到self的childrend中
                    // 保证层级关系
//                    self.rootItem.currentQueueItem = self;
                    console.log( 'callback :', self.commandName );

                    method.call(scope, result);

                    self.isCallbackDone = true;
                    self.next();
                };
            })(currentArg, commandName);
        }
        else {
            this.arguments.push( currentArg );
        }
    }

    if (!hasCallback) {

        proxyCallback = (function () {
            return function ( result ) {
                self.saveCommandResult( result );

                console.log( 'callback :', self.commandName );
//                self.rootItem.currentQueueItem = self;
                self.isCallbackDone = true;

                self.next();
            };
        })();

    }

    this.arguments.push( proxyCallback );
};


QueueItem.prototype.saveCommandResult = function ( result ){

    this.commandResult = result;
};

QueueItem.prototype.addCustomLog = function ( msg ){

    this.customLog.push( msg );
};

QueueItem.prototype.getLogs = function ( logLevel ){

    console.log( 'log: ' + this.commandName );
    var logs = {
        commandResult: this.commandResult,
        customLog: this.customLog,
        commandName: this.commandName
    };

    console.log( logs );

    if( this.children.length > 0 ){

        logs.children = [];

        this.children.forEach(function ( child ){

            console.log( 'child', child.commandName, child.parent ? child.parent.commandName : 'root' );
//            if( logLevel === 'protocol' ){
//
//                logs.children.push( child.getLogs( logLevel ) );
//            }
//            else {
//
//                if( child.type !== 'protocol' ){
//
//                    logs.children.push( child.getLogs( logLevel ) );
//                }
//            }

            logs.children.push( child.getLogs( logLevel ) );

        });
    }

    return logs;
};

/**
 * 执行item, 如果有children（或者在item执行的过程中添加了children），则继续执行children
 */
QueueItem.prototype.run = function () {

    var self = this;

    // 只有在依赖完成的情况下，才能执行
    if( self.dependItem && !self.dependItem.isDone ){

        console.log( 'depend check '+ self.commandName + '  dependItem: ' + self.dependItem.commandName );
        return false;
    }

    // switch to the current queue item to make future addings to the correct queue item
    self.rootItem.currentQueueItem = this;

    if( this.selfStat === 'wait' ){

        console.log( 'run： ', this.commandName );
        // run the command
        this.selfStat = 'running';
        typeof this.method === 'function' && this.method.apply( this.scope, this.arguments );
        this.selfStat = 'done';
    }
    else {

        this.next();
    }

    return true;
};

/**
 * 想当前item添加child
 * @param item
 */
QueueItem.prototype.add = function (item) {

    console.log( 'ADD parent: ', this.commandName, ' newItem: ', item.commandName );
    // make a reference to its parent so we can travel back
    item.parent = this;
    item.rootItem = this.rootItem;
    item.dependItem = this.children[ this.children.length -1 ] || this.dependItem;

    // add the new item to this childrens list
    this.children.push( item );

    var queueIsRunning = this.rootItem.queueIsRunning;

    // 若队列还未运行，则开始运行
    // 若其父节点还处于执行状态，则父节点在执行中动态添加了子节点，因此立即执行该子节点
    if ( !queueIsRunning || this.selfStat === 'running' ) {

        // make sure we switch the running flag so that we dont run .next again when a new item is added.
        this.rootItem.queueIsRunning = true;

        // begin the que
        this.next();
    }
};

/**
 * 运行下一个children，如果都执行完毕，则done
 */
QueueItem.prototype.next = function () {

    console.log( 'NEXT: ', this.commandName );
    var self = this;

    // if we have more children, run the next
    // otherwise tell the item we are done
    if (this.currentChildIndex < this.children.length) {

        if( this.children[this.currentChildIndex].run() ){
            this.currentChildIndex++;
        }

        // 执行完毕后， 将 currentQueueItem设置回自身
//        self.rootItem.currentQueueItem = this;
    }
    else {

        this.done();

        // 若当前节点已经结束，则将currentQueueItem设置为父节点
//        this.rootItem.currentQueueItem = this.parent;
    }
};

/**
 * 检查当前节点是否已经执行完毕
 */
QueueItem.prototype.done = function () {

    console.log( 'DONE: ', this.commandName );

    // 若已经完成，则直接跳过，防止反复检查，导致this.parent.next被多次调用
    if( this.isDone ){

        return;
    }

    // 递归检查是否所有子节点都已经执行完毕
    var checkDoneChildren = this.getNextChildToRun();

    // 若还存在子节点，则执行
    if( checkDoneChildren ){

        console.log( 'children exist: ',  checkDoneChildren.commandName );
        this.isDone = false;
        checkDoneChildren.run();
    }
    // 若节点本身尚未执行，则执行
    else if( this.selfStat !== 'done' ){

        console.log( 'self not finished: ', this.commandName );
        this.isDone = false;
        this.run();
    }
    else if( this.isCallbackDone === false ){

        this.isDone = false;
    }
    else {

        console.log( 'all finshed!' );
        this.isDone = true;

        // 若当前节点不是根节点，则继续执行兄弟节点
        if ( this.parent ) {

            // 执行兄弟节点
            this.parent.next();
        }
        else {

            // 到此说明所有节点均执行完毕
            this.rootItem.queueIsRunning = false;
        }
    }

};

/**
 * 递归查找当前节点的所有后代节点中尚未执行的节点
 * @return {*}
 */
QueueItem.prototype.getNextChildToRun = function () {

    var childToRun = null;
    var child;

    for (var i = 0; child = this.children[ i ]; i++) {

        if ( child && !child.isDone) {
            childToRun = child;
        }
        else {
            childToRun = child.getNextChildToRun();
        }

    }

    return childToRun;
};

exports.newQueue = newQueue;
exports.newQueueItem = newQueueItem;