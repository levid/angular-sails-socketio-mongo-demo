parley
=========

Serial flow control toy for Node.js

## Features
+ Simple, minimalist api
+ Expects standard node.js semantics (i.e. callbacks are of the form `function(err,data){}` and the last argument of calling functions)
+ Omits functionality in order to make the library easier to work with (use async for complex stuff)
+ Line-by-line, synchronous-style code


## Compatible functions
Functions compatible with parley must have a callback as their last parameter.  If you plan to work with the results of asynchronous calls (which is often), you should plan for an err and data argument.
```
// A parley-equivalent setTimeout
function wait (ms,cb) {
  setTimeout(cb,ms);
}

// A parley-equivalent console.log
// (accepts deferred data as input)
function log (err,data,cb) {
  if (err) console.error(err,cb);
  else console.log(data,cb);
}
```


## Usage

```
var parley = require ('parley');

// Start a sequence
var $$ = new parley();

// Do some asynchronous things
$$(wait) (100);
$$(log) ("100 ms later...");
$$(wait) (100);
$$(log) ("200 ms later...");
$$(wait) (100);
$$(log) ("300 ms later...");
```


## Deferred data

```
// Handle deferred results
var result = $$(apiCall) ("http://google.com/v2");

// Result object is automatically converted to (err,data) arguments in $$(log)
$$(log) (result);

```

## Parallel processes

Multiple parley sequences can be run at the same time:

```
// Do a few things at once
var $render = new parley();
var $templates = new parley();
var $session = new parley();

// Wait until the document is ready
$render(jQuery.ready) ();

// Simultaneously, go fetch templates from jQuery
$templates(jQuery.get) ('http://templates.com', { production: true });

// Also go grab logged-in session data from the server
$session(jQuery.get) ('/user/sessionData', {});

// When all sequences are complete..
var $done = new parley($render,$templates,$session);

// Render the UI
$done(AppUI).render ();
$done(log) ('All done!');

```





## Objects
For convenience, objects wrapped in a parley have all of their methods converted to parley functions.  For instance, `$$(User).find(foo)` is equivalent to `$$(User.find)(foo)`

```
// Create a parley sequence
var $$ = new parley();

// Call $$(User.find) by wrapping the User object
var user = $$(User).find(17);
```
