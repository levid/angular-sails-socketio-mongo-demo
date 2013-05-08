/*---------------------
  :: Template
  -> controller
---------------------*/
module.exports = {
  index: function (req,res) {
    var listOfAssetSourcePaths = sails.config.assets.sequence;

    var htmlString = "";
    async.each(listOfAssetSourcePaths, function (path,cb) {
      require('fs').readFile(path,function (err, contents) {
        if (err) return cb(err);
        htmlString += contents;
      });
    }, function (err) {
      if (err) return res.send(err,500);

      res.contentType('text/html');
      res.send(htmlString);
    });
  },

  find: function(req,res) {
    var tpl = req.param('id');
    console.log('looking for template' + tpl);
    require('fs').readFile('assets/templates/views/remote/'+tpl,function (err, contents) {
      if (err){
        console.log(err);
        res.contentType('text/html');
        res.send('');
      }
      else {
        res.contentType('text/html');
        res.send(contents);
      }
    });
  }
};

var io = require('socket.io').listen(1336);
io.sockets.on('connection', function (socket) {
  socket.setMaxListeners(0);
  socket.emit('news', { hello: 'world' });
  socket.emit('init', { data: 'what' });
  socket.on('my other event', function (data) {
    console.log("serverEventData: " + data);
  });

  socket.on('deleteUser', function(user){
    console.log("onUserDeleted broadcasted");
    socket.broadcast.emit('onUserDeleted', user);
  });

  socket.on('addUser', function(user){
    console.log("onUserAdded broadcasted");
    socket.broadcast.emit('onUserAdded', user);
  });

  socket.on('updateUser', function(user){
    console.log("onUserUpdated broadcasted");
    socket.broadcast.emit('onUserUpdated', user);
  });

  var numberOfSockets = Object.keys(io.connected).length;
  socket.emit('connectedUsers', { count: numberOfSockets });
  socket.broadcast.emit('connectedUsers', { count: numberOfSockets });

  socket.removeListener("connect", function(){});
  socket.removeListener("deleteUser", function(){});
  socket.removeListener("addUser", function(){});
});