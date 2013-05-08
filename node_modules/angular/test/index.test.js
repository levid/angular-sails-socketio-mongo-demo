
/**
 * deps
 */

var vows = require('vows')
  , assert = require('assert')
  , angular = require('../lib/index');

/**
 * build spec batch
 */

vows.describe('general module tests').addBatch({
  'when requiring "node-angular"':{
    topic:function(){ 
      return angular;
    },
    '"node-angular" should be an object with methods':function(topic){
      assert.isObject(topic);
    }
  }
}).export(module);

/* EOF */