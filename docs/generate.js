/**
 * 用于文档的生成
 */

var Mustache = require( './mustache' );
var fs = require( 'fs' );
var ps = require( 'path' );

// 需要便利的目录
var targetDirs = [ '../lib/commands/', '../lib/protocol/', '../lib/jasTest/' ];
var targetDirsDesc = [
    '普通操作命令（由底层协议派生）',
    '底层协议命令描述：\n' +
    '如果您使用protocol级别的方法，所有的回到返回值都遵循以下json格式\n' +
    '   格式：{\n' +
    '       sessionId:  {string|null}   某次回话的浏览器sessionId值\n' +
    '       status:     {number}        一个状态代码，总结了该命令的结果。非零值表示该命令失败。\n' +
    '       value:      {*}             返回的JSON数据\n' +
    '   }\n' +
    '备注：以下文档只标注value字段的内容。详细的status状态码参看http://code.google.com/p/selenium/wiki/JsonWireProtocol',
    '类jasmine测试命令' ];

var docsData = {
    docs: []
};
var groupData = {};
var dir;
var items;
var itemString;
var filename;
var i, j;

// 遍历每个目录
// 最终产生的数据
/*
var fakeData = {
    docs: [
        {
            name: 'commands',
            items: [
                {
                    name: 'alert',
                    description: 'hello world'
                }
            ]
        }
    ]
};
*/

for( i = 0; dir = targetDirs[ i ]; i++ ){

    items = fs.readdirSync( dir );
    groupData = {
        name: ps.basename( dir ),
        desc: targetDirsDesc[i],
        items: []
    };

    for( j = 0; filename = items[ j ]; j++ ){

        itemString = fs.readFileSync( ps.join( dir, filename ), 'utf8' );
        if(/\.js$/.test(filename)){
            groupData.items.push({
                name: filename.replace('.js', ''),
                description: getDescription( itemString )
            });
        }
    }

    docsData.docs.push( groupData );
}

/**
 * 从文件内容中解析出注释
 * @param string
 */
function getDescription( string ){
    
    var strArr = string.split( '\n' );
    var descArr = [];
    var descBegin = false;
    var descEnd = false;
    var i;
    var line;

    for( i = 0; line = strArr[ i ]; i++ ){

        // 若注释已经解析完毕，则跳出
        if( descEnd && descBegin ){
            break;
        }

        // 先寻找开头
        if( descBegin === false ){

            if( line.indexOf( '/**' ) === 0 ){

                descBegin = true;
            }
        }

        // 获取注释部分
        else {

            if( line.indexOf( '*/' ) !== 0 && line.indexOf( ' */' ) !== 0){

                descArr.push( line );   
            }
            else {

                descEnd = true;
            }
        }
    }

    return descArr.join( '\n' );
}

// 渲染
var template = fs.readFileSync( 'templates/index.tpl', 'utf8' );

// 输出
fs.writeFileSync( 'index.html', Mustache.render( template, docsData ), 'utf8' );


