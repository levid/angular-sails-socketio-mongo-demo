
/**
 * @route /welcome
 */

var path = require('path');

module.exports = function(app) {

  app.get('/welcome', function(request, response) {
  	var html = path.normalize(__dirname + '/../../public/index.html');
    response.sendfile(html);
  });

};

/* EOF */