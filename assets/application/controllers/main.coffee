'use strict'

class MainCtrl
  constructor: () ->
    Application.Controllers.controller "MainCtrl", ["$scope", ($scope) ->
      $scope.foo = "booyah"
    ]

window.MainCtrl = new MainCtrl()