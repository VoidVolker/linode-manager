class Linodes
    types =
        linode:
            icon: 'fa fa-cube'
        state:
            icon: 'fa fa-eye'
        config:
            icon: 'fa fa-gears'
        disk:
            icon: 'fa fa-database'
        ip:
            icon: 'fa fa-map-marker'
            # icon: 'fa fa-th-large'
        job:
            icon: 'fa fa-tasks'
        script:
            icon: 'fa fa-code'

    constructor: (LinodesTemp, container) ->
        lin = @
        @name = 'linodes'
        # @types = types
        @$ = $ container
        @linodes = {}
        @temp = LinodesTemp
        @loader = (linodes) -> lin.load linodes
        @types = types
        return @

    load: (linodes) ->
        result = []
        result.push new @Linode linode, @temp, @$ for linode in linodes
        # console.log 'linodes is:', linodes, result
        return result


    ####################################################################################################
    ## Linode subclass
    #
    class Linode

        constructor: (linode, Temp, $cont) ->
            # @state linode.state
            r =
                type: 'linode'
                state:
                    opened: true
                text: '[ ' + linode.state.label.value + ' ]'
                data:
                    id: linode.id
                    target: '.linode' + linode.id
                children: [
                    new @state  $cont, linode, new Temp.state linode
                    # $cont, linode, props, propsBlock, title, type
                    new @props  $cont, linode, linode.config, 'Configs', 'config', new Temp.configs( linode )
                    new @props  $cont, linode, linode.disk, 'Disks', 'disk', new Temp.disks( linode )
                    new @props  $cont, linode, linode.ip, 'IP', 'ip', new Temp.ips( linode )
                    new @props  $cont, linode, linode.job, 'Jobs', 'job', new Temp.jobs( linode )
                    new @props  $cont, linode, linode.scripts, 'Scripts', 'script', new Temp.scripts( linode )

                    # new @configs    linode, $cont, new Temp.configs linode
                    # new @disks      linode, $cont, new Temp.disks linode
                    # new @ips        linode, $cont
                    # new @jobs       linode, $cont
                ]
            return r

        ##################################################
        ##
        #
        class state

            constructor: ($cont, linode, block) ->
                $cont.append block
                r =
                    text: 'State'
                    type: 'state'
                    data:
                        linode: linode
                        target: '#' + block.attr 'id'
                return r

        state: state

        ##################################################
        ##
        #
        class Props

            constructor: ($cont, linode, props, title, type, propsBlock) ->
                # console.log $cont, linode, props, propsBlock, title, type
                $cont.append propsBlock
                target = ''
                childrens = []
                if propsBlock instanceof jQuery
                    target = '#' + propsBlock.attr('id') + ' '
                else if propsBlock.length is 1
                    block = propsBlock[0]
                    target = '#' + block.attr('id') + ' '
                    title = props[0].label.value
                else
                    for block, i in propsBlock
                        target += '#' + block.attr('id') + ','
                        childrens.push new @prop linode, block, props[i].label.value, type
                    target = target.slice 0,-1

                r =
                    text: title
                    type: type
                    data:
                        linode: linode
                        target: target
                    children: childrens

                return r

            class Prop
                constructor: (linode, block, title, type) ->
                    r =
                        text: title
                        type: type
                        data:
                            linode: linode
                            target: '#' + block.attr 'id'
                    return r
            prop: Prop

        props: Props

        ##################################################
        ##
        #
        # class Ips
        #     constructor: (ips) ->
        #         r =
        #             text: 'IPs'
        #             type: 'ip'
        #         return r

        # ips: Ips

        ##################################################
        ##
        #
        # class Jobs
        #     constructor: (jobs) ->
        #         r =
        #             text: 'Jobs'
        #             type: 'job'
        #         return r

        # jobs: Jobs

    Linode: Linode

# config: Array[1]
# disk: Array[2]
# id: 741604
# ip: Array[2]
# job: Array[8]
# state: Object
