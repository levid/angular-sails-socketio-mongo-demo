// /**
// * basic.test.js
// *
// * This module is just a basic sanity check to make sure basic functionality is in order
// *
// *
// */

// // Dependencies
var _ = require('underscore');
var parley = require('../index');
var assert = require("assert");


describe('parley', function() {
	describe('#parley object ', function() {
		it('should be created w/o an error', function(done) {
			var $ = new parley();
			$(function (cb) {
				done();
			})();
		});
	});
});