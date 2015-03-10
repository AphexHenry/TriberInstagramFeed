
var http = require('http');
var express = require('express');
var httpApp = express();
var webServer = require('http').Server(httpApp);
var io = require('socket.io')(webServer);
var bodyParser = require('body-parser');

// instagram driver.
var api = require('instagram-node').instagram();

api.use({ client_id: 'b91056a8d0c443af98f1fa9523972bb9',
         client_secret: '2b88ce7e89f54f9781c3158848a90bb7' });

var redirect_uri = 'http://localhost:3000/handleauth';

// Setup and configure Express http server. Expect a subfolder called "public" to be the web root.

httpApp.use(express.static(__dirname + "/public"));
httpApp.use(bodyParser.urlencoded({ extended: true }));
httpApp.use(bodyParser.json());

// handle socket io connection.
io.on('connection', function(socket){
  console.log("connection");
  socket.on("setId", function(msg)
  {
    api.user_media_recent(msg, {}, 
    function(err, medias, pagination, remaining, limit)
    {
       socket.emit("addFeed", medias);
    });
  });

});

httpApp.post('/getUsersWithName', function(req, res) {
  api.user_search(req.body.name, {count:3}, 
    function(err, users, remaining, limit) 
    {
      res.send(users);
    });
});

httpApp.get('/feed*', function(req, res) {
  res.sendFile('public/feed.html', { root: __dirname });
});

var port = Number(process.env.PORT || 3000);
webServer.listen(port, function(){
  console.log('listening on *:' + port);
});

