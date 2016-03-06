tools = require '../tools'
fs = require 'fs-extra'

fileValidationRegex = /^[\w\-.\s]+$/
# Directory for linodes scripts
exports.path = process.env.HOME + '/.config/linode-manager-scripts'


exports.init = ->
    fs.ensureDirSync @path
    return @

exports.load  = (linodeId, filename, cb) ->
    if !tools.isString( linodeId )
        cb new Error 'Invalid linode ID'
        return
    if !tools.isString( fileName )
        cb new Error 'Invalid fileName'
        return
    fPath = this.path + '/' + linodeId + '/' + fileName
    fs.access(
        fPath
        fs.F_OK | fs.R_OK
        (err) ->
            if (err)
                cb err
                return
            fs.readFile(
                fPath
                (err, data) ->
                    if (err)
                        cb err
                        return
                    cb null, data
            )
    )

exports.list  = (linodeId, cb) ->
    if !tools.isString( linodeId )
        cb new Error 'Invalid linode ID'
        return
    fs.readdir(
        this.path + '/' + linodeId
        (err, files) ->
            if err
                cb err
                return
            cb null, files
    )

exports.save = (linodeId, fileName, data, cb) ->
    if !tools.isString( linodeId )
        cb new Error 'Invalid linode ID'
        return
    if !tools.isString( fileName )
        cb new Error 'Invalid fileName'
        return
    if !tools.isString( data )
        cb new Error 'Invalid data'
        return

    if !fileName.match fileValidationRegex
        cb new Error 'Invalid filename'
        return

    fs.outputFile(
        this.path + '/' + linodeId + '/' + fileName
        data
        (err) ->
            if err
                cb err
            else
                cb null
    )

exports.all = (linodeID) ->
    try
        dir = this.path + '/' + linodeID
        fs.ensureDirSync dir
        files = fs.readdirSync dir
        result = new Array files.length
        # console.log 'files', files
        for file, i in files
            result[i] =
                label: value: file
                data: fs.readFileSync(dir + '/' + file).toString()
        # console.log 'result', result
        return result

    catch e
        return [{ error: e.message }]

