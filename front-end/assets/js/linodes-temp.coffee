class LinodeTemp
    ItemTemp = noop

    constructor: (temp) ->
        ItemTemp = temp
        return @

    str2uf = (str) ->
        str = str.replace /_/g, ' '
        str[0].toUpperCase() + str.slice 1



    tmpBlock = (options) ->
        if options.id is `undefined` then id = '' else id = 'id="' + options.id + '"'
        itemClass = options.class or ''
        title = options.title or ''
        obj = options.obj
        label = options.label
        filter = options.filter or []
        # editable = options.editable
        type = options.type
        linodeID = options.linodeID
        filter.push label
        dropdown = """
<div class="blockOptions uk-button-dropdown uk-dropdown-close" data-uk-dropdown="{mode:'click'}">
    <div>
        <button class="uk-button uk-button-mini" type="button">
            <i class="fa fa-2x fa-cog"></i>
        </button>
    </div>
    <div class="uk-dropdown uk-dropdown-flip">
        <ul class="uk-nav uk-nav-dropdown actions">
        </ul>
    </div>
</div>
"""
        result = '<div class="block hidden uk-panel uk-panel-box ' + itemClass + '" ' + id + '><h5><strong>' + title + obj[label].value + '</strong>' + dropdown + '</h5><ul class="uk-list uk-list-line"><li class="uk-nav-divider"></li>'

        # forObj obj, (item, key) ->
        for own key, item of obj
            if -1 is filter.indexOf key
                result += ItemTemp item, key
                # if editable
                #     result += '<li>' + str2uf(key) + '<input class="rightItem" linodeID="' + linodeID + '" type="' + type + '" key="' + key + '" value="' + item.value + '"></input></li>'
                #     if  type is `undefined`
                #         console.error '`options.type` for editable block is undefined'
                # else
                    # result += '<li>' + str2uf(key) + ItemTemp(item) + '</span></li>'


        result += '</ul></div>'

        return result

    addActions = (block, linode, actions) ->
        target = $ '.actions', block
        $actions = $()
        # blockDD = UIkit.dropdown $ '.blockOptions', block
        # console.log 'addActions', blockDD

        # console.log '.blockOptions', $ '.blockOptions', block
        for own name, action of actions
            $actions.push(
                $( '<li><a href="javascript:void(0);">' + name + '</a></li>' ).click( ->
                    action.call linode, block
                    # blockDD.hide()
                )[0]
            )

        target.append  $actions
        return

    activateInputs = (target) ->
        items = $ 'input', target
        items.on 'change', (e) ->
            console.log 'change', this

    state: (linode) ->
        block = $ tmpBlock
            id: 'state_' + linode.id
            obj: linode.state
            label: 'label'
            class: 'state linode' + linode.id
            linodeID: linode.id

        addActions block, linode,
            'update': ->
                    console.log('update')

        return block

    configs: (linode) ->
        configs = linode.config
        result = []
        for config, i in configs
            block = $ tmpBlock
                obj: config
                id: 'config_' + linode.id + '_' + i
                class: 'config linode' + linode.id
                title: linode.state.label.value + ' / config / '
                label: 'label'
                # editable: true
                type: 'config'
                filter: ['linode_id', '__validation_error_array']
                linodeID: linode.id
            activateInputs block
            result.push block
        return result

    disks: (linode) ->
        disks = linode.disk
        result = []
        for disk, i in disks
            block = $ tmpBlock
                obj: disk
                id: 'disk_' + linode.id + '_' + i
                class: 'disk linode' + linode.id
                title: linode.state.label.value + ' / disks / '
                label: 'label'
                # editable: false
                type: 'disk'
                filter: ['linode_id']
                linodeID: linode.id
            result.push block
        return result

    ips: (linode) ->
        ips = linode.ip
        result = []
        for ip, i in ips
            block = $ tmpBlock
                obj: ip
                id: 'ip_' + linode.id + '_' + i
                class: 'ip linode' + linode.id
                title: linode.state.label.value + ' / IP / '
                label: 'label'
                # editable: true
                type: 'ip'
                filter: ['linode_id']
                linodeID: linode.id
            # activateInputs block
            result.push block
        return result

    jobs: (linode) ->
        result = '<div class="block uk-panel uk-panel-box hidden" id="job_' + linode.id + '"><h5><strong>' + linode.state.label.value + ' / jobs</strong></h5><div class="uk-overflow-container"><table class="uk-table uk-table-hover uk-table-striped"><thead><tr>'
        filter = []

        # forObj linode.job[0], (value, key) ->
        for own key, value of linode.job[0]
            if filter.indexOf( key ) is -1
                result += '<th>' + str2uf( key ) + '</th>'

        result += '</tr></thead><tbody>'

        for job, i in linode.job
            result += '<tr>'

            # forObj job, (item, key) ->
            for own key, item of job
                if filter.indexOf( key ) is -1
                    result += '<td title="' + str2uf( key ) + ': ' + item.value + '">' + item.value + '</td>'

            result += '</tr>'

        result += '</tbody></table></div></div>'
        # console.log '\n\n\n\n', result
        return $ result


    # scriptsConfigTmp = ''

    # scriptsConfig: (linode) ->
    #     block = $ tmpBlock
    #         obj: script
    #         id: 'script_' + linode.id + '_' + i
    #         class: 'script linode' + linode.id
    #         title: linode.state.label.value + ' / scripts / '
    #         label: 'label'
    #         # editable: false
    #         type: 'script'
    #         # filter: ['linode_id']
    #         linodeID: linode.id
    #     $( '.uk-list', block ).append scriptTmp

    #     # addActions block, linode,
    #     #     'Run': ->
    #     #         console.log('Run')
    #     return block

    scriptTemp = (linode, name) ->
        script = $ '<li>
            <form class="uk-form">
                <fieldset data-uk-margin>
                    <div class="uk-form-row">
                        <button class="savet uk-button uk-button-primary" type="button" disabled>
                            <i class="fa fa-fw fa-floppy-o"></i> Save
                        </button>
                        <button class="cancel uk-button uk-button-danger" type="button" disabled>
                            <i class="fa fa-fw fa-undo"></i> Cancel
                        </button>
                        <input value="' + name + '" type="text" placeholder="" class="name uk-form-width-medium">
                    </div>
                    <div class="uk-form-row">
                        <textarea class="code" cols="" rows="15" placeholder="Script code"></textarea>
                    </div>
                </fieldset>
            </form>
            <div class="resultTitle">Result:</div>
            <div class="result"></div>
        </li>'
        save = $ '.save', script
        cancel = $ '.cancel', script
        name = $ '.name', script
        code = $ '.code', script

        code.on 'change', (e) ->
            console.log 'change', this

        code.on 'keydown', (e) ->
            console.log 'keydown', this

        return script

    scripts: (linode) ->
        scripts = linode.scripts
        result = []
        for script, i in scripts
            block = $ tmpBlock
                obj: script
                id: 'script_' + linode.id + '_' + i
                class: 'script linode' + linode.id
                title: linode.state.label.value + ' / scripts / '
                label: 'label'
                type: 'script'
                # filter: ['linode_id']
                linodeID: linode.id
            $( '.uk-list', block ).append scriptTemp linode, script.label.value

            addActions block, linode,
                'Run': (b) ->
                    console.log 'Run', $( '.scriptText', b ).val()
            result.push block
        return result