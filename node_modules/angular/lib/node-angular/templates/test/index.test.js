
var vows = require('vows')
  , assert = require('assert')
  , request = require('request');

vows.describe('general http tests').addBatch({
  'index page "/"': {
    topic: function() {
      var self = this;
      var serverFile = require(__dirname + '/../server.js');
      serverFile.listen(8000);
      setTimeout(function() {
        request('http://localhost:8000/', self.callback);
      }, 1000);
    },
    'should have no errors':function(error, response, body){
      assert.isNull(error);
    },
    'with a response code of 200':function(error, response, body){
      assert.equal(response.statusCode, 200);
    },
    'the body should contain the text node-angular':function(error, response, body){
      assert.equal(/node-angular/mgi.test(body), true);
    }
  }
}).export(module);

/* EOF */

