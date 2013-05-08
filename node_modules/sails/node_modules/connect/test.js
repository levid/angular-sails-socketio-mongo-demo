
var connect = require('./');

var fixtures = __dirname + '/test/fixtures';
var app = connect();
app.use(connect.compress());
app.use(connect.static(fixtures, { maxAge: 100000 }));
require('http').createServer(app).listen(3000);