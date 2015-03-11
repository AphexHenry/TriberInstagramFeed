
/*
 *  Socket IO global
 */
var socket = io();

/*
 *  Angular.
 */
var angularApp = angular.module("mainModule", []);

angularApp.config(function($sceDelegateProvider) {
     $sceDelegateProvider.resourceUrlWhitelist([
       // Allow same origin resource loads.
       'self',
       // Allow videos loading from the instagram domain.
       'http://scontent.cdninstagram.com/**']);
     });

angularApp.controller("FeedController", function ($scope, $http)
{
  // container for the posts.
  $scope.posts = [];
  //loading state.
  $scope.loading = true;
  $scope.endOfFeed = false;

  var lId = sURLTools.getUrlParameter("userid");
  // sent the id to the server.
  socket.emit('setId', lId);

  // handle a wrong user id, come back to home.
  socket.on('wrongUser', function(msg)
  {
    window.location = '/';
  });

  // everything is loaded.
  socket.on('loadedAll', function(msg)
  {
    $scope.endOfFeed = true;
    $scope.$apply();
  });

  //retrieve the user information.
  socket.on('mapUser', function(msg)
  {
    $scope.user = msg;
    // request the feed.
    AskForNextPosts($scope);

    // get the next posts.
    socket.on('addFeed', function(msg){
      $scope.loading = false;
      if(msg.index == 0)
      {
        $scope.posts = msg.content.concat($scope.posts);
      }
      else
      {
        $scope.posts = $scope.posts.concat(msg.content);  
      }
      
      $(window).scroll(function() {
         if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
          if(!$scope.loading)
          {
            AskForNextPosts($scope);
            $scope.loading = true;
          }
         }
      });

      $scope.$apply();
    });
  });
});

function AskForNextPosts($scope)
{
  $scope.loading = true;
  socket.emit('getFeed', $scope.posts.length);
}