# Socket service
Application.Services.factory "$socket", ["$rootScope", "User", ($rootScope, User) ->

  # $socket listeners
  # ================

  $socket = io.connect("http://localhost:1336")
  $socket.on "connect", (stream) ->
    console.log "someone connected!"

  $socket.on 'news', (data) ->
    console.log data
    $socket.emit 'my other event',
      my: 'data'

  $socket.on "onUserAdded", (user) ->
    scope = UsersController.getScope() # Get the scope of the UsersController
    user = User.get user
    console.log "onUserAdded called", user
    # scope.$apply ->
    scope.users.push user

  $socket.on "onUserUpdated", (user) ->
    scope = UsersController.getScope() # Get the scope of the UsersController
    console.log "onUserUpdated called", user
    users = User.query()
    # scope.$apply ->
    scope.users = users

  $socket.on "onUserDeleted", (user) ->
    scope = UsersController.getScope() # Get the scope of the UsersController
    console.log "onUserDeleted called", user
    scope.$apply ->
      scope.users = $.grep(scope.users, (o, i) ->
        o.id is user.id
      , true)

  $socket.removeListener "connect"
  $socket.removeListener "news"
  $socket.removeListener "onUserAdded"
  $socket.removeListener "onUserDeleted"
]