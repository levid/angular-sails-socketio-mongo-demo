
/**
 * @class angular
 * @method log
 * @param {String} directory Directory to create
 * @param {String} project Project name
 */

var log = module.exports = function(type, message) {
  switch(type) {
    case 'create':
      console.log('create'.green + ' ' + message);
      break;
    case 'patch':
      console.log('patch'.magenta + ' ' + message);
      break;
    case 'warn':
      console.log('warn:'.yellow.inverse + ' ' + message.yellow);
      break;
    case 'error':
      console.log('error:'.red.inverse + ' ' + message.red);
      break;
    case 'version':
    case 'success':
    case 'title':
      console.log('node-angular'.green.inverse + ' ' + message.green);
      break;
    default:
      break;
  };
};

/* EOF */