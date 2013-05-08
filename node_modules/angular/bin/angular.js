#!/usr/bin/env node

var args = process.argv.slice(2)
  , command = args.shift()
  , angular = require('../lib/');

require('colors');

switch(command) {
  case 'v':
  case 'version':
  case '-v':
  case '--version':
    angular.log('version', angular.version());
    break;
  case 'n':
  case 'new':
    angular.init(args);
    break;
  case 'g':
  case 'generate':
  case '-g':
  case '-generate':
    angular.generate(args);
    break;
  case 'r':
  case 'routes':
  case '-r':
  case '--routes':
    angular.routes(args);
    break;
  case 's':
  case 'server':
  case '-s':
  case '--server':
    angular.server(args);
    break;
  case 'h':
  case 'help':
  case '-h':
  case '--help':
  default:
    angular.help();
    break;
};

/* EOF */