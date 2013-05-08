'use strict'

Application.Controllers.controller "AuthController", ["$rootScope", "$scope", "User", "SessionService", ($rootScope, $scope, User, SessionService) ->
  # Make this class accessible to the window object
  class AuthController

    #### It's always nice to have a constructor to keep things organized
    #
    constructor: () ->
      $scope.setAuthenticatedUser = ->
        authenticatedUser = SessionService.getUser()
        $rootScope.authenticatedUser = authenticatedUser if authenticatedUser.length

      $scope.getAuthenticatedUser = ->
        user = SessionService.getUser()
        user

      $scope.setAuthenticatedUser()

  window.AuthController = new AuthController()

]