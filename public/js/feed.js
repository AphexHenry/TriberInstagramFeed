
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
    var lId = sURLTools.getUrlParameter("userid");
    socket.emit('setId', lId);

    socket.on('addFeed', function(msg){
      $scope.posts = msg;
      // $scope.posts = [{user:{username:"fdsdf"}}, {user:{username:"dsf"}}];
      $scope.$apply();
    });
  });