"use strict"

angular.module("application").controller "LoginCtrl", ["$rootScope", "$scope", "$location", "SessionService", ($rootScope, $scope, $location, SessionService) ->

  init = ->
    $scope.user = SessionService.getUser()

  loginHandler = (res) ->
    if SessionService.authorized(res)
      $scope.message = "Authorized!"
      $rootScope.user = SessionService.getUser()
      $scope.user = SessionService.getUser()
      $location.path "/users"
    else
      $scope.message = "Invalid username or password!"

  logoutHandler = (res) ->
    $scope.message = "Logged Out!"
    user = {
      name: ''
      email: ''
    }
    $scope.user = user
    $rootScope.user = user
    $location.path "/login"

  errorHandler = (err) ->
    $scope.message = "Error! " + err

  $scope.login = ->
    SessionService.login $scope.user, loginHandler, errorHandler

  $scope.logout = ->
    SessionService.logout $scope.user, logoutHandler, errorHandler

  $scope.showMessage = ->
    $scope.message and $scope.message.length

  init()

]