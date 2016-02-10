class ItemsTemp

    str2uf = (str) ->
        str = str.replace /_/g, ' '
        str[0].toUpperCase() + str.slice 1

    itmp = (item, name) ->
        result = '<li class="itemWrap uk-form" title="' + (item.hint || '') + '" uk-form>'
        if name then result += '<span class="itemTitle">' + str2uf( name ) + '</span>'
        result += itmp[item.type] item, name
        result += '</li>'
        return result

    itmp.string = (item, name) ->
        if item.editable is true
            '<input class="rightItem item" key="' + name + '" value="' + item.value + '"/>'
        else
            '<span class="rightItem item" key="' + name + '">' + item.value + '</span>'

    itmp.number = (item, name) ->
        @string(item, name)

    itmp.bool = (item, name) ->
        slected1 = slected2 = ''
        if item.value
            slected1 = 'selected'
            val = 'Yes'
        else
            val = 'No'
            slected2 = 'selected'

        if item.editable is true
            '<div class="uk-form uk-form-select rightItem" data-uk-form-select>
                <select class="item" key="' + name + '">
                    <option value="true" ' + slected1 + '>Yes</option>
                    <option value="false" ' + slected2 + '>No</option>
                </select>
            </div>'
        else
            '<span class="rightItem item">' + val + '</span>'

    itmp.array = (item, name) ->
        result = ''
        if isArray item.value
            # for el in item.value
            #     itmp.
        else
            console.warning 'Wrong value type in item:', name, item.value
            result += item.value.toString()
        return result
        # @string(item, name)

    itmp.list = (item, name) ->
        result = '<div class="uk-form uk-form-select rightItem" data-uk-form-select>
            <select class="item" key="' + name + '">'
        if isArray item.value
            if item.selected then selectedVal = item.selected.toString()
            for val in item.value
                val = val.toString()
                if selectedVal and selectedVal is val
                    result += '<option selected>' + val + '</option>'
                else
                    result += '<option>' + val + '</option>'
        else
            console.warning 'Wrong value type in item:', name, item.value
            result += item.value.toString()
        result += '</select></div>'
        return result

    constructor: ->
        return itmp
