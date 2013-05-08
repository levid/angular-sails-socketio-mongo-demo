
/**
 * @class angular
 * @method generate
 * @params {Object} args
 */

require('colors');

/**
 * deps
 */

var fs = require('fs')
  , path = require('path')
  , log = require('../log')
  , model = require('./model');

/**
 * @class generators
 * @method generate
 */

var generate = module.exports = function(args) {
  if (!args[0]) {
    console.error('node-angular'.yellow.inverse + ' generator type required!'.yellow);
  } else {
    var generator = args[0];
    switch (generator) {
      case 'scaffold':
        log('warn', 'Scaffolding not yet supported!');
        break;
      case 'model':
        if (args.length < 3) {
          log('warn', 'model name, and model attributes required!');
        } else {
          model(args);
        };
        break;
      default:
        log('warn', 'unknown generator type!');
    };
  }
};

/* EOF */