
/**
 * @class angular
 * @method help
 */

var help = module.exports = function() {
  console.log([
    '\nNODE-ANGULAR'.green.inverse,
    '\nUsage: angular <command> <arguments>'.green,
    'Commands:'.gray,
    ' -v, --version'.green + '    current node-angular version',
    ' -n, --new'.green + '        generate new node-angular project',
    ' -g --generate'.green + '    generate a new code template',
    ' -h, --help'.green + '       display available commands',
    ''
  ].join('\n'));
};

/* EOF */