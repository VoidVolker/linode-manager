tools = require '../tools'
convertData = require './convert.json'

exports.convert =
    linode: {}

itemsConvert = (data, convData) ->
    propIterator = (name, value, newProp) ->
        item = convData[name]
        if item is `undefined`
            newProp[name] =
                value: value
            if tools.isNumber value
                newProp[name].type = 'number'
            else if tools.isBoolean value
                newProp[name].type = 'bool'
            else
                newProp[name].type = 'string'
        else
            name = item.name
            newProp[name] =
                type: item.type
            if item.editable isnt `undefined` then newProp[name].editable = item.editable
            if item.hint isnt `undefined` then newProp[name].hint = item.hint
            if item.type is 'bool'
                newProp[name].value = tools.toBoolean value
            else
                newProp[name].value = value
        return

    if tools.isArray data
        result = []
        for prop in data
            newProp = {}
            for own name, value of prop
                propIterator name, value, newProp
            result.push newProp
    else
        result = {}
        for own name, value of data
            propIterator name, value, result

    return result

exports.convert.linode.state = (data) ->
    data = tools.deepSort data
    itemsConvert data, convertData.linode.state

exports.convert.linode.config = (data) ->
    data = tools.deepSort data
    itemsConvert data, convertData.linode.config

exports.convert.linode.disk = (data) ->
    data = tools.deepSort data
    itemsConvert data, convertData.linode.disk

exports.convert.linode.job = (data) ->
    itemsConvert data, convertData.linode.job

exports.convert.linode.ip = (data) ->
    data = tools.deepSort data
    result = itemsConvert data, convertData.linode.ip
    result.forEach (prop) -> prop['label'] = prop['ip_address']
    return result

exports.spec = (spec) ->

