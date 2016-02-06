/**
 * Created by wizdev on 1/15/2016.
 */
var app = require('./server/server')(); //Run Server
var base = '/client';
app.server.use('/', app.express.static(__dirname + base));
app.server.get('/', function (req, res) {
    res.sendFile(__dirname  + base+'/index.html');
});