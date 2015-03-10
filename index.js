
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

// Setup and configure Express http server. Expect a subfolder called "public" to be the web root.
var httpApp = express();
var webServer = require('http').Server(httpApp);

httpApp.use(express.static(__dirname + "/public/"));
httpApp.use(bodyParser.urlencoded({ extended: true }));
httpApp.use(bodyParser.json());


var port = Number(process.env.PORT || 3000);
webServer.listen(port, function(){
  console.log('listening on *:' + port);
});

