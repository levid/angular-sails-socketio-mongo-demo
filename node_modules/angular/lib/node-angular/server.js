
/**
 * @class angular
 * @method server
 * @param {Number} port Port to run Express/Node on
 */

var path = require('path')
  , log = require('./log');

var server = module.exports = function(args) {
  var port = args[0] || 9000;
  var server = process.cwd() + '/server.js';
  path.exists(server, function(exists) {
    if (exists) {
      var serverFile = require(server);
      serverFile.listen(port);
    } else {
      log('warn', 'No server.js file found!');
    };
  });
};

/* EOF */