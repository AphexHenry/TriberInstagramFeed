
/*
 *  Socket IO global
 */
var socket = io();

/*
 *  Angular.
 */
angular.module("mainModule", [])
  .controller("FeedController", function ($scope, $http)
  {
    $scope.posts = [{user:{username:"Alex"}}, {user:{username:"Alefx"}}];
    $scope.posts = [];

    var lId = sURLTools.getUrlParameter("userid");
    // sent the id to the server.
    socket.emit('setId', lId);
    //retrieve the user information.
    socket.on('mapUser', function(msg)
    {
      $scope.user = msg;
      // request the feed.
      AskForIndexAfter(0);
      // get the .
      socket.on('addFeed', function(msg){
        if(msg.index == 0)
        {
          $scope.posts = msg.content.concat($scope.posts);
        }
        else
        {
          $scope.posts = $scope.posts.concat(msg.content);  
        }
        
        // $scope.posts = [{user:{username:"fdsdf"}}, {user:{username:"dsf"}}];
        $scope.$apply();
      });
    });

  });

  function AskForIndexAfter(aIndexMin)
  {
    socket.emit('getFeed', aIndexMin);
  }