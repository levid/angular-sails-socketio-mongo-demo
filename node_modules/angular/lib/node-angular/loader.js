
/**
 * Automatically load|require
 * /models and /controllers
 * angular.load("models", "/models");
 * angular.load("controllers", "/controllers");
*/

var fs = require('fs')
  , path = require('path')
  , log = require('./log')

function models(directory) {
  directory = process.cwd() + (directory || '/app/models');
  fs.readdir(path.normalize(directory), function(error, files) {
    if (error) {
      console.error(error);
      if (/ENOENT/.test(error.message)) {
        log('error', 'angular looks in /app/controllers/ by default, try "angular --help"');
      } else {
        log('error', error.message);
      };
    } else {
      files.forEach(function(file) {
        if (file.search(/DS_Store/) !== -1) {
          return;
        };
        var model = file.replace('.js', '');
        global[model] = new require(directory+'/'+model);
      });
    }    
  });  
};

function controllers(directory, app) {
  directory = process.cwd() + directory || '/app/controllers';
  fs.readdir(path.normalize(directory), function(error, files) {
    if (error) {
      console.error(error);
      if (/ENOENT/.test(error.message)) {
        log('error', 'angular looks in /app/controllers/ by default, try "angular --help"');
      } else {
        log('error', error.message);
      };
    } else {
      files.forEach(function(file) {
        if (file.search(new RegExp(/DS_Store/)) !== -1) {
          return;
        };
        var controller = file.replace('.js', '');
        require(directory+"/"+controller)(app);
      });
    };
  });
};

var load = module.exports = function(which, directory, app) {
  if (which === 'models') {
    models(directory);
  } else if (which === 'controllers') {
    controllers(directory, app);
  } else {
    throw new Error('usage: angular --help');
  };
};

/* EOF */