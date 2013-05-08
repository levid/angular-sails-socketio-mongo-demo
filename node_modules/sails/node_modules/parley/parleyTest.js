// Dependencies
var async = require('async');
var _ = require('underscore');
var parley = require('./index.js');

function runTests() {

	function z(str, cb) {
		console.log(str);
		setTimeout(function() {
			cb(null, str);
		}, 1000);
	}

	function zzz($$promise, cb) {
		console.log("Got result:", $$promise.data);
		cb();
	}

	// Define deferred parley objects
	var $$ = new parley();
	// var $$1 = new parley();
	// var $$2 = new parley($$, $$1);

	//////////////////////////////////////////////////////////////////////
	// Basic usage
	//////////////////////////////////////////////////////////////////////
	// console.log("\n\n\n\n\n\n\n");
	// console.log("*************");
	// console.log("Test #1");
	// console.log("*************");
	// $$ (z) ('test');					// z('test')
	// $$ (z) ('2');						// z(2)
	// var $$result = $$ (z) ('3');		// result = {data: z(3)}
	// $$1 (z) ('some other chain');		// z('some other chain')
	// $$1 (z) ('some other chain #2');	// z('some other chain #2')
	// $$2 (zzz) ($$result);				// zzz(result)

	//////////////////////////////////////////////////////////////////////
	// Testing Parley.log and deferred object generation
	//////////////////////////////////////////////////////////////////////
	// console.log("\n\n\n\n\n\n\n");
	// console.log("*************");
	// console.log("Test #2");
	// console.log("*************");
	// var $$User = $$(User);
	// var $$log = $$(parley.log);
	// $$log($$User.find(3)); // This will return a data object
	// $$log($$User.find("Johnny")); // This will return an error

	
	//////////////////////////////////////////////////////////////////////
	// Real world use case of some simple serial logic
	//////////////////////////////////////////////////////////////////////
	// console.log("\n\n\n\n\n\n\n");
	// console.log("*************");
	// console.log("Test #3");
	// console.log("*************");

	// var cb = function(err, data, cb) {
	// 		console.log("\n\n***\nOperation complete!");
	// 		if (err) console.warn(err);
	// 		else console.log(data);
	// 		console.log("***\n");
	// 	};
	
	// var $$cb = $$(cb);
	// var martin = $$(User).find(3);
	// $$cb(martin);

	//////////////////////////////////////////////////////////////////////
	// Serial callbacks
	//////////////////////////////////////////////////////////////////////
	// function test4 (cb) {
	// 	console.log("\n\n\n\n\n\n\n");
	// 	console.log("*************");
	// 	console.log("Test #4");
	// 	console.log("*************");

	// 	// Callbacks can be executed serially
	// 	// BTW the closure can access asynchronous data, but not consistently.  Always pass data as an arg.)
	// 	var $ = new parley();
	// 	var user3 = $(User).find(3);
	// 	$(cb)(user3);
	// 	// user3 = $(function (err,data,cb) {
	// 	// 	if (err) cb(err);
	// 	// 	else cb(err,data);
	// 	// })(user3);
	// 	// $(cb)(user3);
	// }

	// //////////////////////////////////////////////////////////////////////
	// // An example of how to manage conditionals
	// //////////////////////////////////////////////////////////////////////

	// function test5 (cb) {
	// 	console.log("\n\n\n\n\n\n\n");
	// 	console.log("*************");
	// 	console.log("Test #5");
	// 	console.log("*************");

	// 	var $ = new parley ();
	// 	var criteria = {name: 'widget'};

	// 	// Rather than using multiple serial parley calls,
	// 	// define your logic within a single block and use nested parley objects if necessary
	// 	var someUser = $(User).find(criteria);
	// 	someUser = $(function (err,data,cb) {
	// 		var $ = new parley();
	// 		if (err) cb(err);
	// 		else if (data) cb(err,data);
	// 		else {
	// 			var newUser = $(User).create(criteria);
	// 			$(cb)(newUser);
	// 		}
	// 	})(someUser);
	// 	$(cb)(someUser);
	// }


	//////////////////////////////////////////////////////////////////////
	// An example of how to use built-in support for asynchonous conditions
	//////////////////////////////////////////////////////////////////////
	function test6 (cb) {
		console.log("\n\n\n\n\n\n\n");
		console.log("*************");
		console.log("Test #6");
		console.log("*************");

		var $ = new parley ();
		var criteria = 35;
		var someUser = $(User).find(criteria);
		

		// ifNull conditional shortcut fn
		$(cb).ifNull();

		// Anything afterwards is treated as "else"
		$(cb)(null,"notNull!");
	}



	//////////////////////////////////////////////////////////////////////
	// An example of building a transactional findAndCreate() function
	//////////////////////////////////////////////////////////////////////
	function test7 (cb) {
		console.log("\n\n\n\n\n\n\n");
		console.log("*************");
		console.log("Test #7");
		console.log("*************");

		var $ = new parley();

		var u = $(findAndCreate)({name: 'mike'});
		$(cb)(u);
		
		function findAndCreate(criteria,cb) {
			var $ = new parley ();
			$(User).lock(criteria);
			$(User).find(criteria);
			$(cb).ifNotNull();
			$(cb).ifError("Error encountered when trying to find User.");
			var u = $(User).create(criteria);
			$(User).unlock(criteria);
			$(cb)(u);
		}
	}

	//////////////////////////////////////////////////////////////////////
	// An example of using $$.log
	//////////////////////////////////////////////////////////////////////
	function test8 (cb) {
		console.log("\n\n\n\n\n\n\n");
		console.log("*************");
		console.log("Test #8");
		console.log("*************");

		var $$ = new parley();
		$$.log("test");
		$$(cb)();
	}



	// Run tests
	var $ = new parley();
	var result;

	// result = $(test4)();
	// $(function (err,data,cb) {
	// 	console.log("Outcome:\t("+err+",",data,")"); 
	// 	cb();
	// })(result);

	// result = $(test5)();
	// $(function (err,data,cb) {
	// 	console.log("Outcome:\t("+err+",",data,")"); 
	// 	cb();
	// })(result);

	// result = $(test6)();
	// $(function (err,data,cb) {
	// 	console.log("Outcome:\t("+err+",",data,")"); 
	// 	cb();
	// })(result);

	result = $(test7)();
	$(function (err,data,cb) {
		console.log("Outcome:\t("+err+",",data,")"); 
		cb();
	})(result);
	result = $(test8)();


	$(function (cb) {
		console.log("done");
		
		// Not required, but it's good to clean up after yourself
		cb();
	})();

	// var findOrCreate = function (criteria,cb) {
	// 	var $ = new parley();

	// 	$(User).lock(criteria);

	// 	var user = $(User).find(criteria);
	// 	$(function (err,data) {

	// 	});

	// 	$(User).create(criteria);
	// 	$(function (err,data) {

	// 	});

	// 	$(User).unlock(criteria);
	// 	$(cb)(user);
	// };

	// var def = {
	// 	name: 'johnny'
	// };
	// var johnny = $$(findOrCreate) (def);
	// $$(cb)(johnny);


}




// More efficient way (store most recent object)
// $(User).find(criteria);
// $(cb).ifError();
// $(cb).ifNull();
// $(User).create(criteria);
// $(cb) ();



// Define User object for real world use case above
var User = { 
	// Random other parameters will remain untouched
	a: 1,
	b: "g248",
	c: "g8q234",

	// Mock find function
	find: function(criteria, cb) {
		setTimeout(function() {
			console.log("Finding users...",criteria);
			if(_.isObject(criteria) || _.isFinite(criteria)) {
				var result = criteria === 3 ? {
					name: "Martin"
				} : null;
				cb(null, result);
			} else cb("Invalid criteria parameter (" + criteria + ") passed to User.find.");
		}, 1050);
	},
	create: function(definition, cb) {
		console.log("Creating User...");
		setTimeout(function() {
			if(_.isObject(definition)) {
				console.log("User created!");
				cb(null, definition);
			} else cb("Invalid definition parameter (" + definition + ") passed to User.create.");
		}, 150);
	},

	lock: function (criteria,cb) {
		setTimeout(function () {
			console.log("Locking users...",criteria);
			cb();
		},500);
	},

	unlock: function (criteria,cb) {
		setTimeout(function () {
			console.log("Unlocking users...",criteria);
			cb();
		},500);
	}
};



runTests();


// BEST
// var user = User.findOrCreate(id,criteria).done(cb);
// function findOrCreate(criteria,exit) {
// 	User.find(id,function (err,data) {
// 		if (err) return exit(err);
// 		if (data) return exit(null,data);
// 		User.create(def,function (err,data) {
// 			if (err) return exit(err);
// 			return exit(null,data);
// 		});
// 	});
// }
// WEIRD
// var user = $$User.find(id);
// $$(function (err,data,cb) {
// 	console.log("******* FIND COMPLETE   err:",err, "   data:  ",data, "cb:",cb);
// 	if (err) cb(err);
// 	else if (data) cb(err,data);
// 	else {
// 		var createdUser = $$User.create(def);
// 		$$(function (err,data) {
// 			console.log("-------> create complete",err,data);
// 			if (err) cb(err);
// 			else cb(err,data);
// 		}) (createdUser);
// 	}
// }) (user);
// Hypothetical solution:
// $$.hasError(user).then(cb)('Error finding user.');
// $$.isNotNull(user).then(cb)(user);
// $$User.create(def);
// $$.hasError(user).then(cb)('Error creating user.');

// $$.hasError(user).then(cb);
// $$.isNull(user).then(cb);
// $$(function(err,data,cb) {
// 	if (err) callback(err,data);
// 	else callback(null,data);
// }) (user);
// $$.onError(user).then(cb);
// $$.ifEqual(user,null).then(cb);

// $$User.create(def);
// $$.callback(cb)(user);			// Convert classic (err,data) callback so that it's parley-callback compatible
// $$(cb)(user);
// $$.breakIf(user,null);
// $$.ifError(user).stop();

// $$(function ($$r,cb) {
// 	if ($$r.) {
// 	}
// })(val);



// var result = $$(User).find(3);
// $$(function (result,cb) {
// 	console.log(result.error);
// 	console.log(result.data);
// 	cb();
// }) (result);
// $connect$ ( function (x,cb) {
// 	console.log(" Do more " + x + " stuff!");
// 	setTimeout(cb,100);
// }) ("111111111111");
// $other$ ( function (x,cb) {
// 	console.log(" Do more " + x + " stuff!");
// 	setTimeout(cb,200);
// }) ("22222222222");
// var $_result = $connect$ ( function (x,cb) {
// 	console.log(" Do more " + x + " stuff!");
// 	setTimeout(function (){
// 		cb(null,"some data");
// 	},500);
// }) ("33333333333");
// var $next$ = new parley ($connect$, $other$);
// $next$ (function ($$,cb) {
// 	if ($$.error) throw $$.error;
// 	console.log("DATA:",$$.data);
// 	cb();
// }) ($_result);