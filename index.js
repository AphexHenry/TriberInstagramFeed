
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

// instagram driver.
var api = require('instagram-node').instagram();

api.use({ client_id: 'b91056a8d0c443af98f1fa9523972bb9',
         client_secret: '2b88ce7e89f54f9781c3158848a90bb7' });

var redirect_uri = 'http://localhost:3000/handleauth';

// Setup and configure Express http server. Expect a subfolder called "public" to be the web root.
var httpApp = express();
var webServer = require('http').Server(httpApp);

httpApp.use(express.static(__dirname + "/public/"));
httpApp.use(bodyParser.urlencoded({ extended: true }));
httpApp.use(bodyParser.json());

exports.authorize_user = function(req, res) {
  res.redirect(api.get_authorization_url(redirect_uri));
};

exports.handleauth = function(req, res) {
  api.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err.body);
      res.send("Didn't work");
    } else {
      console.log('Yay! Access token is ' + result.access_token);
      api.user_search('a', [], function(err, users, remaining, limit) {res.send(users);});
	 
    }
  });
};

// This is where you would initially send users to authorize 
httpApp.get('/authorize_user', exports.authorize_user);

httpApp.get('/', function(req, res){
  res.sendFile(__dirname + '/' + 'public/nameInput.html');
});

httpApp.post('/getUsersWithName', function(req, res) {
  api.user_search(req.body.name, {count:3}, 
    function(err, users, remaining, limit) 
    {
      res.send(users);
    });
});

httpApp.get('/feed/:userId', function(req, res) {
    console.log("feed/:userId");
  console.log(req.params);
    api.user_media_recent(req.body.userId, {}, 
    function(err, users, remaining, limit) 
    {
      
    });
  res.send("tagId is set to " + req.params.userId);
});

// This is your redirect URI 
httpApp.get('/handleauth', exports.handleauth);
 

var port = Number(process.env.PORT || 3000);
webServer.listen(port, function(){
  console.log('listening on *:' + port);
});

