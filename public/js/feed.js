
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
    // container for the posts.
    $scope.posts = [];
    //loading state.
    $scope.loading = true;

    var lId = sURLTools.getUrlParameter("userid");
    // sent the id to the server.
    socket.emit('setId', lId);
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
           if($(window).scrollTop() + $(window).height() > $(document).height() - 1) {
            if(!$scope.loading)
            {
              AskForNextPosts($scope);
              $scope.loading = true;
            }
           }
        });

        // $scope.posts = [{user:{username:"fdsdf"}}, {user:{username:"dsf"}}];
        $scope.$apply();
      });
    });
  });

  function AskForNextPosts($scope)
  {
    $scope.loading = true;
    socket.emit('getFeed', $scope.posts.length);
  }