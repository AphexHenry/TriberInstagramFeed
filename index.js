
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
  var lId;
  socket.on("setId", function(msg)
  {
    lId = msg;
    api.user(msg, function(err, result, remaining, limit) 
    {
       socket.emit("mapUser", result);
    });
  });

  socket.on("getFeed", function(msg)
  {
    var lMin = msg;
    api.user_media_recent(lId, {min_id:lMin}, 
    function(err, medias, pagination, remaining, limit)
    {
      console.log(remaining);
      console.log(limit);
       socket.emit("addFeed", {content:medias, index:lMin});
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

