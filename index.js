
var http = require('http');
var express = require('express');
var httpApp = express();
var webServer = require('http').Server(httpApp);
var io = require('socket.io')(webServer);
var bodyParser = require('body-parser');

// instagram driver.
var api = require('instagram-node').instagram();

api.use({ client_id: 'c84aa5c191cc40028440478a279c7ebd',
         client_secret: '7d0e1012970f4b3ca47bb39686ec577d' });

// Setup and configure Express http server. Expect a subfolder named "public" to be the web root.
httpApp.use(express.static(__dirname + "/public"));
httpApp.use(bodyParser.urlencoded({ extended: true }));
httpApp.use(bodyParser.json());

// handle socket io connection.
io.on('connection', function(socket){
  var lId;
  var lInterval = null;
  socket.on("setId", function(msg)
  {
    lId = msg;
    api.user(msg, function(err, result, remaining, limit) 
    {
      if(result == undefined)
      {
        socket.emit("wrongUser", result); 
      }
      else
      {
        socket.emit("mapUser", result);
      }
    });

    // updating the last post every 10 secondes to fetch the new instagrams.
    // That's a dirty method, we would better use the subsription api (not well documented).
    var lLastTimeStamp = 0;
    lInterval = setInterval(function()
    {
      api.user_media_recent(lId, {count:1}, function(err, medias, pagination, remaining, limit)
      {
        if(medias == undefined)
          return;
        if((medias[0].created_time > lLastTimeStamp) && (lLastTimeStamp > 0))
        {
          socket.emit("addFeed", {content:medias, index:0});
        }
        lLastTimeStamp = medias[0].created_time;
      });
    }, 10000);
  });

  // pagination callback to stream the feed.
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
        lPaginationHandler.next(paginationCallback); // Will get next page results 
      }
      else
      {
        socket.emit('loadedAll');
      }
    }
    else
    {
      api.user_media_recent(lId, {count:10}, paginationCallback);
    }
  });

  socket.on('disconnect', function () {
    if(lInterval)
    {
      clearInterval(lInterval);
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

