'use strict'

Application.Controllers.controller "NavbarController", ["$scope", "$location", ($scope, $location) ->
  $scope.getClass = (path) ->
    if $location.path().substr(0, path.length) is path
      true
    else
      false
]