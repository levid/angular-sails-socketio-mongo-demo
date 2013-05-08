'use strict'

Application.Controllers.controller "UsersController", ["$rootScope", "$scope", "$location", "$socket", "User", "SessionService", "$route", "$routeParams", ($rootScope, $scope, $location, $socket, User, SessionService, $route, $routeParams) ->

  # Users class that is accessible by the window object
  #
  # @todo add a notifications handler
  # @todo add a proper error handler
  #
  class UsersController

    #### It's always nice to have a constructor to keep things organized
    #
    constructor: () ->
      @initScopedMethods()

    #### The index action
    #
    # @param [Object] $scope
    #
    # - The $scope object must be passed in to the method
    #   since it is a public static method
    #
    index: ($scope) ->
      console.log "#{$rootScope.action} action called"
      $scope.users = User.query((success) ->
        console.log success
      , (error) ->
        console.log error
      )


    #### The new action
    #
    # @param [Object] $scope
    #
    # - The $scope object must be passed in to the method
    #   since it is a public static method
    #
    new: ($scope) ->
      console.log "#{$rootScope.action} action called"
      # $scope.user = User.get(
      #   action: "new"
      # , (resource) ->
      #   console.log resource
      # , (response) ->
      #   console.log response
      # )


    #### The edit action
    #
    # @param [Object] $scope
    #
    # - The $scope object must be passed in to the method
    #   since it is a public static method
    #
    edit: ($scope) ->
      console.log "#{$rootScope.action} action called"
      if $routeParams.id
        $scope.user = User.get(
          id: $routeParams.id
          action: "edit"
        , (success) ->
          console.log success
        , (error) ->
          console.log error
        )

    #### The show action
    #
    # @param [Object] $scope
    #
    # - The $scope object must be passed in to the method
    #   since it is a public static method
    #
    show: ($scope) ->
      console.log "#{$rootScope.action} action called"
      if $routeParams.id
        $scope.user = User.get(
          id: $routeParams.id
        , (success) ->
          console.log success
        , (error) ->
          console.log error
        )

    #### The create action
    #
    # @param [Object] $scope
    #
    # - The $scope object must be passed in to the method
    #   since it is a public static method
    #
    # create: ($scope) ->
    #   console.log "#{$rootScope.action} action called"
    #   $scope.user = User.save {}, data, ((success) ->
    #     console.log success
    #   ), (error) ->
    #     console.log error

    #### The update action
    #
    # @param [Object] $scope
    #
    # - The $scope object must be passed in to the method
    #   since it is a public static method
    #
    # update: ($scope) ->
    #   console.log "#{$rootScope.action} action called"
    #   if $routeParams.id
    #     $scope.user = User.update
    #       id: $routeParams.id
    #     , $routeParams.data, ((success) ->
    #       console.log success
    #     ), (error) ->
    #       console.log error

    #### The delete action
    #
    # @param [Object] $scope
    #
    # - The $scope object must be passed in to the method
    #   since it is a public static method
    #
    # delete: ($scope) ->
    #   console.log "#{$rootScope.action} action called"
    #   $scope.users = User.query()
    #   $scope.user = User.delete(
    #     id: $routeParams.id
    #   , (resource) ->
    #     console.log resource
    #   , (response) ->
    #     console.log response
    #   )


    #### Get current scope
    #
    # This method acts as a public static method to grab the
    # current $scope outside of this class.
    # (ex: socket.coffee)
    #
    getScope: () ->
      return $scope

    #### Scoped methods
    #
    # These are helper methods accessible to the angular user views
    #
    initScopedMethods: () ->
      $scope.showMessage = ->
        $scope.message && $scope.message.length

      $scope.getUser = (user) ->
        user = User.get user
        user

      $scope.getAuthenticatedUser = ->
        user = SessionService.getUser()
        user

      $scope.setOrder = (orderby) ->
        if orderby is $scope.orderby
          $scope.reverse = !$scope.reverse
        $scope.orderby = orderby

      $scope.addUser = ->
        user = new User
          name:     $scope.inputData.name     if $scope.inputData.name.length
          email:    $scope.inputData.email    if $scope.inputData.email.length
          password: $scope.inputData.password if $scope.inputData.password.length

        User.save(user,
          success = (data, status, headers, config) ->
            $scope.message  = "New user added!"
            $scope.status   = 200
            $socket.emit "addUser", data # Broadcast to connected subscribers that a user has been added
            $location.path('/users') # Redirect to users index
          , error = (data, status, headers, config) ->
            $scope.message  = data.errors
            $scope.status   = status
        )

      $scope.updateUser = (user) ->
        user = {
          id:       $scope.user.id
          name:     $scope.user.name
          email:    $scope.user.email
          password: $scope.inputData.password
        }

        User.update($scope.user,
          success = (data, status, headers, config) ->
            $scope.message  = "User updated!"
            $scope.status   = 200
            $socket.emit "updateUser", data # Broadcast to connected subscribers that a user has been updated
            $location.path('/users') # Redirect to users index
            $rootScope.user = data

          , error = (data, status, headers, config) ->
            $scope.message  = data.errors
            $scope.status   = status
        )

      $scope.deleteUser = (user) ->
        r = confirm("Are you sure?");
        if r is true
          User.delete(
            id: user.id
          , (success) ->
            console.log success
            $scope.users = _.difference($scope.users, user)
            $socket.emit "deleteUser", user # Broadcast to connected subscribers that a user has been deleted
          , (error) ->
            console.log error
          )
        false

  window.UsersController = new UsersController()

]