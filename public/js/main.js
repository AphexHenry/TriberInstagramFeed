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


    $scope.loadUsersAvatar = function()
    {
    }

    {
      if(!$scope.loading)
      {
        $scope.loading = true;
        $scope.needToLoad = false;

        // get the table datas.
        $http.post("/getUsersWithName", {name:$scope.userName})
          .success(function (data, status, headers, config)
          {
            $scope.loading = false;
            if(data.length > 0)
            {
              console.log("not empty");
              $scope.users = data;
            }
            else
            {
              console.log("empty");
               $scope.users = [];
            }
          })
          .error(function (data, status, headers, config)
          {
            console.log("error");
            // TODO : handle error.
          });
      }
    }

  	$scope.submitFormUserIndex = function (aIndex)
    {
      if(aIndex < data.length)
      {
        $scope.submitFormUserId(data[aIndex].id);
      }
    }

    $scope.submitFormUserId = function(aId)
    {
      window.location = "/feed/" + aId;
    }

  });
