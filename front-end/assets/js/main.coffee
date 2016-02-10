$window = $()
$body = $()
id = {}
APP = {}
noop = ->

class Main

    linodesTree = api = 0

    ###################################################################################################
    # API
    apiList =
        linodeListAll: (err, data) ->
            # console.log 'linodeListAll', err, data
            if err
                UIkit.notify 'Error when loading data from server: ' + err.message
                return
            linodesTree.load data
            return
        linodeAll: (err, data) ->
            if err
                UIkit.notify 'Error when loading data from server: ' + err.message
                return
            console.log 'linodeAll', data
            return

    createApi = ->
        new API (d) ->
            if APP.WS.readyState is 1
                APP.WS.send d
            return
        , apiList

    ###################################################################################################
    # WebSockets

    connect = (obj) ->
        console.log 'Connecting...'
        reconnectTimer = null
        $linodes = $ '#linodes'
        $state = $ '#state'
        new WS
            host: document.location.hostname
            port: 20200
            open:  (e) ->
                obj.WS = this
                # console.log 'Connected'
                $linodes.empty();
                APP.API.CPI.linodeListAll()
                $state.text 'Connected'
                return
            msg:   (e) ->
                api.parse e.data
                return
            error: (e) ->
                # console.error 'Server connection error', e
                $state.text 'Error'
                return
            close: (e) ->
                # if reconnectTimer then clearInterval reconnectTimer
                # reconnectTimer = setTimeout -> connect obj, 3000
                if not reconnectTimer
                    reconnectTimer = setTimeout ->
                        $state.text 'Connecting...'
                        reconnectTimer = null
                        connect obj, 3000
                return

    ###################################################################################################
    # Linodes
    #
    # new Linodes
        # new Linode
            # Prop category
                # Prop
    createLinodesTree = ( loader, types ) ->
        new Tree '#linodesTree', '#linodes', loader, types

    constructor: ->
        `$window = $(window); $body = $(window.body)`
        linodes = new Linodes new LinodeTemp( new ItemsTemp ), '#linodes'
        linodesTree = createLinodesTree( linodes.loader, linodes.types  )
        APP.API = api = createApi()
        connect APP

    # $ Main