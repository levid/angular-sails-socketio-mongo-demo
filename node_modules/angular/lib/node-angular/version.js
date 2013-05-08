
/**
 * @class angular
 * @method version
 */

var fs = require('fs')

var version = module.exports = function() {
  var packageFile = __dirname + '/../../package.json';
  var data = fs.readFileSync(packageFile).toString();
  return JSON.parse(data).version;
};

/* EOF */