/**
 * @description Module for saving base64 string to file.
 * @author neekey<ni184775761@gmail.com>
 * @date 2012-08
 * @type {*}
 */

var Base64JS = require( 'base64js' );

/**
 * Save base64-data received from server as `.png` image.
 *
 * @param {Object} options {
 *      path: The path image will be saved to.
 *      extraInfo: The extra info you want to put into the filename of the screen shot file.
 *      data: The base64 string data of the screen shot.
 * }
 * @return {String} filename
 */
var base64ToFile = function( options ) {

    var path = options.path;
    var extraInfo = options.extraInfo;
    var data = options.data;
    var prePath = path || __dirname;
    var fileName = '';
    var randomStr = randomTmpStr();

    if ( extraInfo !== undefined ) {

        fileName = prePath + extraInfo + randomStr + ".png";
    }
    else {

        fileName = prePath + randomStr + '.png';
    }

    // Transform base64 string to file.
    Base64JS.decodeSync( data, fileName );

    return fileName;
};

/**
 * Return a random string for filename building.
 *
 * @return {String}
 */
var randomTmpStr = function(){

    var x = Math.floor(Math.random() * Math.pow(16,4)).toString(16);
    var y = Math.floor(Math.random() * Math.pow(16,4)).toString(16);
    var z = Math.floor(Math.random() * Math.pow(16,4)).toString(16);

    return [x,y,z].join('_') + '_' + Date.now();
};

module.exports = base64ToFile;