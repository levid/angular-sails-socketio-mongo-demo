var stream = require('stream')
  , fs = require('fs')
  , util = require('util')
  ;

var BufferedStream = function (limit) {
  if (typeof limit === 'undefined') {
    limit = Infinity;
  }
  this.limit = limit;
  this.size = 0;
  this.chunks = [];
  this.writable = true;
  this.readable = true;
}
util.inherits(BufferedStream, stream.Stream);
BufferedStream.prototype.pipe = function (dest, options) {
  var self = this
  if (self.resume) self.resume();
  stream.Stream.prototype.pipe.call(self, dest, options)
  //just incase you are piping to two streams, do not emit data twice.
  //note: you can pipe twice, but you need to pipe both streams in the same tick.
  //(this is normal for streams)
  if(this.piped)
    return dest
    
  process.nextTick(function () {
    self.chunks.forEach(function (c) {self.emit('data', c)})
    self.size = 0;
    delete self.chunks;
    if(self.ended){
      self.emit('end')
    }
  })
  this.piped = true

  return dest
}
BufferedStream.prototype.write = function (chunk) {
  if (!this.chunks) {
    this.emit('data', chunk);
    return;
  }
  this.chunks.push(chunk);
  this.size += chunk.length;
  if (this.limit < this.size) {
    this.pause();
  }
}
BufferedStream.prototype.end = function () {
  if(!this.chunks)
    this.emit('end');
  else
    this.ended = true
}

if (!stream.Stream.prototype.pause) {
  BufferedStream.prototype.pause = function() {
    this.emit('pause');
  };
}
if (!stream.Stream.prototype.resume) {
  BufferedStream.prototype.resume = function() {
    this.emit('resume');
  };
}

exports.BufferedStream = BufferedStream;

var UpgradableStream = function () {
  var self = this;
  self.upgradable = false;
  self.on('pipe', function (source) {
    self.source = source;
    self.upgradable = (source instanceof fs.ReadStream);
  })
};
util.inherits(UpgradableStream, stream.Stream);
UpgradableStream.prototype.pipe = function () {
  var dest = this.dest = arguments[0]
     , destfd
     ;
  if (dest.socket) destfd = dest.socket.fd;
  else if (dest.fd) destfd = dest.fd;
   
  if (this.upgradable && destfd) {
    console.log('sendfile')
    console.log(this.source.bufferSize)
    console.error(this.source)
    // this.source.end();
    var p = this.source.path;
    var m = this.source.mode;
    dest.socket.flush();
    fs.stat(p, function (e, stat) {
      fs.open(p, m, 0, function(err, fd) {
        console.dir(fd)
        fs.sendfile(fd, destfd, 0, stat.size, function () {
          dest.end();
        });
        
      })
    })
    
    delete this.source
    return dest
  } else {
    console.log('pipeing')
    return this.source.pipe.apply(this.source, arguments);
  }
}
UpgradableStream.prototype.write = function () {}
UpgradableStream.prototype.end = function () {}
UpgradableStream.prototype.resume = function () {}


exports.UpgradableStream = UpgradableStream
