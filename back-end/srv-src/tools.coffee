osenv = require 'osenv'
fs = require 'fs'

t = Object.prototype.toString

exports.toInt = (v) -> parseInt(v, 10) || 0
exports.toFloat = (f) -> parseFloat(f, 10) || 0
exports.randomInt = (min, max) -> Math.floor( Math.random() * (max - min + 1) ) + min
exports.toBoolean = (v) ->
    not (
        v is 'false' ||
        v is '0' ||
        v is 'null' ||
        v is '' ||
        v is 0 ||
        v is null ||
        v is false ||
        v is undefined ||
        v isnt v
    )

exports.isNumber    = (s) -> s is s & t.call(s) is '[object Number]'
exports.isString    = isString = (s) -> t.call(s) is '[object String]'
exports.isArray     = isArray = (s) -> t.call(s) is '[object Array]'
exports.isObject    = isObject = (s) -> t.call(s) is '[object Object]'
exports.isFunction  = (s) -> t.call(s) is '[object Function]'
exports.isBoolean   = (s) -> t.call(s) is '[object Boolean]'
exports.isType      = (s,t) -> t.call(s).slice(8, -1) is t
exports.typeOf      = (s) -> t.call(s).slice(8, -1)

exports.msg = (n) -> msg[config.global.lngDef][n]

replaceTilda = (s) ->
    if s.indexOf('~') is 0
        s = s.split('~')[1]
        s = osenv.home() + s
    return s

exports.configLoad = (s) ->
    try
        # conf = require('../' + s )
        conf = require s
    catch error
        log.error 'Load error in "' + s + '"\n', error
        return {}

    if (conf.path isnt `undefined`) and (conf.path.localConfig isnt `undefined`) and fs.existsSync( conf.path.localConfig )
        lConf = replaceTilda conf.path.localConfig
        lConf = require lConf
        # objFor lConf, (val, key) -> conf[key] = lConf[key]
        conf[key] = val for key, val of lConf

    # objFor conf.path, (val, key) -> conf.path[key] = replaceTilda( conf.path[key] )
    conf.path[key] = replaceTilda( val ) for key, val of conf.path
    return conf;


exports.objSort = (object, sorter) ->
    sortedObj = {}
    keys = Object.keys(object)

    keys.sort (key1, key2) ->
        key1 = key1.toLowerCase()
        key2 = key2.toLowerCase()
        if key1 < key2
            -1
        else if key1 > key2
            1
        else
            0

    sortedObj[key] = object[key] for key in keys

    return sortedObj

exports.objDeepSort = objDeepSort = (object) ->
    if isObject object
        sortedObj = {}
        keys = Object.keys object

        keys.sort (key1, key2) ->
            key1 = key1.toLowerCase()
            key2 = key2.toLowerCase()
            if key1 < key2
                -1
            else if key1 > key2
                1
            else
                0

        for key in keys
            if isObject object[key]
                sortedObj[key] = objectDeepSort object[key]
            else
                sortedObj[key] = object[key]

        return sortedObj

    else if isArray object
        for item, i in object
            object[i] = objectDeepSort item

    return object


exports.deepSort = deepSort = (object) ->
    if isObject object
        sortedObj = {}
        keys = Object.keys object

        keys.sort (key1, key2) ->
            key1 = key1.toLowerCase()
            key2 = key2.toLowerCase()
            if key1 < key2
                -1
            else if key1 > key2
                1
            else
                0

        for key in keys
            if isObject object[key]
                sortedObj[key] = deepSort object[key]
            else
                sortedObj[key] = object[key]

        return sortedObj

    else if isArray object
        for item, i in object
            object[i] = deepSort item
        object.sort (a,b) ->
            k1 = Object.keys a
            k2 = Object.keys b
            if k1.length is 0
                return -1
            else if k2.length is 0
                return 1
            k1 = k1[0]
            k2 = k2[0]
            if k1 < k2
                return -1
            else if k2 < k1
                return 1
            else
                return 0

    return object

exports.num2str = `function num2str(num, len, base){
    base = base || 10;
    var res = num.toString(base).toUpperCase()
        , len
        , i = 0
    ;
    if( res.length < len ){
        len = len - res.length;
        for(i; i<len; i++){
            res = '0' + res;
        }
    } else if( res.length > len ) {
        res = res.slice( 0-len );
    }
    return res;
}`

exports.dump = `function dump(str){
    var lines
        , i = 0
        , len = str.length
        , lineLen = 16
        , newLine = ''
        , charCode
    ;
    if( !isString(str) ){ return }

    for(i; i<len; i++){
        if( i%lineLen === 0 ){
            newLine = ' ' + num2str( i, 8, 16 ) + '  ';
        } else {
            charCode = str.charCodeAt(i);
            if( i%4 === 0 ){ newLine += ' ' }
            newLine += num2str(charCode, 2, 16) + ' ' ;
            if( (i+1)%lineLen === 0 || i === len ){
                console.info(
                    newLine
                    , str.slice( Math.max(0,i-lineLen+1), Math.min(len, i+1) )
                );
            }
        }
    }
}`

exports.require = (s) ->
    r = {}
    # if s.indexOf('.') is 0
    #     s = '.' + s
    try
        log.info 'Loading app module:', s
        r = require s
    catch error
        log.error
        console.error 'Load error in "' + s + '"\n', error
        r = error
    return r

#

# exports.configLoad = configLoad;
# exports.require = toolsRequire;

# // console.log('global.require', global.require);