/*---------------------------------------------------------------
	:: DirtyAdapter
	-> adapter

	This disk+memory adapter is for development only!
	Learn more: https://github.com/felixge/node-dirty
---------------------------------------------------------------*/

var async = require('async');
var _ = require('underscore');
_.str = require('underscore.string');


module.exports = (function () {

	// Load criteria module
	var getMatchIndices = require('./criteria.js');

	// Poor man's auto-increment
	//	* NOTE: In production databases, auto-increment capabilities 
	//	* are built-in.  However, that is not the case with dirty.
	//	* This in-memory auto-increment will not scale to a multi-instance / cluster setup.
	var statusDb = {};


	// Dependencies
	var dirty = require('dirty');
	var uuid = require('node-uuid');


	// Maintain connections to open file and memory stores
	var connections = {	};

	// String to precede key name for schema defininitions
	var schemaPrefix = 'waterline_schema_';

	// String to precede key name for actual data in collection
	var dataPrefix = 'waterline_data_';


	var adapter = {

		// Whether this adapter is syncable (yes)
		syncable: true,

		// Enable transactions by allowing Dirty to create a commitLog
		commitLog: {
			identity: '__default_dirty_transaction',
			adapter: 'sails-dirty'
		},

		// Default configuration for collections
		defaults: {

			// If inMemory is true, all data will be destroyed when the server stops
			// otherwise, it will be written to disk
			inMemory: true,

			// File path for disk file output (when NOT in inMemory mode)
			filePath: './.tmp/dirty.db'
		},

		// Logic to handle the (re)instantiation of collections
		registerCollection: function(collection, cb) {
			var self = this;
			var collectionName = collection.identity;

			// If the configuration in this collection corresponds 
			// with an existing connection, reuse it
			var foundConnection = _.find(connections, function (connection, name) {
				// console.log(collectionName,collection.filePath, collection.inMemory,":::", name,connection);
				// console.log("Connect:",name,connection, "Collcetion",collection.identity, collection.inMemory,collection.filePath);
				return connection && (connection.inMemory === collection.inMemory) ||
							(connection.filePath === collection.filePath);
			});

			if (foundConnection) {
				connections[collection.identity] = foundConnection;
				afterwards();
			}

			// Otherwise initialize for the first time
			else {
				connect(collection, function (err, connection) {
					// Save reference to connection
					connections[collection.identity] = connection;
					afterwards();
				});
			}

			function afterwards() {

				// Grab current auto-increment value from database and populate it in-memory
				// (it's ok if it doesn't exist-- it will only exist if Dirty persisting to disk 
				// and the collection has been initialized at least once)
				var schema = connections[collectionName].db.get(schemaPrefix + collectionName);

				statusDb[collectionName] = (schema && schema.autoIncrement) ? schema : {autoIncrement: 1};

				self.getAutoIncrementAttribute(collectionName, function (err,aiAttr) {
					// Check that the resurrected auto-increment value is valid
					self.find(collectionName, {
						where: {
							id: statusDb[collectionName].autoIncrement
						}
					}, function (err, models) {
						if (err) return cb(err);

						// If that model already exists, warn the user and generate the next-best possible auto-increment key
						if (models && models.length) {

							// Find max
							self.find(collectionName, {}, function (err,models) {
								var autoIncrement = _.max(models,function (model){
									return model[aiAttr];
								});
								autoIncrement = autoIncrement && autoIncrement[aiAttr] || 0;
								autoIncrement++;

								statusDb[collectionName].autoIncrement = autoIncrement;
								cb();
							});
						}
						else cb();
					});
				});

			}
		},

		// Flush data to disk before the adapter shuts down
		teardown: function(cb) {
			async.forEach(_.keys(connections), function (collectionName, cb) {

				// Always go ahead and write the new auto-increment to disc, even though it will be wrong sometimes
				// (this is done so that the auto-increment counter can be "resurrected" when the adapter is restarted from disk)
				var schema = connections[collectionName].db.get(schemaPrefix + collectionName);
				if (!schema) return cb(badSchemaError(collectionName, schemaPrefix));

				schema = _.extend(schema,{
					autoIncrement: statusDb[collectionName].autoIncrement
				});

				connections[collectionName].db.set(schemaPrefix + collectionName, schema, function (err) {
					connections[collectionName].db = null;
					cb && cb(err);
				});
			}, cb);
		},


		// Fetch the schema for a collection
		// (contains attributes and autoIncrement value)
		describe: function(collectionName, cb) {	
			
			// (it's ok if schema doesn't exist-- it will only exist if Dirty persisting to disk 
			// and the collection has been initialized at least once)
			var schema = connections[collectionName].db.get(schemaPrefix + collectionName);

			var attributes = schema && schema.attributes;
			return cb(null, attributes);
		},

		// Create a new collection
		define: function(collectionName, definition, cb) {
			var self = this;

			definition = _.extend({

				// Reset autoIncrement counter
				autoIncrement: 1
				
			}, definition);

			// Write schema objects
			return connections[collectionName].db.set(schemaPrefix + collectionName, definition, function(err) {
				if(err) return cb(err);

				// Set in-memory definition for this collection
				statusDb[collectionName] = definition;
				cb();
			});
		},

		// Drop an existing collection
		drop: function(collectionName, cb) {
			return connections[collectionName].db.rm(dataPrefix + collectionName, function(err) {
				if(err) return cb("Could not drop collection!");
				return connections[collectionName].db.rm(schemaPrefix + collectionName, cb);
			});
		},

		// Required for alter() to work

		// // Add an attribute to the schema
		// addAttribute: function(collectionName, attrName, attrDef, cb) {
		// 	// Get schema
		// 	var schema = connections[collectionName].db.get(schemaPrefix + collectionName);

		// 	// Update with new attribute
		// 	schema.attributes = schema.attributes[attrName] = _.clone(attrDef);

		// 	return connections[collectionName].db.set(schemaPrefix + collectionName, schema, function(err) {
		// 		if(err) return cb(err);

		// 		// Update in-memory definition for this collection
		// 		statusDb[collectionName] = schema;
		// 		cb();
		// 	});
		// },

		// // Remove an attribute from the schema
		// removeAttribute: function(collectionName, attrName, cb) {
		// 	console.log("REMOVING ",attrName);
		// 	// Get schema
		// 	var schema = connections[collectionName].db.get(schemaPrefix + collectionName);

		// 	// Update to remove attribute
		// 	delete schema.attributes[attrName];

		// 	return connections[collectionName].db.set(schemaPrefix + collectionName, schema, function(err) {
		// 		if(err) return cb(err);

		// 		// Update in-memory definition for this collection
		// 		statusDb[collectionName] = schema;
		// 		cb();
		// 	});
		// },


		// Create one or more new models in the collection
		create: function(collectionName, values, cb) {
			values = _.clone(values) || {};
			var dataKey = dataPrefix + collectionName;
			var data = connections[collectionName].db.get(dataKey);
			var self = this;


			// Lookup schema & status so we know all of the attribute names and the current auto-increment value
			var schema = connections[collectionName].db.get(schemaPrefix + collectionName);
			if (!schema) return cb(badSchemaError(collectionName, schemaPrefix));

			// Auto increment fields that need it
			doAutoIncrement(collectionName, schema.attributes, values, this, function (err, values) {
				if (err) return cb(err);

				self.describe(collectionName, function(err, attributes) {
					if(err) return cb(err);

					// Create new model
					// (if data collection doesn't exist yet, create it)
					data = data || [];
					data.push(values);

					// Replace data collection and go back
					connections[collectionName].db.set(dataKey, data, function(err) {
						return cb(err, values);
					});
				});
			});
		},

		// Find one or more models from the collection
		// using where, limit, skip, and order
		// In where: handle `or`, `and`, and `like` queries
		find: function(collectionName, options, cb) {
			var dataKey = dataPrefix + collectionName;
			var data = connections[collectionName].db.get(dataKey) || [];

			// Get indices from original data which match, in order
			var matchIndices = getMatchIndices(data,options);

			var resultSet = [];
			_.each(matchIndices,function (matchIndex) {
				resultSet.push(_.clone(data[matchIndex]));
			});

			cb(null, resultSet);
		},

		// Stream models from the collection
		// using where, limit, skip, and order
		// In where: handle `or`, `and`, and `like` queries
		stream: function (collectionName, options, stream) {
			var dataKey = dataPrefix + collectionName;
			var data = connections[collectionName].db.get(dataKey) || [];

			// Get indices from original data which match, in order
			var matchIndices = getMatchIndices(data,options);

			// Write out the stream
			_.each(matchIndices, function(matchIndex, cb) {
				stream.write(_.clone(data[matchIndex]));
			});

			// Finish stream
			stream.end();
		},

		// Update one or more models in the collection
		update: function(collectionName, options, values, cb) {
			var my = this;

			var dataKey = dataPrefix + collectionName;
			var data = connections[collectionName].db.get(dataKey);

			// Query result set using options
			var matchIndices = getMatchIndices(data,options);

			// Update model(s)
			_.each(matchIndices, function(index) {
				data[index] = _.extend(data[index], values);
			});

			// Get result set for response
			var resultSet = [];
			_.each(matchIndices,function (matchIndex) {
				resultSet.push(data[matchIndex]);
			});

			// Replace data collection and go back
			connections[collectionName].db.set(dataKey, data, function(err) {
				cb(err, resultSet);
			});
		},

		// Delete one or more models from the collection
		destroy: function(collectionName, options, cb) {
			var dataKey = dataPrefix + collectionName;
			var data = connections[collectionName].db.get(dataKey);

			// Query result set using options
			var matchIndices = getMatchIndices(data,options);

			
			// Remove model(s)
			// Get result set of only the models that remain
			data = _.reject(data, function(model,index) {
				return _.contains(matchIndices, index);
			});

			// Replace data collection and respond with what's left
			connections[collectionName].db.set(dataKey, data, function(err) {
				cb(err);
			});
		},



		// Identity is here to facilitate unit testing
		// (this is optional and normally automatically populated based on filename)
		identity: 'sails-dirty'
	};



	//////////////                 //////////////////////////////////////////
	////////////// Private Methods //////////////////////////////////////////
	//////////////                 //////////////////////////////////////////

	// Initialize an underlying data connection given a collection def
	function connect (collection, cb) {
		var collectionName = collection.identity;

		// Default to inMemory if no file path is specified
		if (_.isUndefined(collection.inMemory) && !collection.filePath) {
			collection.inMemory = true;
		}

		if( collection.inMemory ) {
			var memDb = new(dirty.Dirty)();
			memDb.on('load', function() { 
				cb(null, {
					db			: memDb,
					inMemory	: true
				}); 
			});
		}
		else  {

			// Node v0.10.0 compatibility error
			if (process.version === 'v0.10.0') {
				sails.log.error("Because of an underlying issue with felixge's node-dirty (https://github.com/felixge/node-dirty/issues/34),");
				sails.log.error("the development-only persistent disk store in the sails-dirty adapter is not compatibile with node v0.10.0.");
				sails.log.error("Please use the MySQL or MongoDB adapter, switch the inMemory flag to true, or revert to node 0.8.22 using a solution like TJ Hollaway's `n`.");
				sails.log.error("Please check twiter (@sailsjs) for updates on a fix, or check out the node-dirty repository to submit a patch.");
				process.exit(1);
			}

			// Check that filePath file exists and build tree as neessary
			require('fs-extra').createFile(collection.filePath, function(err) {
				if(err) return cb(err);
				
				var fileDb = new(dirty.Dirty)(collection.filePath);
				fileDb.on('load', function() { 
					cb(null, {
						db			: fileDb,
						inMemory	: false
					}); 
				});
			});
		}
	}

	// Look for auto-increment field, increment counter accordingly, and return refined value set
	function doAutoIncrement (collectionName, attributes, values, ctx, cb) {

		// Determine the attribute names which will be included in the created object
		var attrNames = _.keys(_.extend({}, attributes, values));


		_.each(attrNames, function(attrName) {
			// But only if the given auto-increment value 
			// was NOT actually specified in the value set, 
			if(_.isObject(attributes[attrName]) && attributes[attrName].autoIncrement) {
				
				if (!values[attrName]) {
					
					// increment AI fields in values set
					values[attrName] = statusDb[collectionName].autoIncrement;

					// Increment the auto-increment counter for this collection
					statusDb[collectionName].autoIncrement++;

				}
			}
		});

		// Return complete values set w/ auto-incremented data
		return cb(null,values);
	}

	function badSchemaError(collectionName, schemaPrefix) {
		return new Error('Cannot get schema from Dirty for collection: ' + collectionName + ' using schema prefix: '+schemaPrefix);
	}

	return adapter;
})();

