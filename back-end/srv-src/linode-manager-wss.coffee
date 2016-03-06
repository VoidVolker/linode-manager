require('source-map-support').install() # Support for source maps


osenv = require 'osenv'
http = require 'http'
https = require 'https'
url = require 'url'
util = require 'util'
fs = require 'fs-extra'
needle = require 'needle'
rufus = require 'rufus'
rc = require 'rc'

rufus.config(
    formatters:
        'simple': '[%level] %message%n'
        'details': '[%date] %logger.%level: %message%n'
    handlers:
        'terminal':
            'class': rufus.handlers.Console
            'formatter': 'details'
            'level': rufus.VERBOSE
            colorize: true
        'logfile':
            'class': rufus.handlers.File
            'level': rufus.VERBOSE
            'file': './log/linode-wss.log'
            'formatter': 'details'
    loggers:
        'main':
            'handlers': ['terminal', 'logfile']
            'level': 'INFO'
            'handleExceptions': true
            'exitOnError': false
            'propagate': false
)

rufus.console()
global.log = rufus.getLogger 'main'

# // logDB = rufus.getLogger('main.db');
# ----------------------------------------------------------------------------------------------------
# Loading additional libs
log.info 'Loading additional libs'
Reqs = require './lib/reqs'

process.on 'uncaughtException', (err) ->
    console.error 'Caught exception: ', err



try
    # Loading application modules

    log.info 'Loading msgs'
    msgs = require './msgs.json'
    log.info 'Loading tools'
    tools = require './tools'
    log.info 'Loading config'
    config = rc(
        'linode-manager-wss'
        'server':
            'port': 20200
            'secure': false
            'host': 'localhost'
            'buffer': 102400
        'linode':
            'key': ''
            'url': 'https://api.linode.com/'
    )
    # console.log 'config', config

    Server = tools.require './app/server'
    requestHandlers = tools.require './app/requestHandlers'
    requestHandlers.config = config
    # API key and url
    requestHandlers.key config.linode.key
    requestHandlers.url config.linode.url

    Handlers = requestHandlers.handle

    handle = '/': Handlers.root
    # serverConfig = Config.server

    srv = Server.start(
        handle
        config.server.port
        config.server.host
        config.server.secure
        config.server.buffer
    )

catch error
    console.error 'Error at program laod', error
