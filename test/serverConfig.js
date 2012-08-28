/**
 * 配置用于测试页面的静态服务器的相关信息
 */
module.exports = {
    port: 7788,
    host: 'localhost',
    pagePath: '/pages',
    getPageBase: function(){
        return 'http://' + this.host + ':' + this.port + this.pagePath;
    }
};