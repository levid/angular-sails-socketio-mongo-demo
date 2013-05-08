
/**
 * @class angular
 * @returns {Object}
 */

var angular = module.exports = {
  generate : require('./node-angular/generators/'),
  version  : require('./node-angular/version'),
  logger   : require('./node-angular/logger'),
  routes   : require('./node-angular/routes'),
  server   : require('./node-angular/server'),
  help     : require('./node-angular/help'),
  load     : require('./node-angular/loader'),
  init     : require('./node-angular/init'),
  log      : require('./node-angular/log')
};

/* EOF */