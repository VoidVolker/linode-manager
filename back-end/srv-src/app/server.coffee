http = require 'http'
url = require 'url'
ws = require 'nodejs-websocket'
tools = require '../tools'

ERR_404_CODE = 4404
ERR_404_STR = 'Not found'

# Http ws server
exports.start = (handle, port, host, secure, buf) ->
    ws.setMaxBufferLength buf  # Restrict buffer size
    log.info 'Server starting on:', host + ':' + port
    server = ws.createServer(
        secure: secure
        , (conn) ->
            # conn.on 'close', (code, reason) -> console.log 'Connection closed', code, reason ; return
            conn.on 'error', (err) -> # Я хз, но при закрытии коннекта сервером возникает ошибка ECONNRESET и сервер падает. Поэтому надо обрабатывать все ошибки соединений.
                if err.code is "ECONNRESET"
                   # console.log 'Connection close err ECONNRESET'
                else
                   log.error '--- Connection error ---', err

            try
                if tools.isFunction handle[conn.path]
                    conn.on 'text', handle[conn.path]
                else
                    conn.close ERR_404, ERR_404_STR
            catch error
                log.error 'Error while processing path "' + conn.path + '"', error
    )
    try
        server.listen port, host
    catch e
        log.error "Can't start server on:", port, host
    return server
