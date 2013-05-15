# Angular + Sails + Socket.io + MongoDB Demo

A simple CRUD example of using AngularJS with SailsJS. It uses Angular Resource to interface with the Sails REST back-end Api
and also includes some socket.io interaction on the front-end. There is some basic authentication and also 
a few nifty directives for loading gravatars via email address and form password validation. Enjoy!

Install
------------------

    git clone git@github.com:levid/angular-sails-socketio-mongo-demo.git
    cd angular-sails-socketio-mongo-demo
    npm install
    
You will want to configure your Mongo DB in config/adapters.js
    
    mongo: {
      module   : 'sails-mongo',
      url      : 'mongodb://localhost:27017/YOUR_DB_NAME'
    }
    
Then to start the server on port 1337 run:

    sails lift

Partials (inlined)
------------------

Partials can either be inlined into the main html page by dumping partials into the assets/templates folder,
your partial should look like this:

    <script type="text/ng-template" id="partial1.html">
      <h1>View 1</h1>
      <p>foo = {{foo}}</p>
    </script>
    
You can also create sub folders within the templates folder to keep things more organized. 
Just make sure to reference the path relative to your templates folder like this:

    <script type="text/ng-template" id="partials/partial1.html">
      <h1>View 1</h1>
      <p>foo = {{foo}}</p>
    </script>

then include the line below in your main html body (this will concatenate and inject all the partials into the page):

    <%- assets.templateLibrary() %>

Your when statement in your angular routeprovider would look like this :

    when('/view1', {templateUrl: 'partial1.html'}).
          
where partial1.html would be the id specified in your partial

Partials (remote)
-----------------

Partials can also be served from the server by dumping your plain html partials into assets/templates/partials
(note though that if you include the assets.templateLibrary() line from above - the partials in this folder 
will still be injected into the page)

Your when statement in your angular routeprovider - in this case - would look like this :

    when('/view1', {templateUrl: '/template/find/partial1.html'}).

(this uses the api/controller/TemplateController.js to serve up a partial by name)
