
/**
 * @class angular
 * @method logger
 */

require('./log');

var parse = require('url').parse;

var logger = module.exports = function() {
  return function log(request, response, next) {
    var host = request.headers.host;
  	var path = parse(request.url).pathname;
  	var method = request.method;
  	var currentTime = new Date();
  	var month = currentTime.getMonth() + 1;
  	var day = currentTime.getDate();
  	var year = currentTime.getFullYear();
  	var hours = currentTime.getHours();
  	var minutes = currentTime.getMinutes();
  	var date = month + '/' + day + '/' + year + ':';
 	  var time = hours + ':' + minutes;
  	var fullPath = 'http://' + host + path;
  	var msg = date + time +  ' "' + method.toUpperCase() + '" ' + fullPath;
  	console.log('node-angular'.green.inverse + ' ' + msg);
  	next(request, response);
  };
};

/* EOF */