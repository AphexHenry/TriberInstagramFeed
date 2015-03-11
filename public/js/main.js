var app = angular.module('MyApp', []);

/*
 *  Angular.
 */
angular.module("mainModule", [])
  .controller("InputController", function ($scope, $http)
  {
    $scope.loading = false;
    $scope.users = [];
    $scope.needToLoad = false;
    $scope.forceLoad = false;

    // make sure we load the last change.
    setInterval(function(){if($scope.needToLoad){$scope.loadUsersAvatar(); }}, 500);

    // Instagram seems to limit the number of request.
    // make sure the user stop typing for 0.7 second before loading the icons.
    var inputChangedPromise;
    $scope.inputChanged = function(){
        if(inputChangedPromise){
            clearTimeout(inputChangedPromise);
        }
        inputChangedPromise = setTimeout(function(){$scope.loadUsersAvatar()},700);
    }

    $scope.loadUsersAvatar = function()
    {
      var inputChangedPromise;
      if(!$scope.loading)
      {
        $scope.loading = true;
        $scope.needToLoad = false;

        if($scope.userName.length > 0)
        {
          // get the table datas.
          $http.post("/getUsersWithName", {name:$scope.userName})
            .success(function (data, status, headers, config)
            {
              $scope.loading = false;
              if(data.length > 0)
              {
                $scope.users = data;
                if($scope.forceLoad)
                {
                  $scope.submitFormUserIndex(0);
                }
              }
              else
              {
                 $scope.users = [];
                 $scope.$apply();
              }
            })
            .error(function (data, status, headers, config)
            {
              // TODO : handle error.
            });
        }
        else
        {
          $scope.loading = false;
          $scope.needToLoad = false;
          $scope.users = [];
          $scope.$apply();
        }
      }
      else
      {
        $scope.needToLoad = true;
      }
    }

    $scope.pressEnter = function()
    {
      $scope.forceLoad = true;
      $scope.loadUsersAvatar();
    }

  	$scope.submitFormUserIndex = function (aIndex)
    {
      if(aIndex < $scope.users.length)
      {
        $scope.submitFormUserId($scope.users[aIndex].id);
      }
    }

    $scope.submitFormUserId = function(aId)
    {
      window.location = "/feed/" + aId;
    }

  });
