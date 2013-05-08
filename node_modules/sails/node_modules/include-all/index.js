var fs = require('fs');

// Returns false if the directory doesn't exist
module.exports = function requireAll(options) {
  var files;
  var modules = {};

  // Remember the starting directory
  if(!options.startDirname) {
    options.startDirname = options.dirname;
  }

  try {
    files = fs.readdirSync(options.dirname);
  } catch(e) {
    if(options.optional) return {};
    else throw new Error('Directory not found: ' + options.dirname);
  }

  // Iterate through files in the current directory
  files.forEach(function(file) {
    var filepath = options.dirname + '/' + file;

    // For directories, continue to recursively include modules
    if(fs.statSync(filepath).isDirectory()) {

      // Ignore explicitly excluded directories
      if(excludeDirectory(file)) return;

      // Recursively call requireAll on each child directory
      modules[file] = requireAll({
        dirname: filepath,
        filter: options.filter,
        pathFilter: options.pathFilter,
        excludeDirs: options.excludeDirs,
        startDirname: options.startDirname
      });

    }
    // For files, go ahead and add the code to the module map
    else {

      // Key name for module
      var identity;

      // Filename filter
      if (options.filter) {
        var match = file.match(options.filter);
        if(!match) return;
        identity = match[1];
      }

      // Full relative path filter
      if (options.pathFilter) {
        // Peel off relative path
        var path = filepath.replace(options.startDirname,'');
        
        // make sure a slash exists on the left side of path
        path = '/' + _.str.ltrim(path,'/');

        var pathMatch = path.match(options.pathFilter);
        if (!pathMatch) return;
        identity = pathMatch[2];
      }

      // Load module into memory
      modules[identity] = require(filepath);
    }
  });

  // Pass map of modules back to app code
  return modules;

  function excludeDirectory(dirname) {
    return options.excludeDirs && dirname.match(options.excludeDirs);
  }
};