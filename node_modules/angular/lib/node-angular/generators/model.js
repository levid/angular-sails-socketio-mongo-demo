
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

var model = module.exports = function(args) {
  var action = args[1];
  // model attributes
  var attributes = args.splice(2, args.length);
  // generate model
  var modelJS = '\n';
  modelJS += "var mongoose = require('mongoose)'\n";
  modelJS += "  , Schema = mongoose.Schema\n";
  modelJS += "  , ObjectId = Schema.ObjectId;\n\n";
  modelJS += "var " + action + " = mongoose.model('" + action + "', {\n";
  modelJS += "  id : { 'type' : ObjectId },\n";
  attributes.map(function(attribute) {
    if (/:/.test(attribute)) {
      var parts = attribute.split(':');
      var attributeName = parts[0];
      var attributeType = parts[1];
      modelJS += "  " + attributeName + " : { 'type' : " + attributeType + " },\n";
    } else {
      modelJS += "  " + attribute + " : { 'type' : String },\n";
    };
  }); 
  modelJS += "  created_at : { 'type' : Date, 'default': Date.now }\n";
  modelJS += "});\n\n";
  modelJS += "module.exports = " + action + ";\n";
  // save model
  path.exists(process.cwd() + '/app/models/', function(exists) {
    if (exists) {
      var modelDestination = process.cwd() + '/app/models/' + action + '.js';
      console.log(modelDestination);
      fs.writeFile(modelDestination, modelJS, function(error) {
        if (error) {
          log('error', error.message);
        } else {
          log('create', '/app/models/' + action + '.js');
        }
      });
    } else {
      log('error', 'Not in an node-angular project!');
    };
  });
};

/* EOF */