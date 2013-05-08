class Portfolio
	constructor: () ->
    console.log "test"
    # @initVax()

    # @initSockets()

  initSockets: () ->
    socket = io.connect("http://localhost:1337")
    socket.on "connect", ->
      console.log("Connected, lets sign-up for updates about votes for this event")
      socket.emit('vote', 'test vote')

      socket.request "/user", {}, (users) ->
        console.log users

      socket.on "message", (message) ->
        console.log "Got message:", message

      socket.request "/echo",
        message: "hi there!"
      , (response) ->
        console.log response

      socket.on 'vote', (data) ->
        console.log vote
        socket.emit('my other event', { my: 'data' });

    $(window).load ->
      $("[data-behavior~='submit-vote']").on 'click', (e) ->
        e.preventDefault()
        vote = 1
        socket.in(event.shortname).emit('vote', vote)

    # response === {success: true, message: 'hi there!'}

  initVax: () ->
    VAXrand = (seed) ->
      s = ((69069 * seed + 1) % parseInt(Math.pow(2,32)))
      s

    tempseed = 0
    res = 0
    n = 0

    tempseed = 6

    for i in [0..10] by 1
      res = VAXrand(tempseed)
      console.log "Starting seed: #{tempseed}, seed mod 36: #{tempseed % 36}, result: #{res}, result mod 36: #{res%36}"
      tempseed = res


window.portfolio = new Portfolio()