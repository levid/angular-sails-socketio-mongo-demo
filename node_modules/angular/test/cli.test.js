

var vows = require('vows')
  , util = require('util')
  , assert = require('assert')
  , exec = require('child_process').exec;

vows.describe('node-angular CLI tests').addBatch({
  'npm link': {
    topic: function() {
      var self = this;
      exec('sudo npm link', self.callback);
    },
    'should have no errors':function (error, stdout, stderr) {
      assert.isNull(error);
    },
    'stdout should display a local env linking':function (error, stdout, stderr) {
      console.log(stdout);
      assert.equal(/\/bin\/angular ->/mi.test(stdout), true);
    },
    'an empty stderr':function (error, stdout, stderr) {
      assert.equal(stderr.length, 0);
    }
  }
}).export(module);

/* EOF */

