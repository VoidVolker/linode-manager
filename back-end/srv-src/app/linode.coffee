tools = require '../tools'
needle = require 'needle'
scripts = require('./scripts').init()

needleOptions =
    open_timeout: 5000 # if we don't get our response headers in 5 seconds, boom.
    json: false
    # compressed: true

Converter = require './converter'
ConvertLinode = Converter.convert.linode


errors =
    0: "ok"
    1: "Bad request"
    2: "No action was requested"
    3: "The requested class does not exist"
    4: "Authentication failed"
    5: "Object not found"
    6: "A required property is missing for this action"
    7: "Property is invalid"
    8: "A data validation error has occurred"
    9: "Method Not Implemented"
    10: "Too many batched requests"
    11: "RequestArray isn't valid JSON or WDDX"
    12: "Batch approaching timeout. Stopping here."
    13: "Permission denied"
    14: "API rate limit exceeded"
    30: "Charging the credit card failed"
    31: "Credit card is expired"
    40: "Limit of Linodes added per hour reached"
    41: "Linode must have no disks before delete"

srvUrl = 'https://api.linode.com/'
api_key = ''

_api_action = 'api_action'
_linodeList = 'linode.list'
_linodeConfigList = 'linode.config.list'
_linodeDiskList = 'linode.disk.list'
_linodeIpList = 'linode.ip.list'
_linodeJobList = 'linode.job.list'
_linodeID = 'LinodeID'
_apiSpec = 'api.spec'

liError = (n) ->
    return 'ERRORARRAY': [{
        'ERRORCODE': n
        'ERRORMESSAGE': errors[n]
    }]

exports.key = (k) -> api_key = k
exports.url = (u) -> srvUrl = u

exports.req = linodePost = (method, data, cb) ->
    needle.post srvUrl + '?api_key=' + api_key + '&' + _api_action + '=' + method, data, needleOptions, cb
    return

linodePostBatch = (arr, cb) ->
    needle.post(
        srvUrl
        {
            'api_key': api_key
            'api_action': 'batch'
            'api_requestArray': JSON.stringify( arr )
        }
        needleOptions
        (err, resp) -> cb err, resp.body.DATA
    )
    return

linodeGet = (method, data, cb) ->
    data['api_key'] = api_key
    data[_api_action] = method
    needle.request 'get', srvUrl, data, cb
    return

exports.linodeList = (data, cb) ->
    if tools.isNumber data
        data = LinodeID: data
    else
        data = {}
    linodeGet _linodeList, data, cb

exports.linodeListAll = (data, cb) ->
    # if tools.isNumber data
    #     data = LinodeID: data
    # else
    #     data = {}

    linodeGet( _linodeList
        {}
        (err, resp) ->
            if err
                console.error 'linodeListAll error', err
                cb err
                return

            try
                req = []
                data = resp.body.DATA
                if  tools.isArray data
                    for dataItem in data
                        req.push(
                            { 'api_action': _linodeConfigList, LinodeID: dataItem.LINODEID }
                            { 'api_action': _linodeDiskList, LinodeID: dataItem.LINODEID }
                            { 'api_action': _linodeIpList, LinodeID: dataItem.LINODEID }
                            { 'api_action': _linodeJobList, LinodeID: dataItem.LINODEID }
                        )
                else
                    req =
                        'ERRORARRAY': [{
                            'ERRORCODE': 101
                            'ERRORMESSAGE': 'Linode API answer is not array'
                        }]
                        'DATA': {}
                        'ACTION': _linodeList
                    cb err, req
                    return

                needle.post(
                    srvUrl
                    {
                        'api_key': api_key
                        'api_action': 'batch'
                        'api_requestArray': JSON.stringify req
                    }
                    needleOptions
                    (err, resp) ->
                        if err
                            cb err
                            console.error 'Linode API request error: ', err
                            return

                        respData = resp.body
                        result = []
                        for item, i in data
                            _id =       data[i].LINODEID
                            _state =    ConvertLinode.state data[i]
                            _config =   ConvertLinode.config respData[ i*4 ].DATA
                            _disk =     ConvertLinode.disk respData[ i*4+1 ].DATA
                            _ip =       ConvertLinode.ip respData[ i*4+2 ].DATA
                            _job =      ConvertLinode.job respData[ i*4+3 ].DATA
                            # propAddVar  _ip, 'label', 'ip_address'
                            result.push(
                                'id': _id
                                'state': _state
                                'config': _config
                                'disk': _disk
                                'ip': _ip
                                'job': _job
                                'scripts': scripts.all _id
                                # [
                                #     { label: {value: 'script 1'} },
                                #     { label: {value: 'script 2'} }
                                # ]
                            )
                        cb err, result
                )

            catch err
                cb err
                console.error 'Linode request error: ', err
    )

