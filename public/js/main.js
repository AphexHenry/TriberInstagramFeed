var app = angular.module('MyApp', []);

/*
 *  Angular.
 */
angular.module("mainModule", [])
  .controller("InputController", function ($scope, $http)
  {
  	$scope.submitForm = function ()
    {
      // get the table datas.
      $http.post("/getUsersWithName", {name:$scope.userName})
        .success(function (data, status, headers, config)
        {

        })
        .error(function (data, status, headers, config)
        {

        });
      }
  });
