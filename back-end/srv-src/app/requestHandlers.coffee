tools = require '../tools'
linode = require '../app/linode.js'
Reqs = require '../lib/reqs.js'

serv = Reqs.new(
    'send': (data) -> if this.readyState is 1 then this.sendText data
    API:
        'ping': (time, cb) ->
            time = if time then Date.now() - time else 0
            res = 'time': Date.now(), 'ping': time
            if tools.isFunction cb
                cb res, this
            else
                serv.CPI.pong.call this, res
        'pong': (arg, cb) -> console.info '/ pong: to client, from client', arg.ping, Date.now() - arg.time
        'linodeListAll': (arg, cb) ->
            conn = this.conn
            # console.log 'linodeListAll -> ', conn
            # 'linodeListAll', conn
            linode.linodeListAll arg, (err, data) ->
                serv.CPI.linodeListAll.call conn, err, data
                # console.log 'linodeListAll CB', data
                # serv.CPI 'linodeListAll', conn # , data
        'linodeListAll1': (arg, cb) ->
            conn = this.conn
            linode.linodeListAll1 arg, (err, data) ->
                serv.CPI.linodeListAll1.call conn, err, data
        'linodeAll': (arg, cb)  ->
            conn = this.conn
            linode.linodeAll arg, (err, data) ->
                serv.CPI.linodeAll.call conn, err, data
)

exports.key = (k) -> linode.key k
exports.url = (u) -> linode.url u

exports.handle =
    root: (str) -> # this = connection
        try
            serv.parse str, this
        catch error
            console.error 'err', error
