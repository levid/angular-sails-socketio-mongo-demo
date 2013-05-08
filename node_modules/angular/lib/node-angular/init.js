
/**
 * @class angular
 * @method init (new) Generate skeleton project
 * @params {Object} args
 */
 
require('colors');

var fs = require('fs')
  , utils = require('./utils')
  , log = require('./log');

var init = module.exports = function(args) {
  if (!args[0]) {
    log('error', '"new" requires a project name!');
    return;
  };
  var project = args[0];
  utils.mkAppDirSync(project, project);
  utils.copyFileToApp('server.js', project);
  utils.mkAppDirSync('/app/', project);
  utils.mkAppDirSync('/app/config/', project);
  utils.mkAppDirSync('/app/controllers/', project);
  utils.mkAppDirSync('/app/models/', project);
  utils.copyFileToApp('app/controllers/welcome.js', project);
  utils.mkAppDirSync('/public/', project);
  utils.copyFileToApp('/public/index.html', project);
  utils.mkAppDirSync('/public/javascripts/', project);
  utils.mkAppDirSync('/public/javascripts/vendor/', project);
  utils.copyFileToApp('public/javascripts/app.js', project);
  utils.copyFileToApp('public/javascripts/vendor/angular-1.0.1.min.js', project);
  utils.mkAppDirSync('/public/stylesheets/', project);
  utils.mkAppDirSync('/public/partials/', project);
  utils.copyFileToApp('public/partials/welcome.html', project);
  utils.copyFileToApp('package.json', project);
  utils.mkAppDirSync('/test/', project);
  utils.copyFileToApp('test/index.test.js', project);
};

/* EOF */