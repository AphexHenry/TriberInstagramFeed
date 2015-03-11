
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

// Setup and configure Express http server. Expect a subfolder named "public" to be the web root.
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

    // updating the last post every 10 secondes to fetch the new instagrams.
    // That's a dirty method, we would better use the subsription api (not well documented).
    var lLastTimeStamp = 0;
    setInterval(function()
    {
      api.user_media_recent(lId, {count:1}, function(err, medias, pagination, remaining, limit)
      {
        if((medias[0].created_time > lLastTimeStamp) && (lLastTimeStamp > 0))
        {
          socket.emit("addFeed", {content:medias, index:0});
        }
        lLastTimeStamp = medias[0].created_time;
      });
    }, 10000);
  });

  var lPaginationHandler = null;
  var paginationCallback = function(err, medias, pagination, remaining, limit){
    // Your implementation here 
    socket.emit("addFeed", {content:medias, index:1});
    lPaginationHandler = pagination;

  };

  socket.on("getFeed", function(msg)
  {
    if(lPaginationHandler)
    {
      if(lPaginationHandler.next) 
      {
        lPaginationHandler.next(paginationCallback); // Will get second page results 
      }
    }
    else
    {
      var lMin = msg;
      api.user_media_recent(lId, {count:10}, paginationCallback);
    }
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

