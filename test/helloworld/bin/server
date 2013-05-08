#!/usr/bin/env node

var http = require('http'),
    port = 8080,
     url = 'http://localhost:' + port + '/';
/* We can access nodejitsu enviroment variables from process.env */
/* Note: the SUBDOMAIN variable will always be defined for a nodejitsu app */
if(process.env.SUBDOMAIN){
  url = 'http://' + process.env.SUBDOMAIN + '.jit.su/';
}

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('hello, I know nodejitsu.');
  res.end();
}).listen(port);



console.log('The http server has started at: ' + url);
