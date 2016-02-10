
$.jstree.defaults.bem = {}
$.jstree.plugins.bem = (options, parent) ->
    hiddenClass = 'hidden'

    this.init = (el, options) ->
        selectedNodes = []
        el = $ el
        # console.log 'bem init'

        el.on 'select_node.jstree', (e, obj) ->
            # console.log 'select_node.jstree', obj
            node = obj.node
            data = node.data
            if data and data.target
                target = data.target
                selectedNodes.push node

                if tools.isFunction target
                    target = target.call this, e, obj
                $( target ).removeClass hiddenClass
                # if isFunction node.bem.onShow
                #     data.bem.onShow.call this, e, obj, node

        el.on 'deselect_node.jstree', (e, obj) ->
            # console.log 'deselect_node.jstree', obj
            node = obj.node
            data = node.data
            if data and data.target
                target = data.target
                if tools.isFunction target
                    target = target.call this, e, obj
                $( target ).addClass hiddenClass
                i = selectedNodes.indexOf node
                if i isnt -1 then selectedNodes.splice i, 1
                # if isFunction node.bem.onHide
                #     data.bem.onHide.call this, e, obj, node

        el.on 'deselect_all.jstree', (e, obj) ->
            # console.log 'deselect_all.jstree', obj
            nodes = selectedNodes
            for node in nodes
                target = node.data.target
                if target isnt `undefined`
                    if tools.isFunction target
                        target = target.call this, e, obj
                    $( target ).addClass hiddenClass

        parent.init.call this, el, options
        return

    return
