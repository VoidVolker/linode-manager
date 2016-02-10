class Tree
    loadingMsg = new String('Loading tree...')
    hiddenClass = 'hidden'

    treeOptions =
        core:
            animation: 0
            check_callback: (operation, node, node_parent, node_position, more) ->
                    # operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
                    # in case of 'rename_node' node_position is filled with the new node name
                    if operation is 'move_node'
                        return (node.data && node.data.is_draggable) is true
                    return true
            themes:
                # name: 'default'
                dots: true
                icons: true
                # stripes: true
            data: [
                { text: 'Loading linodes...', type: 'loading' }
                # { text: 'Loading tree... 2', type: 'loading', bem: 'this is data from item 2', data: 'this is data 2' }
            ]
            state: key: 'demo2'
        plugins: [
            'contextmenu'
            'dnd'
            'search'
            'state'
            'wholerow'
            'types'
            'unique'
            'bem'
        ]
        contextmenu:
            items: (node, cb) ->
                if node.data and node.data.contextmenu
                    cb node.data.contextmenu
                return
        dnd:
            check_while_dragging: true
        types:
            default:
                icon: 'fa fa-fw fa-file-o'
            folder:
                icon: 'fa fa-fw fa-folder-o'
            module:
                icon: 'fa fa-fw fa-cubes'
            loading:
                icon: 'fa fa-fw fa-spinner fa-spin'

    constructor: (treeCnt, contentCnt, loader, types) ->
        $.extend true, treeOptions.types, types
        @treeCnt = $ treeCnt
        @contentCnt = $ contentCnt
        @$tree = @treeCnt.jstree treeOptions
        @tree = @treeCnt.jstree true
        @data = {}
        @loader = loader

        @selectedNodes = []
        t = @

        @$tree.on 'select_node.jstree', (e, obj) ->
            node = obj.node
            data = node.data
            if data and data.target
                target = data.target
                t.selectedNodes.push node
                if tools.isFunction target
                    target = target.call this, e, obj
                    # $( target ).removeClass hiddenClass
                # else if target instanceof jQuery
                #     target.removeClass hiddenClass
                # else
                    # $( target ).removeClass hiddenClass
                $( target ).removeClass hiddenClass
                # if isFunction node.bem.onShow
                #     data.bem.onShow.call this, e, obj, node

        @$tree.on 'deselect_node.jstree', (e, obj) ->
            # console.log 'deselect_node.jstree', obj
            node = obj.node
            data = node.data
            if data and data.target
                target = data.target
                if tools.isFunction target
                    target = target.call this, e, obj
                $( target ).addClass hiddenClass
                i = t.selectedNodes.indexOf node
                if i isnt -1 then t.selectedNodes.splice i, 1
                # if isFunction node.bem.onHide
                #     data.bem.onHide.call this, e, obj, node

        @$tree.on 'deselect_all.jstree', (e, obj) ->
            # console.log 'deselect_all.jstree', obj
            nodes = t.selectedNodes
            for node in nodes
                target = node.data.target
                if target isnt `undefined`
                    if tools.isFunction target
                        target = target.call this, e, obj
                    $( target ).addClass hiddenClass

        return @

    load: (data) ->
        @data = data
        @tree.settings.core.data = @loader data
        @tree.refresh()
        return @
