"use strict"

angular.module("application").controller "LoginCtrl", ["$rootScope", "$scope", "$location", "SessionService", ($rootScope, $scope, $location, SessionService) ->

  init = ->
    $scope.user = ''

  loginHandler = (res) ->
    if SessionService.authorized(res)
      $scope.message = "Authorized!"
      $rootScope.authenticatedUser = SessionService.getUser()
      $location.path "/users"
    else
      $scope.message = "Invalid username or password!"

  errorHandler = (err) ->
    $scope.message = "Error! " + err
  $scope.user = SessionService.getUser()

  $scope.login = ->
    SessionService.login $scope.user, loginHandler, errorHandler

  $scope.logout = ->
    SessionService.logout $scope.user, loginHandler, errorHandler

  $scope.showMessage = ->
    $scope.message and $scope.message.length

  init()

]