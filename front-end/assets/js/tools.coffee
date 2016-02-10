class tools

    t = Object.prototype.toString

    tools.toInt = (v) -> parseInt(v, 10) || 0
    tools.toFloat = (f) -> parseFloat(f, 10) || 0
    tools.randomInt = (min, max) -> Math.floor( Math.random() * (max - min + 1) ) + min
    tools.toBoolean = (v) ->
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

    tools.isNumber    = (s) -> s is s & t.call(s) is '[object Number]'
    tools.isString    = isString = (s) -> t.call(s) is '[object String]'
    tools.isArray     = isArray = (s) -> t.call(s) is '[object Array]'
    tools.isObject    = isObject = (s) -> t.call(s) is '[object Object]'
    tools.isFunction  = (s) -> t.call(s) is '[object Function]'
    tools.isBoolean   = (s) -> t.call(s) is '[object Boolean]'
    tools.isType      = (s,t) -> t.call(s).slice(8, -1) is t
    tools.typeOf      = (s) -> t.call(s).slice(8, -1)
    tools.isSameType  = (a,b) -> t.call(a) is t.call(b)

    tools.objSort = (object) ->
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

    tools.objDeepSort = objDeepSort = (object) ->
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


    tools.deepSort = deepSort = (object) ->
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

    tools.num2str = `function num2str(num, len, base){
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

    tools.dump = `function dump(str){
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

    tools.locationParameter = (parameter) ->
        params = window.location.search.substr(1).split '&'

        for param in params
            p = param.split '='
            if p[0] is parameter
                return decodeURIComponent p[1]
        return undefined

    tools.locationParameters = ->
        params = window.location.search.substr(1).split '&'
        res = {}
        for param in params
            p = param.split '='
            res[ p[0] ] = decodeURIComponent p[1]
        return res

    # constructor: ->
