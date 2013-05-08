'use strict'

Application.Controllers.controller "UsersController", ["$rootScope", "$scope", "$location", "usersService", "$socket", "User", "SessionService", "$route", "$routeParams", ($rootScope, $scope, $location, usersService, $socket, User, SessionService, $route, $routeParams) ->
  # Make this class accessible to the window object
  class UsersController
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


    getScope: () ->
      return $scope

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
          name: $scope.inputData.name if $scope.inputData.name.length
          email: $scope.inputData.email if $scope.inputData.email.length
          password: $scope.inputData.password if $scope.inputData.password.length

        user.$save(user,
          success = (data, status, headers, config) ->
            $scope.message = "New user added!"
            $scope.status = 200
            $socket.emit "addUser", data
            $location.path('/users')
          , error = (data, status, headers, config) ->
            $scope.message = data.errors
            $scope.status = status
            # angular.element(".errors").html(data.errors.join("<br>")).slideDown()
        )

      $scope.updateUser = (user) ->
        user = {
          id: $scope.user.id
          name: $scope.user.name
          email: $scope.user.email
          password: $scope.inputData.password
        }

        $scope.user.$update($scope.user,
          success = (data, status, headers, config) ->
            $scope.message = "User updated!"
            $scope.status = 200
            $socket.emit "updateUser", data
            $location.path('/users')
          , error = (data, status, headers, config) ->
            $scope.message = data.errors
            $scope.status = status
            # angular.element(".errors").html(data.errors.join("<br>")).slideDown()
        )

      $scope.deleteUser = (user) ->
        r = confirm("Are you sure?");
        if r is true
          User.delete(
            id: user.id
          , (success) ->
            console.log success
            $scope.users = _.difference($scope.users, user)
            $socket.emit "deleteUser", user
          , (error) ->
            console.log error
          )
        false


      # users = usersService.getUsers($scope, (data, $scope) ->
      #   $scope.$apply ->
      #     $scope.users = data
      # )

      # $socket.on "onUserAdded", (data) ->
      #   console.log "onUserAdded called", data
      #   $scope.$apply ->
      #     $scope.users.push
      #       id: data.id
      #       name: data.name
      #       email: data.email

      # $socket.on "onUserDeleted", (data) ->
      #   console.log "onUserDeleted called", data
      #   i = $scope.users.length - 1

      #   while i >= 0
      #     if i is parseInt(data.id)
      #       $scope.$apply ->
      #         $scope.users.splice i, 1

      #       break
      #     i--

      # $scope.addUser = ->
      #   name = $scope.inputData.name
      #   email = $scope.inputData.email
      #   password = $scope.inputData.password
      #   usersService.insertUser name, email, (data) ->
      #     userData =
      #       id: data.id
      #       name: data.name
      #       email: data.email
      #       password: data.password

      #     $scope.$apply ->
      #       $scope.users.push userData
      #       $socket.emit "addUser", userData

      #   $scope.inputData.name = ""
      #   $scope.inputData.email = ""
      #   $scope.inputData.password = ""

      # $scope.deleteUser = (user) ->
      #   usersService.deleteUser user.id, ->
      #     $scope.users = _.difference($scope.users, user)
      #     $socket.emit "deleteUser", user

  window.UsersController = new UsersController()

]