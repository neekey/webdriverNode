/**
 * 用于文档的生成
 */

var Mustache = require( './mustache' );
var fs = require( 'fs' );
var ps = require( 'path' );

// 需要便利的目录
var targetDirs = [ '../lib/commands/', '../lib/protocol/', '../lib/jasTest/' ];

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
        items: []
    };

    for( j = 0; filename = items[ j ]; j++ ){

        itemString = fs.readFileSync( ps.join( dir, filename ), 'utf8' );

        groupData.items.push({
            name: filename,
            description: getDescription( itemString )
        });
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
var template = fs.readFileSync( 'templates/index.mustache', 'utf8' );

// 输出
fs.writeFileSync( 'index.html', Mustache.render( template, docsData ), 'utf8' );


